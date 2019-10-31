import React, {Component} from 'react'

import CourseStore from '../stores/CourseStore'
import UserActions from '../actions/UserActions'

import Header from './Header.js'
import UnregisteredInstructorList from './Content/User/UnregisteredInstructorList'

class RegisterInstructor extends Component {
  constructor(props) {
    super(props)
    this.course_id = this.props.params.course_id
    
    this.state = { 
      course: CourseStore.getACourse(this.course_id), 
      instructors: []
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
    
    UserActions.getUnregisteredInstructors(this.course_id, (instructors) => {
      this.setState({
        instructors: instructors
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
        <Header name={`${course.name}: Register instructors`}/>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
                <UnregisteredInstructorList course={course} instructors={this.state.instructors} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RegisterInstructor
