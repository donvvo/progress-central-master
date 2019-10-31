import React, {Component} from 'react'

import CourseStore from '../stores/CourseStore'

import AddLessonForm from './Content/Lecture/AddLessonForm.js'
import Header from './Header.js'

class AddLesson extends Component {
  constructor(props) {
    super(props)
    this.course_id = this.props.params.course_id

    this.state = {
      course: CourseStore.getACourse(this.course_id)
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
  }

  componentWillUnmount() {
    CourseStore.removeChangeListener(this.getACourse)
  }

  render() {
    let name = "Add lecture: " + this.state.course.name
    return ( 
      <div>
        <Header name={name}/>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
                <AddLessonForm courseId={this.props.params.course_id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddLesson
