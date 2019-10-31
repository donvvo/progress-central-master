/**
 * Created by andrewjjung on 2016-05-20.
 *
 * Actions for ErorrStore
 */

import AppDispatcher from '../AppDispatcher.js'

import {errorConstants} from '../constants.js'

class ErrorActions {
  static setError(error) {
    AppDispatcher.dispatch({
      type: errorConstants.SET_ERROR,
      error: error
    })
  }
}

export default ErrorActions
