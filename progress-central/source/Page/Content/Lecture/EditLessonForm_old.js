import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import jQuery from 'jquery'
import validator from 'validator'
import Formsy from 'formsy-react'

import CourseActions from '../../../actions/CourseActions'

import TextInput from '../Form/TextInput'
import TextAreaInput from '../Form/TextAreaInput'

class EditLessonForm extends Component {
  constructor(props) {
    super(props)
    
    let media_url = this.props.lecture.content && this.props.lecture.content.media_url

    this.state = {
      canSubmit: false,
      media_url: media_url || "",
      video: null
    }
  }

  enableButton() {
    this.setState({
      canSubmit: true
    })
  }

  disableButton() {
    this.setState({
      canSubmit: false
    })
  }

  submit(form) {
    let formData = new FormData()

    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('media_url', this.state.media_url)
    formData.append('content', $('.summernote').summernote('code'))
    formData.append('video', this.state.video)
    
    CourseActions.editLesson(this.props.courseId, this.props.lecture._id, formData, (course) => {
      var url = `/course/${this.props.courseId}/lecture/${this.props.lecture._id}`
      browserHistory.push(url) 
    })
  }

  componentDidMount() {
    var self = this
    
    jQuery(document).ready(function() {
      $('.summernote').summernote({
        height: 300,
        toolbar: [
          ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['link', ['linkDialogShow', 'unlink']]
        ]
      })

      // Lecture video input
      var $inputVideo = $("#lecture-video");
      if (window.FileReader) {
        $inputVideo.change(function() {
          var files = this.files,
            file;

          if (!files.length) {
            return;
          }

          file = files[0];

          self.setState({video: file})
        });
      }
    }) 
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      media_url: nextProps.lecture.content && nextProps.lecture.content.media_url
    })
    $('.summernote').summernote('code', validator.unescape(nextProps.lecture.content.content))
  }

  clearFileInput() {
    document.getElementById("lecture-video").value = ""
    this.setState({video: null})
  }
  
  deleteExistingVideo() {
    this.setState({media_url: ""})
  }
  
  getExistingVideo(media_url) {
    if (media_url) {
      return (
        <p>{media_url.split('/').pop()}
          <a className="delete-file" onClick={this.deleteExistingVideo.bind(this)}><i className="fa fa-times" /></a>
        </p>
      )
    }
    else {
      return (
        <p>This lecture has no video.</p>
      )
    }   
  }

  render() {
    let existingVideo = this.getExistingVideo(this.state.media_url)
      
    return (
      <div className="ibox float-e-margins">
        <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)}
                     onInvalid={this.disableButton.bind(this)}>
          <div className="ibox-title">
            <h5>Edit Lecture</h5>
          </div>
          <div className="ibox-content">
            <div className="project-list">
              <div className="form-group">
                <label htmlFor="name">Lecture Name</label>
                <TextInput name="name" placeholder="Enter name of the lesson" required value={this.props.lecture.name} />
              </div>
              <div className="form-group">
                <label htmlFor="description">Lesson Description</label>
                <TextAreaInput name="description" rows="5" value={this.props.lecture.description} />
              </div> 
              <div className="form-group">
                <label htmlFor="media_url">Video</label>
                {existingVideo}
                <h5 style={{marginTop: '20px'}}>Upload a new lecture video: </h5> 
                <input id="lecture-video" type="file" accept=".mov,video/mp4" />
                <a className="delete-file" style={{visibility: (this.state.video ? 'visible' : 'hidden')}}
                   onClick={this.clearFileInput.bind(this)}><i className="fa fa-times"></i></a>
              </div>
              <div className="form-group">
                <label>Content</label>
                <div className="summernote"
                     dangerouslySetInnerHTML={{__html:(this.props.lecture.content 
                     && this.props.lecture.content.content
                 && validator.unescape(this.props.lecture.content.content))}}>
                </div>
              </div>
            </div>
          </div>
          <br/>
          <div>
            <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>
              <strong>Save</strong>
            </button>
          </div>
        </Formsy.Form>
      </div>
    )
  }
}

export default EditLessonForm
