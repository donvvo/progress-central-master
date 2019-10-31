var moment = require('moment')
var _ = require('underscore')
var formidable = require('formidable')
var fs = require('fs'),
  gm = require('gm'),
  AWS = require('aws-sdk'),
  s3 = new AWS.S3({region: 'us-east-1', apiVersion: '2006-03-01'}),
  mime = require('mime')

var email = require('../../lib/email')

var Course = require('../../models/course.js')
var User = require('../../models/user.js')

exports.getAllCourses = function(req, res, next) {
  Course.find({}, function(err, courses) {
    if (err) return next(err)

    res.json({ courses: courses })
  })
}

exports.getRegisteredCourses = function(req, res, next) {
  var course_ids = (req.user.courses && req.user.courses.map((course) => {
      return course._id
    })) || []
  Course.find({ '_id': { $in: course_ids }}, function(err, courses) {
    if (err) return next(err)
    
    res.json({ courses: courses })
  })
}

exports.getACourse = function(req, res, next) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    res.json(course)
  })
}

var validateCourse = function(req, res, next) {
  req.checkBody('name', 'Please enter a name for this course').notEmpty()
  req.checkBody('course_start').notEmpty().isDate()
  req.checkBody('course_end').notEmpty().isDate()

  var errors = req.validationErrors(true)
  if (errors) {
    return errors
  }

  var course_start = req.body.course_start 
  var course_end = req.body.course_end
  if (!moment(course_start).isBefore(course_end)) {
    return {
      course_end: {
        param: 'course_end',
        msg: 'Course end date should be after start date',
        value: course_end
      }
    }
  }
}

exports.createCourse = function(req, res, next) {
  if (req.user.user_type !== 'ADMIN') {
    return res.status(401).json()
  }

  var errors = validateCourse(req, res, next)
  if (errors) return res.status(500).json(errors)

  var course = new Course({
    name: req.body.name, 
    description: req.body.description,
    course_start: moment(req.body.course_start),
    course_end: moment(req.body.course_end)
  })
  course.save(function(err, course) {
    if (err) return next(err)

    res.json({course: course})
  })
}

exports.editCourse = function(req, res, next) {
  if (req.user.user_type !== 'ADMIN' && req.user.user_type !== 'INSTRUCTOR') {
    return res.status(401).json()
  }
  
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    var errors = validateCourse(req, res, next)
    if (errors) return res.status(500).json(errors)

    course.name = req.body.name
    course.description = req.body.description
    course.course_start = moment(req.body.course_start) 
    course.course_end = moment(req.body.course_end)
    course.save(function(err, course) {
      if (err) return next(err)

      res.json({course: course})
    })
  })
}

exports.deleteCourse = function(req, res, next) {
  Course.findByIdAndRemove(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    User.update({'courses._id': course._id},
      {'$pull': {'courses': {'_id': course._id}}}, 
      {multi: true}, function(err, result) {
        if (err) return next(err)

        res.json({course: course})
      })
  })
}

exports.getLesson = function(req, res, next) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    var lesson = course.lessons.id(req.params.lesson_id)
    if (!lesson) return next()

    if (lesson.content.content) {
      var unescapedContent = course.getHTMLLesson(req.params.lesson_id)
      lesson.content.content = unescapedContent
    }
    res.json(lesson)
  })
}

exports.addLesson = function(req, res, next) {
  if (req.user.user_type !== 'ADMIN' && req.user.user_type !== 'INSTRUCTOR') {
    return res.status(401).json()
  }
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    var form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
      if (err) return next(err)

      if (!fields.name) return next(new Error("'name' field is required"))

      var lesson = {
        name: fields.name,
        description: fields.description,
        content: {
          content_type: fields.content_type,
        }
      }

      /* Make sure all the expected callbacks are run */
      var expectedCounter = 0
      var currentCounter = 0
      var serverRes = res

      var video = files.video
      var pdf = files.pdf
      if (!video) {
        lesson.content.media_url = fields.video_url || fields.media_url
      }
      else {
        expectedCounter++

        var videoName = `${Date.now()}_${video.name}`
        var videoBody = fs.createReadStream(video.path)

        var videoData = {
          Bucket: 'progresscentral',
          Key: videoName,
          Body: videoBody,
          ContentType: mime.lookup(videoName)
        }

        s3.upload(videoData, function(err, res) {
          if (err) return next(err)

          lesson.content.media_url = `http://s3.amazonaws.com/progresscentral/${videoName}`
          currentCounter++

          if (expectedCounter === currentCounter) {
            return saveLesson(req, serverRes, next, course, lesson, fields.content)
          }
        })
      }

      if (!pdf) {
        lesson.content.pdf_url = fields.pdf_url
      }
      else {
        expectedCounter++

        var pdfName = `${Date.now()}_${pdf.name}`
        var pdfBody = fs.createReadStream(pdf.path)

        var pdfData = {
          Bucket: 'progresscentral',
          Key: pdfName,
          Body: pdfBody,
          ContentType: mime.lookup(pdfName)
        }

        s3.upload(pdfData, function(err, res) {
          if (err) return next(err)

          lesson.content.pdf_url = `http://s3.amazonaws.com/progresscentral/${pdfName}`
          currentCounter++

          if (expectedCounter === currentCounter) {
            return saveLesson(req, serverRes, next, course, lesson, fields.content)
          }
        })
      }

      /* No upload */
      if (!video && !pdf) {
        return saveLesson(req, res, next, course, lesson, fields.content)
      }
    })
  })
}

function pushLesson(course, lesson, content) {
  course.lessons.push(lesson)
  var lesson_id = course.lessons[course.lessons.length - 1]._id
  course.setHTMLLesson(lesson_id, content) 
}

function saveLesson(req, res, next, course, lesson, content) {
  pushLesson(course, lesson, content)
  
  course.save(function(err, course) {
    if (err) return next(err)

    var notification = {
      'title': `Lesson added for ${course.name}`,
      'content': `A new lesson, ${lesson.name} is added for ${course.name}`
    }

    User.update({'courses._id': course.id},
      {
        '$push': {
          notifications: {
            '$each': [notification],
            '$slice': -50
          }
        }
      }, {multi: true}, function(err, students) {
        if(err) return next(err)

        res.json({course: course})
      })
  })
}

exports.editLesson = function(req, res, next) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()
    
    var lesson = course.lessons.id(req.params.lesson_id)
    if (!lesson) {
      return res.status(500).json()
    }

    var form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
      if (err) return next(err)

      if (!fields.name) return next(new Error("'name' field is required"))

      lesson.name = fields.name
      lesson.description = fields.description

      /* Make sure all the expected callbacks are run */
      var expectedCounter = 0
      var currentCounter = 0
      var serverRes = res

      var video = files.video
      var pdf = files.pdf

      if (!video) {
        lesson.content.media_url = fields.video_url || fields.media_url
      }
      else {
        expectedCounter++

        var videoName = `${Date.now()}_${video.name}`
        var videoBody = fs.createReadStream(video.path)

        var videoData = {
          Bucket: 'progresscentral',
          Key: videoName,
          Body: videoBody,
          ContentType: mime.lookup(videoName)
        }

        s3.upload(videoData, function(err, res) {
          if (err) return next(err)

          lesson.content.media_url = `http://s3.amazonaws.com/progresscentral/${videoName}`
          currentCounter++

          if (expectedCounter === currentCounter) {
            course.setHTMLLesson(lesson._id, req.body.content)

            return course.save(function(err, course) {
              if (err) return next(err)
              serverRes.json({course: course})
            })
          }
        })
      }

      if (!pdf) {
        lesson.content.pdf_url = fields.pdf_url
      }
      else {
        expectedCounter++

        var pdfName = `${Date.now()}_${pdf.name}`
        var pdfBody = fs.createReadStream(pdf.path)

        var pdfData = {
          Bucket: 'progresscentral',
          Key: pdfName,
          Body: pdfBody,
          ContentType: mime.lookup(pdfName)
        }

        s3.upload(pdfData, function(err, res) {
          if (err) return next(err)

          lesson.content.pdf_url = `http://s3.amazonaws.com/progresscentral/${pdfName}`
          currentCounter++

          if (expectedCounter === currentCounter) {
            course.setHTMLLesson(lesson._id, req.body.content)

            return course.save(function(err, course) {
              if (err) return next(err)
              serverRes.json({course: course})
            })
          }
        })
      }

      /* No upload */
      if (!video && !pdf) {
        course.setHTMLLesson(lesson._id, fields.content)

        return course.save(function(err, course) {
          if (err) return next(err)
          res.json({course: course})
        })
      }
    })
  })
}

exports.deleteLesson = function(req, res, next) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    course.lessons.id(req.params.lesson_id).remove()
    course.save(function(err, course) {
      if (err) return next(err)

      User.update({'courses._id': course._id},
        {'$pull': {'courses.$.completed_lessons': req.params.lesson_id}},
        {multi: true}, function(err, result) {
          if (err) return next(err)

          res.json({course: course})
        })
    })
  })
}

exports.addEditAssignment = function(req, res, next) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    req.checkBody('name', 'Please enter a name for this assignment').notEmpty()
    if (req.body.due_date) req.checkBody('due_date').isDate()

    var errors = req.validationErrors(true)
    if (errors) {
      errors.msg = 'error'
      return res.json(errors)
    }

    if (req.body.due_date && !moment().isBefore(req.body.due_date)) {
      return res.json({
        msg: 'error',
        due_date: {
          param: 'due_date',
          msg: 'Due date must be later than now',
          value: req.body.due_date
        }
      })
    }

    var assignment
    if (req.method === 'POST' && req.params.assignment_id === undefined) {
      assignment = {}
    }
    else {
      assignment = course.assignment.id(req.params.assignment_id)
    }
    assignment.name = req.body.name
    if (req.body.due_date) assignment.due_date = moment(req.body.due_date)
    if (req.body.description) assignment.description = req.body.description
    if (req.body.status) assignment.status = req.body.status

    if (!assignment._id) {
      course.assignment.push(assignment)
    }

    course.save(function(err, course) {
      if (err) return next(err)

      return res.json({
        msg: 'success',
        assignment: req.params.assignment_id ? course.assignment.id(req.params.assignment_id) : course.assignment.pop()
      })
    })
  })
}

exports.addEditQuestion = function(req, res, next) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    req.checkBody('name', 'Please enter a name for this question').notEmpty()
    req.checkBody('question_type', 'Please select a type for this question').notEmpty()

    var errors = req.validationErrors(true)
    if (errors) {
      errors.msg = 'error'
      return res.json(errors)
    }

    var assignment = course.assignment.id(req.params.assignment_id),
      question
    if (req.method === 'POST' && req.params.quesiton_id === undefined) {
      question = {}
    }
    else {
      question = assignment.question.id(req.params.question_id)
      
      if (!question) {
        return next()
      }
    }
    question.name = req.body.name
    question.question_type = req.body.question_type
    if (req.body.prompt) question.prompt = req.body.prompt
    question.multiple_choices = req.body.multiple_choices

    if (!question._id) {
      assignment.question.push(question)
    }

    course.save(function(err, course) {
      if (err) return next(err)

      return res.json({
        msg: 'success',
        question: req.params.question_id ? assignment.question.id(req.params.question_id) : assignment.question.pop()
      })
    })
  })
}

exports.deleteQuestion = function(req, res, next) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) return next(err)
    if (!course) return next()

    console.log(req.params.assignment_id)
    var assignment = course.assignment.id(req.params.assignment_id)
    console.log(assignment)
    if (!assignment) return next()

    assignment.question.id(req.params.question_id).remove()
    course.save(function(err, course) {
      if (err) return next(err)

      res.json({msg: 'success', course: course})
    })
  })
}

exports.getRegisteredStudents = function(req, res, next) {
  User.find({
    'courses._id': req.params.course_id,
    'user_type': 'STUDENT'
  }, function(err, users) {
    if (err) return next(err)

    res.json({students: users})
  })
}

exports.getUnregisteredStudents = function(req, res, next) {
  User.find({
      'courses._id': { '$ne': req.params.course_id },
      'user_type': 'STUDENT',
      'status': 'ACTIVE'
    },
    function(err, users) {
      if (err) return next(err)

      res.json({students: users})
    })
}

exports.getRegisteredInstructors = function(req, res, next) {
  User.find({
    'courses._id': req.params.course_id,
    'user_type': 'INSTRUCTOR'
  }, function(err, users) {
    if (err) return next(err)

    res.json({instructors: users})
  })
}

exports.getUnregisteredInstructors = function(req, res, next) {
  User.find({
      'courses._id': { '$ne': req.params.course_id },
      'user_type': 'INSTRUCTOR',
      'status': 'ACTIVE'
    },
    function(err, users) {
      if (err) return next(err)

      res.json({instructors: users})
    })
}

//TODO: Unregister students
//TODO: Separate out instructor and student registration
exports.registerUsers = function(req, res, next) {
  user_ids = req.body.user_ids
  course_id = req.params.course_id
  
  var course_name = req.body.course.name
  
  if (!user_ids) return next(new Error('Invalid parameter'))
  var notification = {
    'title': `Course Registration: ${course_name}`,
    'content': `You are registered to a new course, ${course_name}`
  }
  User.update({'_id': { '$in': user_ids }, 'courses._id': { '$ne': course_id }},
    { 
      "$addToSet": { courses: {_id: req.params.course_id}}, 
      '$push': { 
        notifications: {
          '$each': [notification],
          '$slice': -50
        } 
      }
    }, {multi: true}, function(err, users) {
      if(err) return next(err)
      
      if (users.length > 0) {
        var users_emails = users.map(function(user) {
          return users.email
        })
        email.registeredToCourse(users_emails, course_name, function(err, body) {
          if (err) return next(err)

          res.json({users: users})
        })
      }
      else {
        res.json({users: users})
      } 
    })
}
