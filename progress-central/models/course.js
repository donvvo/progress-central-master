var mongoose = require('mongoose')
var validator = require('validator')

var courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    required: true,
    enum: ["INACTIVE", "ACTIVE", "COMPLETE"],
    default: "INACTIVE"
  },
  course_start: Date,
  course_end: Date,
  lessons: [
    {
      name: {
        type: String,
        required: true
      },
      description: String,
      status: {
        type: String,
        required: true,
        enum: ["UNPUBLISHED", "PUBLISHED"],
        default: "UNPUBLISHED"
      },
      content: {   // html text or media file link
        content_type: {
          type: String,
          enum: ["HTML", "MEDIA"],
          defualt: "HTML"
        },
        media_url: String,
        pdf_url: String,
        content: String
      }
    }
  ],
  assignment: [
    {
      name: {
        type: String,
        required: true
      },
      description: String,
      status: {
        type: String,
        required: true,
        enum: ["UNPUBLISHED", "PUBLISHED"],
        default: "UNPUBLISHED"
      },
      due_date: {
        type: Date,
      },
      question: [
        {
          name: {
            type: String,
            required: true
          },
          question_type: {
            type: String,
            required: true,
            enum: ["MULTIPLE", "WRITTEN"]
          },
          prompt: String,
          multiple_choices: [String]
        }
      ]
    }
  ]
},
{
  timestamps: true
})

courseSchema.methods.getHTMLLesson = function(lesson_id) {
  var lesson = this.lessons.id(lesson_id)

  if (lesson.content.content) return validator.unescape(lesson.content.content)
}
courseSchema.methods.setHTMLLesson = function(lesson_id, content) {
  var lesson = this.lessons.id(lesson_id)

  if (content) lesson.content.content = validator.escape(content)
}

courseSchema.statics.updateStatus = function(cbInactive, cbActive, cbComplete) {
  // Assumes cron job runs at 12:30am the day
  var now = Date.now()
  // Inactive courses
  this.find({'course_start': {'$gte': now}}, function(err, courses) {
    if (err) return cbInactive(err)
    this.update(courses, {'status': 'INACTIVE'}, {multi:true}, function(err, response) {
      if (err) return cbInactive(err) 
      
      cbInactive(err, courses) 
    })
  })
  this.find({'course_start': {'$lt': now}, 'course_end': {'$gt': now}}, function(err, courses) {
    if (err) return cbActive(err)
    this.update(courses, {'status': 'ACTIVE'}, {multi: true}, function(err, response) {
      if (err) return cbActive(err)
      
      cbActive(err, courses)
    })
  })
  this.find({'course_end': {'$lte': now}}, function(err, courses) {
    if (err) return cbComplete(err)
    this.update(courses, {'status': 'COMPLETE'}, {multi: true}, function(err, response) {
      if (err) return cbComplete(err)

      cbComplete(err, courses)
    })
  })
}

// TODO: due_date can only be after today
var Course = mongoose.model('Course', courseSchema)
module.exports = Course
