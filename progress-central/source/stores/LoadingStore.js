/**
 * Created by andrewjjung on 2016-05-21.
 */

import {EventEmitter} from 'events'

import AppDispatcher from '../AppDispatcher.js'

import {loadingConstants} from '../constants.js'

const CHANGE_EVENT = 'change'

let loading = false

class LoadingStore extends EventEmitter {
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb)
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb)
  }

  getLoadingStatus() {
    return loading
  }

  handleActions(action) {
    switch(action.type) {
      case loadingConstants.LOADING: 
        loading = true
        this.emit(CHANGE_EVENT)
        break
      case loadingConstants.LOADING_COMPLETE:
        loading = false
        this.emit(CHANGE_EVENT)
        break
    }
  }
}

const loadingStore = new LoadingStore()
AppDispatcher.register(loadingStore.handleActions.bind(loadingStore))

export default loadingStore
