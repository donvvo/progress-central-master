var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// bcrypt for password hashing
var bcrypt = require('bcrypt');
var saltRounds = 5;

var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    unique: true
  },
  first_name: {
    type: String,
    default: ""
  },
  last_name: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: true
  },
  profile_photo: {
    type: String,
    default: '/img/profile_placeholder.png'
  },
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'INACTIVE'
  },
  invite_key: String,
  user_type: {
    type: String,
    required: true,
    enum: ["ADMIN", "INSTRUCTOR", "STUDENT"],
    default: "STUDENT"
  },
  description: String,
  courses: [
    {
      status: {
        type: String,
        required: true,
        enum: ["ACTIVE", "COMPLETE"],
        default: "ACTIVE"
      },
      completed_lessons: [ObjectId],
      grade: {
        bonus: Number,
        final: Number
      }
    }
  ],  // Course._id
  assignments: [
    {
      assignment_id: ObjectId,  // Course.assignment._id
      status: {
        type: String,
        required: true,
        enum: ["STARTED", "SUBMITTED", "GRADED"]
      },
      questions: [
        {
          question_id: ObjectId,  // Course.assignment.question._id
          answer: String,
          grade: Number
        }
      ],
      grade: {
        bonus: Number,
        final: Number
      }
    }
  ],
  notifications: [
    {
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      read: {
        type: Boolean,
        required: true,
        default: false
      },
      timestamp: {
        type: Date,
        default: Date.now()
      } 
    }
  ]
}, {timestamps: true})
userSchema.plugin(uniqueValidator, { message: 'This {PATH} is already being used. Please provide another email.'});

userSchema.methods.validPassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

userSchema.methods.addNotification = function(title, content, cb) {
  this.model('User').findByIdAndUpdate(this._id,
    { '$push': { 'notifications': {
      '$each': [{ 'title': title, 'content': content }],
      '$slice': -50
    }}}, { 'new': true, 'runValidators': true }, cb)
}

userSchema.methods.readNotification = function(notification_ids, cb) {
  var self = this
  notification_ids.forEach(function(notification_id) {
    var notification = self.notifications.id(notification_id)
    if (notification) {
      notification.read = true
    }
  })
  this.save(cb)
}

userSchema.methods.resetPassword = function(cb) {
  var newPassword = generateRandomKey()
  
  var self = this

  bcrypt.hash(newPassword, saltRounds, function (err, hash) {
    if (err) {
      return cb(err);
    }
    
    self.password = hash

    self.save(function (err, user) {
      if (err) return cb(err)
      
      cb(null, user, newPassword)
    });
  });
}

userSchema.statics.inviteUser = function(email, cb) {
  var self = this
  this.findOne({email: email}, function(err, user) {
    if (err) return cb(err)

    if (user) {
      var error = new Error('This email is already taken')
      return cb(error)
    }
    else {
      var randomPassword = generateRandomKey()
      var inviteKey = generateRandomKey()

      bcrypt.hash(randomPassword, saltRounds, function (err, hash) {
        if (err) {
          return cb(err);
        }

        self.create({email: email, password: hash, invite_key: inviteKey}, function(err, user) {
          if (err) return cb(err)

          return cb(null, user, randomPassword, inviteKey)
        })
      });
    }
  })
}

userSchema.virtual('name.full').get(function() {
  return this.first_name + " " + this.last_name;
});

function generateRandomKey() {
  var length = 10,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

var User = mongoose.model('User', userSchema);
module.exports = User;
