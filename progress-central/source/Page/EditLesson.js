import React, {Component} from 'react'

import CourseStore from '../stores/CourseStore'

import EditLessonForm from './Content/Lecture/EditLessonForm'
import Header from './Header.js'

class EditLecture extends Component {
  constructor(props) {
    super(props)
    this.course_id = this.props.params.course_id
    this.lecture_id = this.props.params.lecture_id

    this.state = {
      lecture: CourseStore.getALecture(this.course_id, this.lecture_id)
    }

    this.getALecture = this.getALecture.bind(this)
  }

  getALecture() {
    this.setState({
      lecture: CourseStore.getALecture(this.course_id, this.lecture_id)
    })
  }

  componentWillMount() {
    CourseStore.addChangeListener(this.getALecture)
  }

  componentWillUnmount() {
    CourseStore.removeChangeListener(this.getALecture)
  }

  render() {
    let name = "Edit lecture: " + this.state.lecture.name
    return ( 
      <div>
        <Header name={name}/>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
                <EditLessonForm courseId={this.course_id} lecture={this.state.lecture} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EditLecture
