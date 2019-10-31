var express = require('express')

var auth = require('../lib/authMiddleware')
var adminOnly = auth.adminOnly
var selfOnly = auth.selfOnly
var adminOrInstructor = auth.adminOrInstructor

var course = require('./handlers/course.js'),
  user = require('./handlers/user.js')


var courseRouter = express.Router(),
  userRouter = express.Router()

courseRouter.get('/all', adminOnly, course.getAllCourses)
courseRouter.get('/registered', course.getRegisteredCourses)
courseRouter.post('/new', adminOnly, course.createCourse)
courseRouter.get('/:course_id', course.getACourse)
courseRouter.put('/:course_id/edit', adminOrInstructor, course.editCourse)
courseRouter.delete('/:course_id/delete', adminOnly, course.deleteCourse)

courseRouter.get('/:course_id/registered-instructors', adminOnly, course.getRegisteredInstructors)
courseRouter.get('/:course_id/unregistered-instructors', adminOnly, course.getUnregisteredInstructors)

courseRouter.get('/:course_id/registered-students', adminOrInstructor, course.getRegisteredStudents)
courseRouter.get('/:course_id/unregistered-students', adminOrInstructor, course.getUnregisteredStudents)
courseRouter.put('/:course_id/register', adminOrInstructor, course.registerUsers)

courseRouter.post('/:course_id/assignment/new', adminOnly, course.addEditAssignment)
courseRouter.put('/:course_id/assignment/:assignment_id', adminOnly, course.addEditAssignment)

courseRouter.post('/:course_id/assignment/:assignment_id/new', adminOnly, course.addEditQuestion)
courseRouter.put('/:course_id/assignment/:assignment_id/:question_id/edit', adminOnly, course.addEditQuestion)
courseRouter.delete('/:course_id/assignment/:assignment_id/:question_id/delete', adminOnly, course.deleteQuestion)

courseRouter.post('/:course_id/lesson/add', adminOrInstructor, course.addLesson)
courseRouter.put('/:course_id/lesson/:lesson_id/edit', adminOrInstructor, course.editLesson)
courseRouter.get('/:course_id/lesson/:lesson_id', course.getLesson)
courseRouter.delete('/:course_id/lesson/:lesson_id/delete', adminOrInstructor, course.deleteLesson)

courseRouter.put('/:course_id/lesson/:lesson_id/complete-status', user.changeCompletedLessons)

userRouter.get('/all', user.getAllUsers)
userRouter.put('/notification', user.readNotification)
userRouter.post('/invite', adminOnly, user.inviteUser)
userRouter.get('/get-loggedin-user', user.getLoggedInUser)
userRouter.put('/:user_id/edit', selfOnly, user.editUser)
userRouter.put('/:user_id/edit-photo', selfOnly, user.editProfilePhoto)
userRouter.put('/:user_id/change-password', selfOnly, user.changePassword)
userRouter.delete('/:user_id/delete', adminOnly, user.deleteUser)

exports.courseRouter = courseRouter
exports.userRouter = userRouter
