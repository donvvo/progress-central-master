var User = require('../../models/user.js'),
  bcrypt = require('bcrypt'),
  _ = require('underscore'),
  gm = require('gm'),
  fs = require('fs'),
  formidable = require('formidable'),
  AWS = require('aws-sdk'),
  s3 = new AWS.S3({region: 'us-east-1', apiVersion: '2006-03-01'}),
  mime = require('mime')

var email = require('../../lib/email')

var saltRounds = 5;

exports.signUp = function(req, res, next) {
  User.findOne({invite_key: req.params.invite_key, status: 'INACTIVE'}, function(err, user) {
    if (err) return next(err)
    if (!user) return next()

    req.checkBody('first_name', 'Please enter your first name').notEmpty()
    req.checkBody('last_name', 'Please enter your last name').notEmpty()
    req.checkBody('new_password', 'Please enter a valid password').notEmpty().matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    req.checkBody('confirm_password', 'Please enter a matching password').notEmpty().matches(req.body.new_password)

    var errors = req.validationErrors(true)
    if (errors) {
      errors.msg = 'error'
      return res.render('user/signup', {layout: 'front', email: user.email, errors: errors, invite_key: req.params.invite_key})
    }

    user.validPassword(req.body.old_password, function(err, valid) {
      if (err) { return next(err); }
      if (valid) {
        bcrypt.hash(req.body.new_password, saltRounds, function (err, hash) {
          if (err) {
            return next(err);
          }

          user.first_name = req.body.first_name
          user.last_name = req.body.last_name
          user.password = hash
          user.status = 'ACTIVE'

          user.save(function (err, user) {
            if (err) return next(err)

            req.login(user, function(err) {
              if (err) return next(err)

              return res.redirect('/')
            })
          });
        });
      }
      else {
        return res.render('user/signup', {
          layout: 'front', email: user.email, errors: {
            old_password: {
              msg: 'Invalid password. Please try again.'
            }
          }, invite_key: req.params.invite_key
        })
      }
    })
  })
}

exports.changeCompletedLessons = function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    if (err) return next(err)

    var course_id = req.params.course_id
    var course = user.courses.id(course_id)
    if (!course) return next()

    var lesson_id = req.params.lesson_id
    var completed_lessons = course.completed_lessons
    var lesson_index
    if (completed_lessons && ((lesson_index = completed_lessons.indexOf(lesson_id)) !== -1)) {
      completed_lessons.splice(lesson_index, 1)
    }
    else {
      completed_lessons.push(lesson_id)
    }

    user.save(function(err, user) {
      if (err) return next(err)

      res.json({
        user: user
      })
    }) 
  })
}

exports.getLoggedInUser = function(req, res, next) {
  if (!req.isAuthenticated()) return next()
  res.json(req.user)
}

exports.editUser = function(req, res, next) {
  var errors = editUserCheckBody(req)
  
  if (errors) {
    return res.status(500).json(errors)
  }

  // Only let selected fields to be modified
  var user = _.pick(req.body.user, 'first_name', 'last_name', 'description')
  User.findByIdAndUpdate({_id: req.params.user_id}, {$set: user}, {runValidators: true, new: true}, 
    function(err, user) {
      if (err) return next(err)
      if (!user) return next()

      res.json({user: user})
    })
}

exports.editProfilePhoto = function(req, res, next) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) return next(err)
    if (!user) return next()

    var form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
      if (err) return next(err)

      var image = files.image
      if (!image || !fields || !fields.height || !fields.width || !fields.x_coord || !fields.y_coord) {
        return res.status(500).json({'error': 'Invalid parameters'})
      }

      var mediaImageDir = process.cwd() + '/public/media/img'
      try {
        fs.accessSync(mediaImageDir)
      }
      catch (e) {
        return next(e)
      }

      // var path = '/' + Date.now() + image.name

      /* gm(image.path).crop(fields.width, fields.height, fields.x_coord, fields.y_coord)
      .write(mediaImageDir + path, function(err) {
        if (err) return next(err)
        
        user.profile_photo = '/media/img' + path
        user.save(function(err, user) {
          if (err) return next(err)

          res.json({user: user})
        })
      }) */

      var name = Date.now() + image.name
      gm(image.path).crop(fields.width, fields.height, fields.x_coord, fields.y_coord)
      .stream(function(err, stdout, stderr) {
        if (err) return next(err)

        var data = {
          Bucket: 'progresscentral',
          Key: name,
          Body: stdout,
          ContentType: mime.lookup(name)
        }

        var serverRes = res
        
        s3.upload(data, function(err, res) {
          if (err) return next(err)

          user.profile_photo = `http://s3.amazonaws.com/progresscentral/${name}`
          user.save(function(err, user) {
            if (err) return next(err)

            serverRes.json({user: user})
          })
        })
      })
    })
  })
}

exports.readNotification = function(req, res, next) {
  var notification_ids = req.body.notification_ids
  // Do nothing if there is no notification id
  if (!notification_ids || (notification_ids.length < 1)) return res.json({user: req.user})
  
  req.user.readNotification(notification_ids, function(err, user) {
    if (err) return next(err) 
    
    return res.json({user: user})
  })
}

exports.getAllUsers = function(req, res, next) {
  User.find({'_id': {'$ne': req.user._id}}, function(err, users) {
    if (err) return next(err)

    res.json({users: users})
  })
}

exports.deleteUser = function(req, res, next) {
  User.findByIdAndRemove(req.params.user_id, function(err, user) {
    if (err) return next(err)
    if (!user) return next()

    res.json({user: user})
  })
}

exports.inviteUser = function(req, res, next) {
  req.checkBody('email').notEmpty()
  
  var errors = req.validationErrors(true) 
  if (errors) return res.status(500).json(errors)
  
  User.inviteUser(req.body.email, function(err, user, randomPassword, inviteKey) {
    if (err && err.message === 'This email is already taken') {
      return res.json({error: err.message}) 
    }
    else if (err) {
      return next(err)
    }
    else {
      email.inviteUser(user.email, randomPassword, inviteKey, function(err, body) {
        if (err) return next(err)

        return res.json({user: user})
      })
    }
  })
}

exports.resetPassword = function(req, res, next) {
  req.checkBody('email').notEmpty()

  var errors = req.validationErrors(true)
  if (errors) return res.render('user/reset_password', {layout: 'front', errors: errors})

  User.findOne({email: req.body.email, status: {'$ne': 'INACTIVE'}}, function(err, user) {
    if (err) return next(err)
    if (!user) return res.render('user/reset_password', {layout: 'front', errors:
    {user: {message: 'There is no active user with this email'}}})
    
    user.resetPassword(function(err, user, newPassword) {
      if (err) return next(err)

      email.resetPassword(user.email, newPassword, function(err, body) {
        if (err) return next(err)

        res.render('user/reset_password', {layout: 'front',
          success: 'An email has been sent to your account with a new password'})
      })
    })
  })
}

exports.changePassword = function(req, res, next) {
  req.checkBody('password').notEmpty()
  
  var errors = req.validationErrors(true)
  if (errors) return res.status(500).json({errors: errors})

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (err) {
      return next(err);
    }

    User.findByIdAndUpdate({_id: req.params.user_id}, {$set: {password: hash}}, {runValidators: true, new: true},
      function(err, user) {
        if (err) return next(err)
        if (!user) return next()

        res.json({user: user})
      })
  }); 
}

/** Check if user, first_name, and last_name is provided */
function editUserCheckBody(req) {
  req.checkBody('user').notEmpty()
  req.checkBody('user.first_name').notEmpty()
  req.checkBody('user.last_name').notEmpty()

  return req.validationErrors(true)
}
