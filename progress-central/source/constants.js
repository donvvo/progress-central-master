/**
 * Created by andrewjjung on 2016-05-17.
 */

const userConstants = {
  SET_USER: "set user retrieved from API",
  EDIT_USER_PROFILE: "edit user profile",
  GET_REGISTERED_STUDENTS: "get registered students",
  GET_UNREGISTERED_STUDENTS: "get unregistered students",
  GET_REGISTERED_INSTRUCTORS: "get registered instructors",
  GET_UNREGISTERED_INSTRUCTORS: "get unregistered instructors",
  GET_ALL_USERS: "get all users",
  REGISTER_STUDENTS: "register students",
  CHANGE_COMPLETE_STATUS: "change lesson complete status",
  DELETE_USER: "delete a user account",
  INVITE_USER: "invite a user",
  CHANGE_PASSWORD: "change password"
}

const courseConstants = {
  ADD_COURSE: "add course",
  EDIT_COURSE: "edit course",
  DELETE_COURSE: "delete course",
  ADD_LESSON: "add lesson",
  EDIT_LESSON: "edit lesson",
  DELETE_LESSON: "delete lesson",
  GET_ALL_COURSES: "get all courses for admin",
  GET_REGISTERED_COURSES: "get registered courses for student"
}

const errorConstants = {
  SET_ERROR: "set error"
}

const loadingConstants = {
  LOADING: "loading",
  LOADING_COMPLETE: "loading complete"
}

export {userConstants, courseConstants, errorConstants, loadingConstants}
