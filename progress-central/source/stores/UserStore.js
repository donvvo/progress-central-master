/**
 * Created by andrewjjung on 2016-05-17.
 */

import {EventEmitter} from 'events'

import AppDispatcher from '../AppDispatcher.js'
import ErrorActions from '../actions/ErrorActions'

import {userConstants} from '../constants.js'

const CHANGE_EVENT = 'change'

let user

// Get initial user data from server
let rawUserData = document.getElementById('initial-user-data').textContent
if (rawUserData.length > 0) {
  user = JSON.parse(rawUserData)
}

let setUser = function(receivedUser) {
  user = receivedUser
}

class UserStore extends EventEmitter {
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb)
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb)
  }

  getUser() {
    return user
  }
  
  handleActions(action) {
    switch(action.type) {
      case userConstants.SET_USER: 
        setUser(action.user)
        this.emit(CHANGE_EVENT)
        break
      case userConstants.EDIT_USER_PROFILE:
        setUser(action.user)
        this.emit(CHANGE_EVENT)
        break
      case userConstants.CHANGE_PASSWORD:
        setUser(action.user)
        this.emit(CHANGE_EVENT)
        break
      case userConstants.CHANGE_COMPLETE_STATUS:
        setUser(action.user)
        this.emit(CHANGE_EVENT)
        break
    }
  }
}

const userStore = new UserStore()
AppDispatcher.register(userStore.handleActions.bind(userStore))

export default userStore
