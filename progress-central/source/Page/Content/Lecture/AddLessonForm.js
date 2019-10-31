import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import CourseActions from '../../../actions/CourseActions'
import LessonForm from './LessonForm'


class AddLessonForm extends Component {
  submit(form) {
    let formData = new FormData()

    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('media_url', this.state.media_url)
    formData.append('pdf_url', this.state.pdf_url)
    formData.append('video_url', form.video_url)
    formData.append('content', $('.summernote').summernote('code'))
    formData.append('video', this.state.video)
    formData.append('pdf', this.state.pdf)

    CourseActions.addLesson(this.props.courseId, formData, (course) => {
      var url = '/course/' + this.props.courseId 
      browserHistory.push(url) 
    })
  }

  render() {
    return (
      <div>
        <LessonForm form_title="Add Lecture" _submitHandler={this.submit} courseId={this.props.courseId}/>
      </div>
    )
  }
}

export default AddLessonForm
