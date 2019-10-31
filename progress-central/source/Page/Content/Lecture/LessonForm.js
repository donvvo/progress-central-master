import React, {Component, PropTypes} from 'react'
import jQuery from 'jquery'
import validator from 'validator'
import Formsy from 'formsy-react'

import TextInput from '../Form/TextInput'
import TextAreaInput from '../Form/TextAreaInput'

class LessonForm extends Component {
  constructor(props) {
    super(props)

    let media_url, pdf_url
    if (this.props.lecture) {
      media_url = this.props.lecture.content && this.props.lecture.content.media_url
      pdf_url = this.props.lecture.content && this.props.lecture.content.pdf_url
    }

    this.state = {
      canSubmit: false,
      media_url: media_url || "",
      pdf_url: pdf_url || "",
      video: null,
      pdf: null
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
        ],
      })

      // Lecture video and PDF input
      var $inputVideo = $("#lecture-video");
      var $inputPDF = $("#lecture-pdf");
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
        $inputPDF.change(function() {
          var files = this.files,
            file;

          if (!files.length) {
            return;
          }

          file = files[0];

          self.setState({pdf: file})
        });
      }
    }) 
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lecture) {
      this.setState({
        media_url: nextProps.lecture.content && nextProps.lecture.content.media_url,
        pdf_url: nextProps.lecture.content && nextProps.lecture.content.pdf_url
      })
      $('.summernote').summernote('code', validator.unescape(nextProps.lecture.content.content))
    }
  }

  clearVideoFileInput() {
    document.getElementById("lecture-video").value = ""
    this.setState({video: null})
  }

  clearPDFFileInput() {
    document.getElementById("lecture-pdf").value = ""
    this.setState({pdf: null})
  }

  deleteExistingVideo() {
    this.setState({media_url: ""})
  }

  deleteExistingPDF() {
    this.setState({pdf_url: ""})
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

  getExistingPDF(pdf_url) {
    if (pdf_url) {
      return (
        <p>{pdf_url.split('/').pop()}
          <a className="delete-file" onClick={this.deleteExistingPDF.bind(this)}><i className="fa fa-times" /></a>
        </p>
      )
    }
    else {
      return (
        <p>This lecture has no pdf attachment.</p>
      )
    }
  }

  render() {
    let existingVideo = this.getExistingVideo(this.state.media_url)
    let existingPDF = this.getExistingPDF(this.state.pdf_url)

    let lectureName = "",
      lectureDescription = "",
      lectureContent = ""

    if (this.props.lecture) {
      lectureName = this.props.lecture.name
      lectureDescription = this.props.lecture.description
      lectureContent = this.props.lecture.content
        && this.props.lecture.content.content
        && validator.unescape(this.props.lecture.content.content)
    }
    
    return (
      <div className="ibox float-e-margins">
        <Formsy.Form onValidSubmit={this.props._submitHandler.bind(this)} onValid={this.enableButton.bind(this)}
                     onInvalid={this.disableButton.bind(this)}>
          <div className="ibox-title">
            <h5>{this.props.form_title}</h5>
          </div>
          <div className="ibox-content">
            <div className="project-list">
              <div className="form-group">
                <label htmlFor="name">Lecture Name</label>
                <TextInput name="name" placeholder="Enter name of the lesson" required value={lectureName} />
              </div>
              <div className="form-group">
                <label htmlFor="description">Lesson Description</label>
                <TextAreaInput name="description" rows="5" value={lectureDescription} />
              </div>
              <div className="form-group">
                <label htmlFor="media_url">Video</label>
                {existingVideo}
                <div className="row">
                  <div className="col-sm-6">
                    <h5>Upload a new lecture video: </h5>
                    <input id="lecture-video" type="file" accept=".mov,video/mp4" />
                    <a className="delete-file" style={{visibility: (this.state.video ? 'visible' : 'hidden')}}
                       onClick={this.clearVideoFileInput.bind(this)}><i className="fa fa-times"></i></a>
                  </div>
                  <div className="col-sm-6">
                    <h5>Or URL of an existing video (must be .mov or .mp4 format):</h5>
                    <TextInput name="video_url" validations="isUrl"
                               validationError="Please enter a valid url"
                               placeholder="Enter url of the video" value="" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <p style={{marginTop: '20px'}} className="text-muted small">
                      Any new video will override old one. Uploaded video file will override video url.</p>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Content</label>
                <div className="summernote"
                     dangerouslySetInnerHTML={{__html: lectureContent}}>
                </div>
              </div>
              <div className="form-group">
                <label>PDF Attachment</label>
                {existingPDF}
                <h5>Upload a new PDF: </h5>
                <input id="lecture-pdf" type="file" accept=".pdf" />
                <a className="delete-file" style={{visibility: (this.state.pdf ? 'visible' : 'hidden')}}
                   onClick={this.clearPDFFileInput.bind(this)}><i className="fa fa-times"></i></a>
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

LessonForm.propTypes = {
  form_title: PropTypes.string.isRequired,
  lecture: PropTypes.object,
  _submitHandler: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
  lessonId: PropTypes.string
}

export default LessonForm
