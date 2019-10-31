import jQuery from 'jquery'
import superagent from 'superagent'

import AppDispatcher from '../AppDispatcher.js'

import {userConstants} from '../constants.js'

import ErrorActions from './ErrorActions'
import LoadingActions from './LoadingActions'

class UserActions {
  static fetchLoggedInUser(cb) {
    LoadingActions.loading()
    jQuery.get('/api/user/get-loggedin-user', function (result) {
      AppDispatcher.dispatch({
        type: userConstants.SET_USER,
        user: result
      })
      cb(result)
    }.bind(this))
    .fail(function(result) {
      ErrorActions.setError(result)
    }.bind(this))
    .always(function() {
      setTimeout(5000,
      LoadingActions.loadingComplete())
    })
  }

  static editUserProfile(user, cb) {
    LoadingActions.loading()
    superagent.put(`/api/user/${user._id}/edit`)
      .send({ user: user })
      .end(function(err, res) {
        if (err) {
          ErrorActions.setError(err)
          LoadingActions.loadingComplete()
        }
        else {
          AppDispatcher.dispatch({
            type: userConstants.EDIT_USER_PROFILE,
            user: res.body.user
          })
          LoadingActions.loadingComplete()
          cb()
        }
      })
  }

  static editUserProfilePhoto(user, formData, cb) {
    LoadingActions.loading()
    superagent.put(`/api/user/${user._id}/edit-photo`)
    .send(formData)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.EDIT_USER_PROFILE,
          user: res.body.user
        })
        LoadingActions.loadingComplete()
        cb()
      }
    })
  }

  static changeUserPassword(user, password, cb) {
    LoadingActions.loading()
    superagent.put(`/api/user/${user._id}/change-password`)
    .send({ password: password })
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.CHANGE_PASSWORD,
          user: res.body.user
        })
        LoadingActions.loadingComplete()
        cb()
      }
    })
  }

  static getRegisteredInstructors(course_id, cb) {
    LoadingActions.loading()
    superagent.get(`/api/course/${course_id}/registered-instructors`)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.GET_REGISTERED_INSTRUCTORS,
          instructors: res.body.instructors
        })
        LoadingActions.loadingComplete()
        cb(res.body.instructors)
      }
    })
  }

  static getRegisteredStudents(course_id, cb) {
    LoadingActions.loading()
    superagent.get(`/api/course/${course_id}/registered-students`)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.GET_REGISTERED_STUDENTS,
          students: res.body.students
        })
        LoadingActions.loadingComplete()
        cb(res.body.students)
      }
    })
  }

  static getUnregisteredInstructors(course_id, cb) {
    LoadingActions.loading()
    superagent.get(`/api/course/${course_id}/unregistered-instructors`)
      .end(function(err, res) {
        if (err) {
          ErrorActions.setError(err)
          LoadingActions.loadingComplete()
        }
        else {
          AppDispatcher.dispatch({
            type: userConstants.GET_UNREGISTERED_INSTRUCTORS,
            instructors: res.body.instructors
          })
          LoadingActions.loadingComplete()
          cb(res.body.instructors)
        }
      })
  }

  static getUnregisteredStudents(course_id, cb) {
    LoadingActions.loading()
    superagent.get(`/api/course/${course_id}/unregistered-students`)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.GET_UNREGISTERED_STUDENTS,
          students: res.body.students
        })
        LoadingActions.loadingComplete()
        cb(res.body.students)
      }
    })
  }

  static getAllUsers(cb) {
    LoadingActions.loading()
    superagent.get(`/api/user/all`)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.GET_ALL_USERS,
          users: res.body.users
        })
        LoadingActions.loadingComplete()
        cb(res.body.users)
      }
    })
  }
  
  static registerStudents(course, student_ids, cb) {
    LoadingActions.loading()
    superagent.put(`/api/course/${course._id}/register`)
      .send({user_ids: student_ids, course: course})
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.REGISTER_STUDENTS,
        })
        LoadingActions.loadingComplete()
        cb()
      }
    })
  }

  static changeLessonCompleteStatus(course_id, lesson_id, cb) {
    LoadingActions.loading()
    superagent.put(`/api/course/${course_id}/lesson/${lesson_id}/complete-status`)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.CHANGE_COMPLETE_STATUS,
          user: res.body.user
        })
        LoadingActions.loadingComplete()
        if (cb) cb()
      }
    })
  }
  
  static readNotification(notification_id) {
    superagent.put(`/api/user/notification`)
      .send({notification_ids: [notification_id]})
    .end(function(err, res) {
      if (!err) {
        AppDispatcher.dispatch({
          type: userConstants.EDIT_USER_PROFILE,
          user: res.body.user
        })
      }
    }) 
  }

  static deleteUser(user, cb) {
    LoadingActions.loading()
    superagent.delete(`/api/user/${user._id}/delete`)
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.DELETE_USER,
          user: res.body.user
        })
        LoadingActions.loadingComplete()
        if (cb) cb(res.body.user)
      }
    })
  }

  static inviteUser(email, cb) {
    LoadingActions.loading()
    superagent.post(`/api/user/invite`)
      .send({ email: email })
    .end(function(err, res) {
      if (err) {
        ErrorActions.setError(err)
        LoadingActions.loadingComplete()
      }
      else {
        AppDispatcher.dispatch({
          type: userConstants.INVITE_USER,
          user: res.body.user
        })
        LoadingActions.loadingComplete()
        if (cb) cb(res.body.user)
      }
    })
  }
}

export default UserActions
