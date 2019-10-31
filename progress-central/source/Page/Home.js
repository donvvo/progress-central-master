import React, {Component} from 'react'

import UserStore from '../stores/UserStore'
import CourseStore from '../stores/CourseStore'

import CourseList from './Content/Course/CourseList.js'
import Header from './Header.js'
import DashboardInfoBox from './Content/Widgets/DashboardInfoBox'


class Home extends Component {
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
    let breadcrumb = [{ name: 'Home', url: '/'}]

    var activeCourses = this.state.courses.filter(function(course) {
      return course.status === 'ACTIVE'
    })

    var inactiveCourses = this.state.courses.filter(function(course) {
      return course.status === 'INACTIVE'
    })

    var numActiveLectures = 0
    activeCourses.forEach((course) => {
      numActiveLectures += course.lessons.length
    })

    var numCourseEndingSoon = 0
    activeCourses.forEach((course) => {
      if ((course.course_end - Date.now()) < (60 * 60 * 1000 * 24 * 7)) {
        numCourseEndingSoon += 1
      }
    })

    return (
      <div>
        <Header name={"Welcome to Progress Central, " + this.state.user.first_name + "!"} breadcrumb={breadcrumb}/>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-3">
              <DashboardInfoBox labelTitle="Active" labelClass="label-primary"
                                boxTitle="Courses" boxContent={activeCourses.length}
                                boxSmallCaption="Active courses" />
            </div>
            <div className="col-lg-3">
              <DashboardInfoBox labelTitle="Inactive" labelClass="label-default"
                                boxTitle="Courses" boxContent={inactiveCourses.length}
                                boxSmallCaption="Courses starting soon" />
            </div>
            <div className="col-lg-3">
              <DashboardInfoBox labelTitle="Active" labelClass="label-success"
                                boxTitle="Lessons" boxContent={numActiveLectures}
                                boxSmallCaption="Active lessons" />
            </div>
            <div className="col-lg-3">
              <DashboardInfoBox labelTitle="Ending Soon" labelClass="label-danger"
                                boxTitle="Courses" boxContent={numCourseEndingSoon}
                                boxSmallCaption="Ending in a week" />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <CourseList user={this.state.user} courses={this.state.courses.slice(-3)} condensedList={true} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
