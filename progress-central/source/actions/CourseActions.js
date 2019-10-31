/**
 * Created by andrewjjung on 2016-05-22.
 */

import superagent from 'superagent'

import AppDispatcher from '../AppDispatcher.js'

import {courseConstants} from '../constants.js'

import ErrorActions from './ErrorActions'
import LoadingActions from './LoadingActions'

class CourseActions {
  static addCourse(course, cb) {
    LoadingActions.loading()
    superagent.post('/api/course/new')
    .send({
      name: course.name,
      description: course.description,
      course_start: course.course_start,
      course_end: course.course_end
    })
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: courseConstants.ADD_COURSE,
          course: res.body.course
        })
        LoadingActions.loadingComplete()
        cb(res.body.course)
      }
    })
  }
  
  static editCourse(course, cb) {
    LoadingActions.loading()
    superagent.put(`/api/course/${course._id}/edit`)
    .send({
      name: course.name,
      description: course.description,
      course_start: course.course_start,
      course_end: course.course_end,
      status: course.status
    })
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: courseConstants.EDIT_COURSE,
          course: res.body.course
        })
        LoadingActions.loadingComplete()
        cb(res.body.course)
      }
    })
  }

  static deleteCourse(course, cb) {
    LoadingActions.loading()
    superagent.delete(`/api/course/${course._id}/delete`)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: courseConstants.DELETE_COURSE,
          course: res.body.course
        })
        LoadingActions.loadingComplete()
        cb(res.body.course)
      }
    })
  }

  static addLesson(course_id, formData, cb) {
    LoadingActions.loading()
    superagent.post(`/api/course/${course_id}/lesson/add`)
    .send(formData)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: courseConstants.ADD_LESSON,
          course: res.body.course
        })
        LoadingActions.loadingComplete()
        cb(res.body.course)
      }
    })
  }

  static editLesson(course_id, lecture_id, formData, cb) {
    LoadingActions.loading()
    superagent.put(`/api/course/${course_id}/lesson/${lecture_id}/edit`)
    .send(formData)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: courseConstants.EDIT_LESSON,
          course: res.body.course
        })
        LoadingActions.loadingComplete()
        cb(res.body.course)
      }
    })
  }

  static deleteLecture(course_id, lesson, cb) {
    LoadingActions.loading()
    superagent.delete(`/api/course/${course_id}/lesson/${lesson._id}/delete`)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: courseConstants.DELETE_LESSON,
          course: res.body.course
        })
        LoadingActions.loadingComplete()
        cb(res.body.course)
      }
    })
  }

  static getAllCourses() {
    LoadingActions.loading()
    superagent.get('/api/course/all')
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: courseConstants.GET_ALL_COURSES,
          courses: res.body.courses
        })
        LoadingActions.loadingComplete()
      }
    })
  }

  static getRegisteredCourses() {
    LoadingActions.loading()
    superagent.get('/api/course/registered')
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: courseConstants.GET_REGISTERED_COURSES,
          courses: res.body.courses
        })
        LoadingActions.loadingComplete()
      }
    })
  }
}

export default CourseActions
