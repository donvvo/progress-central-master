import React, {Component} from 'react'

import CourseStore from '../stores/CourseStore'
import UserActions from '../actions/UserActions'

import Header from './Header.js'
import UnregisteredStudentList from './Content/User/UnregisteredStudentList'

class RegisterStudent extends Component {
  constructor(props) {
    super(props)
    this.course_id = this.props.params.course_id
    
    this.state = { 
      course: CourseStore.getACourse(this.course_id), 
      students: []
    }

    this.getACourse = this.getACourse.bind(this)
  }
  
  getACourse() {
    this.setState({
      course: CourseStore.getACourse(this.course_id)
    })
  }

  componentWillMount() {
    CourseStore.addChangeListener(this.getACourse)
    
    UserActions.getUnregisteredStudents(this.course_id, (students) => {
      this.setState({
        students: students
      })
    })
  }

  componentWillUnmount() {
    CourseStore.removeChangeListener(this.getACourse)
  }

  render() {
    let course = this.state.course
    
    return ( 
      <div>
        <Header name={`${course.name}: Register students`}/>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
                <UnregisteredStudentList course={course} students={this.state.students} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RegisterStudent
