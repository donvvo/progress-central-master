/**
 * Created by andrewjjung on 2016-06-08.
 */

var moment = require('moment')

var Course = require('../models/course')
var User = require('../models/user')

exports.init = function() {
  var CronJob = require('cron').CronJob

  var job = new CronJob('00 30 0 * * *', function() {
    console.log('CronJob')
    console.log(`Course#updateStatus -- ${moment().format('YYYY-MM-DD HH:mm')}`)
    
    var getCourseIds = function(courses) {
      try {
        return courses.map(function(course) {
          return course._id
        })
      }
      catch (e) {
        return []
      }
    }
    
    var findRegisteredStudents = function(courseIds, cb) {
      User.find({'courses._id': {'$in': courseIds}}, cb) 
    } 
    
    var cbInactive = function(err, courses) {
      var courseIds = getCourseIds(courses) 
      findRegisteredStudents(courseIds, function(err, students) {
        if (err) return console.log(err)
        
        console.log('Email these students')
        console.log(students)
      }) 
    }
    var cbActive = function(err, courses) {
      var courseIds = getCourseIds(courses)
      findRegisteredStudents(courseIds, function(err, students) {
        if (err) return console.log(err)

        console.log('Email these students')
        console.log(students)
      })
    }
    var cbComplete = function(err, courses) {
      var courseIds = getCourseIds(courses)
      findRegisteredStudents(courseIds, function(err, students) {
        if (err) return console.log(err)

        console.log('Email these students')
        console.log(students)
      })
    }
    
    Course.updateStatus(cbInactive, cbActive, cbComplete)
  })
  job.start()
}

