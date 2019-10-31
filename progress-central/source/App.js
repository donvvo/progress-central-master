import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, Link, browserHistory} from 'react-router'

import ErrorActions from './actions/ErrorActions'
import CourseActions from './actions/CourseActions'

import UserStore from './stores/UserStore'
import ErrorStore from './stores/ErrorStore'

import {adminOnly, adminOrInstructor, selfOnly} from './lib/userUtils'

import PageWrapper from './Page/PageWrapper.js'

import Home from './Page/Home.js'
import AboutUs from './Page/AboutUs'
import Help from './Page/Help'
import Course from './Page/Course.js'
import AddLesson from './Page/AddLesson.js'
import EditLesson from './Page/EditLesson'
import Lecture from './Page/Lecture.js'
import UserProfile from './Page/UserProfile.js'
import UserProfileEdit from './Page/UserProfileEdit.js'
import RegisterStudent from './Page/RegisterStudent'
import RegisterInstructor from './Page/RegisterInstructor'
import Notifications from './Page/Notifications'
import Courses from './Page/Courses'
import UserList from './Page/UserList'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: UserStore.getUser(),
      error: ErrorStore.getError()
    }
    
    this.getUser = this.getUser.bind(this)
    this.getError = this.getError.bind(this)
  }

  getUser() {
    this.setState({
      user: UserStore.getUser()
    })
  }
  
  getError() {
    this.setState({
      error: ErrorStore.getError()
    })
  }
  
  componentWillMount() {
    UserStore.addChangeListener(this.getUser)
    ErrorStore.addChangeListener(this.getError)
    
    if (!this.state.user) {
      ErrorActions.setError(Error('Cannot fetch initial user data'))
    }
    else if (this.state.user.user_type === 'ADMIN') {
      CourseActions.getAllCourses()
    }
    else {
      CourseActions.getRegisteredCourses()
    }
  }
  
  componentWillUnmount() {
    UserStore.removeChangeListener(this.getUser)
    ErrorStore.removeChangeListener(this.getError)
  }

  render() {
    if (this.state.error) {
      let error = this.state.error
      let errorContent
      if (error.status === 400) {
        errorContent = (
          <div className="error-desc">
            Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.
            <br/>
            You can go back to main page: <br/><a href="/" className="btn btn-primary m-t">Dashboard</a>
          </div>
        ) 
      }
      else {
        error.status = error.status || 500
        errorContent = (
          <div className="error-desc">
            The server encountered something unexpected that didn't allow it to complete the request. We apologize.
            <br/>
            You can go back to main page: <br/><a href="/" className="btn btn-primary m-t">Dashboard</a>
          </div> 
        )
      }
      return (
        <div className="gray-bg" style={{ width: '100vw', height: '100vh', paddingBottom: "50px"}}>
          <div className="middle-box text-center animated fadeInDown">
            <h1>{error.status}</h1>
            <h3 className="font-bold">{error.statusText}</h3>

            {errorContent}
          </div>
        </div>
      )
    }
    return (
      <PageWrapper user={this.state.user} component={this.props.children}/>
    )
  }
}

class PageNotFound extends React.Component {
  render() {
    return (
      <div className="gray-bg" style={{ width: '100vw', height: '100vh', paddingBottom: "50px"}}>
        <div className="middle-box text-center animated fadeInDown">
          <h1>404</h1>
          <h3 className="font-bold">Page Not Found</h3>

          <div className="error-desc">
            Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.
            <br/>
            You can go back to main page: <br/><a href="/" className="btn btn-primary m-t">Dashboard</a>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/help" component={Help} />
      <Route path="/courses" component={Courses} />
      <Route path="/course/:course_id" component={Course} />
      <Route path="/course/:course_id/register" component={RegisterStudent} onEnter={adminOrInstructor} />
      <Route path="/course/:course_id/register/instructor" component={RegisterInstructor} onEnter={adminOnly} />
      <Route path="/course/:course_id/lecture/add" component={AddLesson} onEnter={adminOrInstructor} />
      <Route path="/course/:course_id/lecture/:lecture_id" component={Lecture} />
      <Route path="/course/:course_id/lecture/:lecture_id/edit" component={EditLesson} onEnter={adminOrInstructor}/>
      <Route path="/user/profile" component={UserProfile} />
      <Route path="/user/profile/edit" component={UserProfileEdit} />
      <Route path="/user-list" component={UserList} onEnter={adminOnly} />
    </Route>
    <Route path="*" component={PageNotFound} />
  </Router>
), document.getElementById('wrapper'))
