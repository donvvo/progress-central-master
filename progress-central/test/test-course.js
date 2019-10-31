/*jshint expr: true*/
var expect = require('chai').expect,
  superagent = require('superagent'),
  moment = require('moment'),
  validator = require('validator'),
  bcrypt = require('bcrypt')

var credentials = require('../credentials.js')
var Course = require('../models/course.js')
var User = require('../models/user.js')

var db, course_id

var urlBase = 'http://localhost:9000'

describe('Test related to Courses', function() {
  var agent
  before(function(done) {
    // MongoDB connection using Mongoose
    var mongoose = require('mongoose')
    var opts = {
      server: {
        socketOptions: {keepAlive: 1}
      }
    }
    mongoose.connect(credentials.mongo.development.connectionString, opts)

    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    // Login user
    agent = superagent.agent()
    
    var hash = bcrypt.hashSync('testingtesting1', 5)
    var user = User({
      email: "testing_user@gmail.com",
      password: hash,
      first_name: 'test first',
      last_name: 'test last',
      description: 'test description',
      user_type: 'ADMIN',
      status: 'ACTIVE'
    })
    user.save(function(err, user) {
      if (err) return done(err)

      agent.post(urlBase + '/login')
      .send({email: 'testing_user@gmail.com', password: 'testingtesting1'})
      .end(function(err, res) {
        if (err) return done(err)

        done()
      })
    }) 
  })
  describe('Endpoints related to courses', function() {
    var course_ids
    before(function(done) {
      var courses = [
        {
          name: "Test Course 1",
          course_start: moment('2016-04-01').toDate(),
          course_end: moment('2016-04-30').toDate(),
          status: "COMPLETE"
        },
        {
          name: "Test Course 2",
          course_start: moment('2016-04-15').toDate(),
          course_end: moment('2016-05-30').toDate(),
          status: "ACTIVE"
        },
        {
          name: "Test Course 3",
          course_start: moment('2016-05-30').toDate(),
          course_end: moment('2016-06-15').toDate(),
          status: "INACTIVE"
        }  
      ]
      Course.create(courses, function(err, courses) {
        if (err) return done(err)
        
        course_id = courses[0]._id

        course_ids = courses.map(function(course) {
          return course._id
        })

        done()
      })
    })
    describe('/api/course/new', function() {
      it('should create a course', function(done) {
        agent.post(urlBase + '/api/course/new')
          .send({name: "Test Course 1", description: "Testing testing 1", course_start: "2016-05-01", course_end: "2016-05-15"})
          .end(function(err, res) {
            expect(err).to.equal(null)
            expect(res.body.course.name).to.equal('Test Course 1')
            expect(res.body.course.description).to.equal('Testing testing 1')
            expect(moment('2016-05-01').isSame(res.body.course.course_start)).to.be.true
            expect(moment('2016-05-15').isSame(res.body.course.course_end)).to.be.true
            expect(res.body.course.status).to.equal('INACTIVE')

            done()
          })
      })
      it('should show validation error when there is no name, course_start, or course_end', function(done) {
        agent.post(urlBase + '/api/course/new')
          .send({})
          .end(function(err, res) {
            expect(err).to.not.be.null
            expect(res.status).to.equal(500)
            expect(res.body.name).to.not.be.undefined
            expect(res.body.course_start).to.not.be.undefined
            expect(res.body.course_end).to.not.be.undefined

            done()
          })
      })
      it('should only add when course_start is earlier than course_end', function(done) {
        agent.post(urlBase + '/api/course/new')
          .send({name: "Test Course 1", course_start: "2016-06-01", course_end: "2016-05-01"})
          .end(function(err, res) {
            expect(err).to.not.be.null
            expect(res.status).to.equal(500)
            expect(res.body.course_end).to.not.be.undefined

            done()
          })
      })
    })
    describe('/api/course/:course_id/edit', function() {
      it('should edit a course', function(done) {
        agent.put(urlBase + '/api/course/:course_id/edit'.replace(':course_id', course_id))
          .send({name: "Test Course 1 -- changed", description: "Testing testing 1 --changed", 
                course_start: "2016-05-01", course_end: "2016-05-16", status: "ACTIVE"})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.course.name).to.equal("Test Course 1 -- changed")
            expect(res.body.course.description).to.equal("Testing testing 1 --changed")
            expect(moment('2016-05-01').isSame(res.body.course.course_start)).to.be.true
            expect(moment('2016-05-16').isSame(res.body.course.course_end)).to.be.true
            expect(res.body.course.status).to.equal("ACTIVE")

            done()
          })
      })
      it('should only edit existing course', function(done) {
        agent.put(urlBase + '/api/course/1234/edit')
          .end(function(err, res) {
            expect(err).to.not.be.null
            expect(res.status).to.equal(500)

            done()
          })
      })
      it('should show validation error with missing or incorrect format', function(done) {
        agent.put(urlBase + '/api/course/:course_id/edit'.replace(':course_id', course_id))
          .send({name: "", course_start: "asdf", course_end: "asdf", status:""})
          .end(function(err, res) {
            expect(err).to.not.be.null
            expect(res.status).to.equal(500)
            expect(res.body.name).to.not.be.undefined
            expect(res.body.course_start).to.not.be.undefined
            expect(res.body.course_end).to.not.be.undefined
            expect(res.body.status).to.not.be.undefined

            done()
          })
      })
      it('should only edit when course_start is earlier than course_end', function(done) {
        agent.put(urlBase + '/api/course/:course_id/edit'.replace(':course_id', course_id))
          .send({name: "Test Course 1", course_start: "2016-06-01", course_end: "2016-05-16", status: "ACTIVE"})
          .end(function(err, res) {
            expect(err).to.not.be.null
            expect(res.status).to.equal(500)
            expect(res.body.course_end).to.not.be.undefined

            done()
          })
      })
    })
    describe('/course/:course_id/status', function() {
      it('should change status', function(done) {
        superagent.put(urlBase + '/course/:course_id/status'.replace(':course_id', course_id))
          .send({status: "PROGRESS"})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.msg).to.equal('success')
            expect(res.body.course.status).to.equal('PROGRESS')

            done()
          })
      })
    })
    describe('/course/:course_id/delete', function() {
      var delete_course_id

      before(function(done) {
        agent.post(`${urlBase}/api/course/new`)
          .send({name: "Test Course Delete", description: "Testing testing 1", course_start: "2016-05-01", 
            course_end: "2016-05-15"})
          .end(function(err, res) {
            if (err) return done(err)

            delete_course_id = res.body.course._id

            done()
          })
      })
      it('should delete the course', function(done) {
        agent.delete(`${urlBase}/api/course/${delete_course_id}/delete`)
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.course._id).to.equal(delete_course_id)

            done()
          })
      })
    })
    describe('/api/course/:course_id/register', function() {
      var user_ids
      before(function(done) {
        var hash = bcrypt.hashSync('testingtesting1', 5)
        var users = [
          {
            email: "register1@gmail.com",
            password: hash,
            first_name: 'test first',
            last_name: 'test last',
            description: 'test description',
          },
          {
            email: "register2@gmail.com",
            password: hash,
            first_name: 'test first',
            last_name: 'test last',
            description: 'test description',
          },
          {
            email: "register3@gmail.com",
            password: hash,
            first_name: 'test first',
            last_name: 'test last',
            description: 'test description',
          },
          {
            email: "register4@gmail.com",
            password: hash,
            first_name: 'test first',
            last_name: 'test last',
            description: 'test description',
            courses: [
              {
                _id: course_ids[2]
              }
            ]
          }
        ]
        User.create(users, function(err, users) {
          if (err) return done(err)

          user_ids = users.map(function(user) {
            return user._id
          })

          done()
        })
      })
      it('should register students', function(done) {
        agent.put(`${urlBase}/api/course/${course_ids[0]}/register`)
          .send({student_ids: user_ids.slice(0, 3)})
          .end(function(err, res) {
            expect(err).to.be.null
            
            User.find({'courses._id': course_ids[0]}, function(err, users) {
              if (err) return done(err)
              
              expect(users.length).to.equal(3)

              done()
            })
          })
      })
      it('should not register students who are already enrolled', function(done) {
        agent.put(`${urlBase}/api/course/${course_ids[2]}/register`)
          .send({student_ids: user_ids.slice(1,4)})
          .end(function (err, res) {
            expect(err).to.be.null 
            
            User.find({'courses._id': course_ids[2]}, function(err, users) {
              if (err) return done(err)
              
              expect(users.length).to.equal(3)
              
              expect(users[2].courses.length).to.equal(1)
              
              done()
            })
          })
      })
    })
  })
  describe('Endpoints related to lessons', function() {
    var course_id
    var lesson_id
    before(function(done) {
      var course = {
        name: "Test Course 1",
        course_start: moment('2016-04-01').toDate(),
        course_end: moment('2016-04-30').toDate(),
        status: "COMPLETE",
        lessons: [
          {
            name: "Test Lecture 1",
            description: "test 1 description",
          }
        ]
      } 
      Course.create(course, function(err, course) {
        if (err) return done(err)

        course_id = course._id
        lesson_id = course.lessons.pop()._id

        done()
      })
    })
    describe('Course', function() {
      it('#setHTMLLesson & #getHTMLLesson', function(done) {
        Course.findById(course_id, function(err, course) {
          var html = "<h1>Testing</h1><script></script>"
          course.setHTMLLesson(course.lessons[0]._id, html)

          course.save(function(err, course) {
            expect(err).to.be.null
            var lesson = course.lessons[0]
            expect(lesson.content.content).to.equal(validator.escape(html))
            expect(course.getHTMLLesson(lesson._id)).to.equal(html)

            done()
          })
        })
      })
    })
    describe('/api/course/:course_id/lesson/add', function() {
      it('should add a lesson', function(done) {
        agent.post(urlBase + '/api/course/:course_id/lesson/add'.replace(':course_id', course_id))
          .send({name: 'Lesson 1', description: 'testing 1'})
          .end(function(err, res) {
            expect(err).to.be.null
            var lesson = res.body.course.lessons.pop()
            expect(lesson.name).to.equal('Lesson 1')
            expect(lesson.description).to.equal('testing 1')
            expect(lesson.status).to.equal('UNPUBLISHED')

            done()
          })
      })
      it('should only add a lesson when name is given', function(done) {
        agent.post(urlBase + '/api/course/:course_id/lesson/add'.replace(':course_id', course_id))
          .send({name: ''})
          .end(function(err, res) {
            expect(err).to.not.be.null
            expect(res.status).to.equal(500)
            expect(res.body.name).to.not.be.undefined

            done()
          })
      })
      it('should add an HTML lesson', function(done) {
        var html = "<div><h1>Testing</h1><script></script></div>"
        agent.post(urlBase + '/api/course/:course_id/lesson/add'.replace(':course_id', course_id))
          .send({name: 'Lesson 2', content_type: "HTML", content: html})
          .end(function(err, res) {
            expect(err).to.be.null
            var lesson = res.body.course.lessons.pop()
            expect(lesson.name).to.equal('Lesson 2')
            expect(lesson.content.content_type).to.equal('HTML')
            expect(lesson.content.content).to.equal(validator.escape(html))

            done()
          })
      })
      it('should add a media lesson', function(done) {
        var html = "<div><h1>Testing</h1><script></script></div>"
        agent.post(urlBase + '/api/course/:course_id/lesson/add'.replace(':course_id', course_id))
          .send({name: 'Lesson 3', content_type: "MEDIA", media_url: 'http://test.com', content: html})
          .end(function(err, res) {
            expect(err).to.be.null

            var lesson = res.body.course.lessons.pop()
            expect(lesson.name).to.equal('Lesson 3')
            expect(lesson.content.content_type).to.equal('MEDIA')
            expect(lesson.content.content).to.equal(validator.escape(html))
            expect(lesson.content.media_url).to.equal('http://test.com')

            done()
          })
      })
    })

    describe('/api/course/:course_id/lesson/:lesson_id/edit', function() {
      it('should edit a lesson', function(done) {
        var html = "<div><h1>Testing</h1><script></script></div>"
        agent.put(urlBase + '/api/course/:course_id/lesson/:lesson_id/edit'
          .replace(':course_id', course_id).replace(':lesson_id', lesson_id))
        .send({name: 'Lesson Changed', description: 'testing 1 changed',
          media_url: 'http://example.com', content: html})
        .end(function(err, res) {
          expect(err).to.be.null
          var lesson = res.body.course.lessons[0]
          expect(lesson.name).to.equal('Lesson Changed')
          expect(lesson.description).to.equal('testing 1 changed')
          expect(lesson.status).to.equal('UNPUBLISHED')
          expect(lesson.content.media_url).to.equal('http://example.com')
          expect(lesson.content.content).to.equal(validator.escape(html))

          done()
        })
      })
    })
    describe('/api/course/:course_id/lesson/:lesson_id/delete', function() {
      it('should delete a lesson', function(done) {
        agent.delete(`${urlBase}/api/course/${course_id}/lesson/${lesson_id}/delete`)
                          .end(function(err, res) {
                            if (err) return done(err)
                            
                            var course = res.body.course
                            var lesson = course.lessons.find(function(lesson) {
                              return lesson_id === lesson._id
                            })
                            expect(lesson).to.be.undefined

                            done()
                          }) 
      })
    })
  })
  describe('Endpoints related to assignments', function() {
    var assignment_id
    before(function(done) {
      Course.findById(course_id, function(err, course) {
        if (err) return done(err)

        course.assignment.push({name: 'Assignment Test', description: 'assignment test', due_date: '2100-12-25'})
        course.save(function(err, course) {
          if (err) return done(err)

          assignment_id = course.assignment.pop()._id

          done()
        })
      })
    })
    describe('/course/:course_id/assignment/new', function() {
      it('should add an assignment', function(done) {
        superagent.post(urlBase + '/course/:course_id/assignment/new'.replace(':course_id', course_id))
          .send({name: 'Assignment 1', description: "Testing this assignment", due_date: '2017-12-25'})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.msg).to.equal('success')

            var assignment = res.body.assignment
            expect(assignment.name).to.equal('Assignment 1')
            expect(assignment.description).to.equal('Testing this assignment')
            expect(moment('2017-12-25').isSame(assignment.due_date, 'day')).to.be.true
            expect(assignment.status).to.equal('UNPUBLISHED')

            done()
          })
      })
      it('check if due date is later than now', function(done) {
        superagent.post(urlBase + '/course/:course_id/assignment/new'.replace(':course_id', course_id))
          .send({name: 'Assignment 1', due_date: '1990-01-01'})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.msg).to.equal('error')
            expect(res.body.due_date).to.not.be.undefined

            done()
          })
      })
    })
    describe('/course/:course_id/assignment/:assignment_id/edit', function() {
      it('should edit an assignment', function(done) {
        superagent.put(urlBase + '/course/:course_id/assignment/:assignment_id'.replace(':course_id', course_id)
                       .replace(':assignment_id', assignment_id))
                       .send({name: 'Assignment Test -- Changed', due_date: '2099-12-25', status: 'PUBLISHED'})
                       .end(function(err, res) {
                         expect(err).to.be.null
                         expect(res.body.msg).to.equal('success')

                         var assignment = res.body.assignment
                         expect(assignment.name).to.equal('Assignment Test -- Changed')
                         expect(assignment.description).to.equal('assignment test')
                         expect(moment('2099-12-25').isSame(assignment.due_date)).to.be.true
                         expect(assignment.status).to.equal('PUBLISHED')

                         done()
                       }) 
      }) 
    })
    describe('/course/:course_id/assignment/:assignment_id/delete', function() {
      it('should delete an assignment', function(done) {
        superagent.delete(urlBase + '/course/:course_id/assignment/:assignment_id/delete'.replace(':course_id', course_id)
                          .replace(':assignment_id', assignment_id))
                          .end(function(err, res) {
                            expect(err).to.be.null
                            expect(res.body.msg).to.equal('success')

                            done()
                          }) 
      })
    })
  })
  describe('Endpoints related to questions', function() {
    var assignment_id,
    question_written_id

    before(function(done) {
      Course.findById(course_id, function(err, course) {
        if (err) return done(err)

        var assignment = {
          name: 'Assignment Test', 
          description: 'assignment test', 
          due_date: '2100-12-25',
          question: [
            {
              name: 'written',
              question_type: 'WRITTEN'
            }
          ]
        }
        course.assignment.push(assignment)
        course.save(function(err, course) {
          if (err) return done(err)

          var assignment = course.assignment.pop()
          assignment_id = assignment._id
          question_written_id = assignment.question.pop()._id

          done()
        })
      })
    })
    describe('/course/:course_id/assignment/:assignment_id/new', function() {
      it('should add a written question', function(done) {
        superagent.post(urlBase + '/course/:course_id/assignment/:assignment_id/new'.replace(':course_id', course_id)
                        .replace(':assignment_id', assignment_id))
                        .send({name: 'Question 1', prompt: "Testing this question", question_type: 'WRITTEN'})
                        .end(function(err, res) {
                          expect(err).to.be.null
                          expect(res.body.msg).to.equal('success')

                          var question = res.body.question
                          expect(question.name).to.equal('Question 1')
                          expect(question.prompt).to.equal('Testing this question')
                          expect(question.question_type).to.equal('WRITTEN')

                          done()
                        })
      })
      it('should add a multiple question', function(done) {
        superagent.post(urlBase + '/course/:course_id/assignment/:assignment_id/new'.replace(':course_id', course_id)
                        .replace(':assignment_id', assignment_id))
                        .send({name: 'Question 2', prompt: "Testing this question", question_type: "MULTIPLE", multiple_choices: ['test1', 'test2']})
                        .end(function(err, res) {
                          expect(err).to.be.null
                          expect(res.body.msg).to.equal('success')

                          var question = res.body.question
                          expect(question.name).to.equal('Question 2')
                          expect(question.prompt).to.equal('Testing this question')
                          expect(question.question_type).to.equal('MULTIPLE')
                          expect(question.multiple_choices).to.deep.equal(['test1', 'test2'])

                          done()
                        })
      })
      it('should not add a question missing name or type', function(done) {
        superagent.post(urlBase + '/course/:course_id/assignment/:assignment_id/new'.replace(':course_id', course_id)
                        .replace(':assignment_id', assignment_id))
                        .send({name: '', prompt: "Testing this question"})
                        .end(function(err, res) {
                          expect(err).to.be.null
                          expect(res.body.msg).to.equal('error')

                          expect(res.body.name).to.not.be.undefined
                          expect(res.body.question_type).to.not.be.undefined

                          done()
                        })
      })
    })
    describe('/course/:course_id/assignment/:assignment_id/:question_id/edit', function() {
      it('should edit a question', function(done) {
        superagent.put(urlBase + '/course/:course_id/assignment/:assignment_id/:question_id/edit'.replace(':course_id', course_id)
                       .replace(':assignment_id', assignment_id).replace(':question_id', question_written_id))
                       .send({name: 'Changed', prompt: 'Changed', question_type: 'MULTIPLE', multiple_choices: ['test', 'test', 'test']})
                       .end(function(err, res) {
                         expect(err).to.be.null
                         expect(res.body.msg).to.equal('success')

                         var question = res.body.question
                         expect(question.name).to.equal('Changed')
                         expect(question.prompt).to.equal('Changed')
                         expect(question.question_type).to.equal('MULTIPLE')
                         expect(question.multiple_choices).to.deep.equal(['test', 'test', 'test'])

                         done()
                       }) 
      }) 
    })
    describe('/course/:course_id/assignment/:assignment_id/:question_id/delete', function() {
      it('should delete a question', function(done) {
        superagent.delete(urlBase + '/course/:course_id/assignment/:assignment_id/:question_id/delete'.replace(':course_id', course_id)
                          .replace(':assignment_id', assignment_id).replace(':question_id', question_written_id))
                          .end(function(err, res) {
                            expect(err).to.be.null
                            expect(res.body.msg).to.equal('success')

                            done()
                          }) 
      })
    })
  })
  describe('Course#updateStatus', function() {
    var course_ids
    before(function(done) {
      var courses = [
        {
          name: "Test Course Inactive",
          course_start: moment().add(3, 'days').toDate(),
          course_end: moment().add(5, 'days').toDate(),
          status: "COMPLETE"
        },
        {
          name: "Test Course Active",
          course_start: moment().subtract(3, 'days').toDate(),
          course_end: moment().add(3, 'days').toDate(),
          status: "INACTIVE"
        },
        {
          name: "Test Course Complete",
          course_start: moment().subtract(5, 'days').toDate(),
          course_end: moment().subtract(3, 'days').toDate(),
          status: "INACTIVE"
        }
      ]
      Course.create(courses, function(err, courses) {
        if (err) return done(err)

        course_ids = courses.map(function(course) {
          return course._id
        })

        done()
      })
    })
    it('should change course status', function(done) {
      var counter = 0
      var cb = function(err, courses) {
        if (err) return done(err)
        counter++
        
        if (counter === 3) {
          Course.find({'_id': {'$in': course_ids}}, function(err, courses) {
            if (err) return done(err)
            
            expect(courses[0].status).to.equal('INACTIVE')
            expect(courses[1].status).to.equal('ACTIVE')
            expect(courses[2].status).to.equal('COMPLETE')

            done()
          })
        }
      }
      Course.updateStatus(cb, cb, cb)
    })
  })
  after(function(done) {
    db.collection('courses').removeMany(function(err) {
      if (err) return done(err)

      db.collection('users').removeMany(function(err) {
        if (err) return done(err)

        db.close(done)
      })
    })
  })
})
