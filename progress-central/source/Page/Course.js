import React, {Component} from 'react'
import moment from 'moment'

import UserStore from '../stores/UserStore'
import CourseStore from '../stores/CourseStore'
import UserActions from '../actions/UserActions'

import LectureList from './Content/Lecture/LectureList.js'
import Header from './Header.js'
import EditCourse from './Content/Course/EditCourse'
import RegisteredStudentList from './Content/User/RegisteredStudentList'
import RegisteredInstructorList from './Content/User/RegisteredInstructorList'
import DeleteCourseModal from './Content/Course/DeleteCourseModal'

class Course extends Component {
  constructor(props) {
    super(props)
    this.course_id = this.props.params.course_id
    this.dateFormat = "M.DD.YYYY"
    
    this.state = { 
      user: UserStore.getUser(), 
      course: CourseStore.getACourse(this.course_id), 
      students: [],
      instructors: []
    }

    this.getUser = this.getUser.bind(this) 
    this.getACourse = this.getACourse.bind(this)
  }

  getUser() {
    this.setState({
      user: UserStore.getUser()
    })
  }
  
  getACourse() {
    this.setState({
      course: CourseStore.getACourse(this.course_id)
    })
  }

  componentWillMount() {
    UserStore.addChangeListener(this.getUser)
    CourseStore.addChangeListener(this.getACourse)
    
    if (this.state.user.user_type === 'ADMIN' || this.state.user.user_type === 'INSTRUCTOR') {
      UserActions.getRegisteredStudents(this.course_id, (students) => {
        this.setState({
          students: students
        })
      })

      if (this.state.user.user_type === 'ADMIN') {
        UserActions.getRegisteredInstructors(this.course_id, (instructors) => {
          this.setState({
            instructors: instructors
          })
        })
      }
    }
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.getUser)
    CourseStore.removeChangeListener(this.getACourse)
  }

  getStatusClass(course) {
    if (course.status === "ACTIVE") {
      return "label label-primary"
    }
    else if (course.status === "INACTIVE") {
      return "label label-default"
    }
    else if (course.status === "COMPLETE"){
      return "label label-success"
    }
  }

  render() {
    let course = this.state.course
    let statusClass = this.getStatusClass(course)
    
    let courseEditButton 
    if(this.state.user.user_type === 'ADMIN') {
      courseEditButton = (
        <div className="ibox-tools">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#">
            <i className="fa fa-wrench"></i>
          </a>
          <ul className="dropdown-menu dropdown-user">
            <li><a data-toggle="modal" href="#modal-form">Edit</a>
            </li>
            <li><a data-toggle="modal" href="#modal-delete">Delete</a>
            </li>
          </ul>
          <EditCourse course={course} />
          <DeleteCourseModal course={course} />
        </div>
      )
    }
    else if (this.state.user.user_type === 'INSTRUCTOR') {
      courseEditButton = (
        <div className="ibox-tools">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#">
            <i className="fa fa-wrench"></i>
          </a>
          <ul className="dropdown-menu dropdown-user">
            <li><a data-toggle="modal" href="#modal-form">Edit</a>
            </li>
          </ul>
          <EditCourse course={course} />
        </div>
      )
    }

    let registeredInstructorList
    if(this.state.user.user_type === 'ADMIN') {
      registeredInstructorList = (
        <div className="col-lg-12">
          <div className="wrapper wrapper-content animated fadeInUp">
            <RegisteredInstructorList course={course} users={this.state.instructors} />
          </div>
        </div>
      )
    }

    let registeredStudentList
    if(this.state.user.user_type === 'ADMIN' || this.state.user.user_type === 'INSTRUCTOR') {
      registeredStudentList = (
        <div className="col-lg-12">
          <div className="wrapper wrapper-content animated fadeInUp">
            <RegisteredStudentList course={course} users={this.state.students} />
          </div>
        </div>
      )
    }
    
    return ( 
      <div>
        <Header name={"Course name: " + course.name}/>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Course Info</h5>
                  {courseEditButton}
                </div>
                <div>
                  <div className="ibox-content">
                    <h4>Description</h4>
                    <p>{course.description}</p>
                    <br/>
                    <div className="row">
                      <div className="col-sm-4">
                        <h4>Status</h4>
                        <p><span className={statusClass}>{course.status}</span></p> 
                      </div>
                      <div className="col-sm-4">
                        <h4>Start Date</h4>
                        <p>{moment(course.course_start).format(this.dateFormat)}</p> 
                      </div>
                      <div className="col-sm-4">
                        <h4>End Date</h4>
                        <p>{moment(course.course_end).format(this.dateFormat)}</p> 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
                <LectureList user={this.state.user} course={course} baseUrl={'/course/' + this.props.params.course_id} 
                             lectures={course.lessons} />
              </div>
            </div>
            {registeredInstructorList}
            {registeredStudentList}
          </div>
        </div>
      </div>
    )
  }
}

export default Course
