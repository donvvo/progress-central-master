/**
 * Created by andrewjjung on 2016-05-20.
 * 
 * Store for errors 
 */

import {EventEmitter} from 'events'

import AppDispatcher from '../AppDispatcher.js'

import {errorConstants} from '../constants.js'

const CHANGE_EVENT = 'change'

let error

let setError = function(receivedError) {
  error = receivedError
}

class ErrorStore extends EventEmitter {
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb)
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb)
  }

  getError() {
    return error
  }

  handleActions(action) {
    switch(action.type) {
      case errorConstants.SET_ERROR: {
        setError(action.error)
        this.emit(CHANGE_EVENT)
        break
      }
    }
  }
}

const errorStore = new ErrorStore()
AppDispatcher.register(errorStore.handleActions.bind(errorStore))

export default errorStore
