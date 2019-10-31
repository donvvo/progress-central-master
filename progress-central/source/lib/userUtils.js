/**
 * Created by andrewjjung on 2016-05-27.
 *
 * Useful functions related to users
 */

import UserStore from '../stores/UserStore'

function calcProgress(user, course) {
  if (!user.courses) throw Error('This user is not registered to any courses')
  
  let userCourse = user.courses.find((aCourse) => {
    return aCourse._id === course._id
  })
  
  if (!userCourse) throw Error('This user is not registered for this course') 
  
  let completedLessons = userCourse.completed_lessons
  if (!completedLessons) return 0  
 
  // If there is no lesson for this course yet, progress will be 0
  if (!course.lessons || course.lessons.length === 0) return 0
  // Get an array of lesson ids for this course 
  let courseLessons = course.lessons.map((lesson) => {
    return lesson._id
  })
  
  // Filter out completedLessons that is not part of current course lessons
  completedLessons = completedLessons.filter((lesson) => {
    return courseLessons.indexOf(lesson) !== -1 
  }) 
  
  return Math.round(completedLessons.length / courseLessons.length * 100)  
}

function adminOnly(nextState, replace) {
  let user = UserStore.getUser()
  if (user.user_type !== 'ADMIN') {
    replace('/*')
  }
}

function adminOrInstructor(nextState, replace) {
  let user = UserStore.getUser()
  if (user.user_type !== 'ADMIN' && user.user_type !== 'INSTRUCTOR') {
    replace('/*')
  }
}

function selfOnly(nextState, replace) {
  let user = UserStore.getUser()
  let user_id = nextState.params.user_id
  if (user._id !== user_id) {
    console.log(user._id)
    console.log(user_id)
  }
}

export {calcProgress, adminOnly, adminOrInstructor, selfOnly}

