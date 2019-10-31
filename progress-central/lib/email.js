/**
 * Created by andrewjjung on 2016-06-10.
 */

var credentials = require('../credentials')
var mailgun = require('mailgun-js')(credentials.mailgun)
var mailcomposer = require('mailcomposer')

module.exports = {
  sendEmail: function(to, subject, body, html, cb) {
    var mail = mailcomposer({
      from: 'notification@progress-central.com',
      to: to,
      subject: subject,
      body: body,
      html: html
    })

    mail.build(function(mailBuildError, message) {
      if (mailBuildError) return cb(mailBuildError)

      var dataToSend = {
        to: to,
        message: message.toString('ascii')
      }

      mailgun.messages().sendMime(dataToSend, function(sendError, body) {
        if (sendError) return cb(sendError)

        cb(null, body)
      })
    })
  },
  registeredToCourse: function(student_emails, course_name, cb) {
    student_emails = student_emails.join(', ')
    
    var subject = `[Progress Central] Course Registration: ${course_name}`
    var body = `You have been registered to ${course_name}.`
    var html = `You have been registered to ${course_name}. \<a href=\"http://progress-central.com\"\>
  Click here to view in app\</a\>`

    this.sendEmail(student_emails, subject, body, html, cb)
  },
  inviteUser: function(email, random_password, inviteKey, cb) {
    var subject = `[Progress Central] You have been invited to Progress Central`
    var body = `You have been invited to Progress Central. Your username is this email and temporary password is 
    ${random_password}. Please complete registration at http://progress-central/sign-up/${inviteKey}`
    var html = `You have been invited to Progress Central. <br /><br />Your username is this email and temporary password is 
${random_password}. \<a href=\"http://progress-central.com/signup/${inviteKey}\"\>
  Click here to complete registration\</a\>`

    this.sendEmail(email, subject, body, html, cb)
  },
  resetPassword: function(email, newPassword, cb) {
    var subject = `[Progress Central] Reset Password`
    var body = `Your new password is ${newPassword}`
    var html = `Your new password is ${newPassword}`

    this.sendEmail(email, subject, body, html, cb)
  }
} 



