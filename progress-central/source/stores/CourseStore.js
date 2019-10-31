/**
 * Created by andrewjjung on 2016-05-23.
 */

import {EventEmitter} from 'events'

import AppDispatcher from '../AppDispatcher.js'

import {courseConstants} from '../constants.js'

const CHANGE_EVENT = 'change'

let courses = []

class CourseStore extends EventEmitter {
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb)
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb)
  }

  getCourses() {
    return courses
  }

  getACourse(course_id) {
    let course =  courses.find(function(course) {
      return course_id === course._id
    })
    return course || {}
  }
  
  getALecture(course_id, lecture_id) {
    let course = this.getACourse((course_id))
    let lectures = course.lessons || []
    
    let lecture = lectures.find(function(lesson) {
      return lecture_id === lesson._id
    })
    return lecture || {}
  }

  replaceACourse(newCourse) {
    let index = courses.findIndex(function(course) {
      return newCourse._id === course._id 
    })
    courses[index] = newCourse
  }
  
  deleteCourse(deletedCourse) {
    courses = courses.filter((course) => {
      return course._id !== deletedCourse._id
    })
  }

  handleActions(action) {
    switch(action.type) {
      case courseConstants.ADD_COURSE:
        courses.push(action.course)
        this.emit(CHANGE_EVENT)
        break
      case courseConstants.EDIT_COURSE:
        this.replaceACourse(action.course)
        this.emit(CHANGE_EVENT)
        break
      case courseConstants.DELETE_COURSE:
        this.deleteCourse(action.course)
        this.emit(CHANGE_EVENT)
        break
      case courseConstants.ADD_LESSON:
        this.replaceACourse(action.course)
        this.emit(CHANGE_EVENT)
        break
      case courseConstants.EDIT_LESSON:
        this.replaceACourse(action.course)
        this.emit(CHANGE_EVENT)
        break
      case courseConstants.DELETE_LESSON:
        this.replaceACourse(action.course)
        this.emit(CHANGE_EVENT)
        break
      case courseConstants.GET_ALL_COURSES:
        courses = action.courses
        this.emit(CHANGE_EVENT)
        break
      case courseConstants.GET_REGISTERED_COURSES:
        courses = action.courses
        this.emit(CHANGE_EVENT)
        break
    }
  }
}

const courseStore = new CourseStore()
AppDispatcher.register(courseStore.handleActions.bind(courseStore))

export default courseStore
