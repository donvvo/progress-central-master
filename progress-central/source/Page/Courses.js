import React, {Component} from 'react'

import UserStore from '../stores/UserStore'
import CourseStore from '../stores/CourseStore'

import CourseList from './Content/Course/CourseList.js'
import Header from './Header.js'


class Courses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courses: CourseStore.getCourses(),
      user: UserStore.getUser()
    }
    
    this.getUser = this.getUser.bind(this)
    this.getCourses = this.getCourses.bind(this)
  }

  getUser() {
    this.setState({
      user: UserStore.getUser()
    })
  }
  
  getCourses() {
    this.setState({
      courses: CourseStore.getCourses()
    })
  }

  componentWillMount() {
    UserStore.addChangeListener(this.getUser)
    CourseStore.addChangeListener(this.getCourses)
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.getUser)
    CourseStore.removeChangeListener(this.getCourses)
  }

  render() {
    return (
      <div>
        <Header name={"Courses"}/>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
                <CourseList user={this.state.user} courses={this.state.courses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Courses
