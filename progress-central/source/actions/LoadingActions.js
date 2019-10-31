/**
 * Created by andrewjjung on 2016-05-21.
 */

import AppDispatcher from '../AppDispatcher.js'

import {loadingConstants} from '../constants.js'

class LoadingActions {
  static loading() {
    AppDispatcher.dispatch({
      type: loadingConstants.LOADING
    })
  }
  
  static loadingComplete() {
    AppDispatcher.dispatch({
      type: loadingConstants.LOADING_COMPLETE
    })
  }
}

export default LoadingActions
