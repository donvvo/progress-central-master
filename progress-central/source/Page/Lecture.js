import React, {Component} from 'react'
import {Link} from 'react-router'
import validator from 'validator'

import UserStore from '../stores/UserStore'
import CourseStore from '../stores/CourseStore'

import UserActions from '../actions/UserActions'

import DeleteLectureModal from './Content/Lecture/DeleteLectureModal'
import HTML5VideoPlayer from './Content/Lecture/HTML5VideoPlayer'

class Lecture extends Component {
  constructor(props) {
    super(props)
    this.course_id = this.props.params.course_id
    this.lecture_id = this.props.params.lecture_id
    
    this.state = {
      user: UserStore.getUser(),
      lecture: CourseStore.getALecture(this.course_id, this.lecture_id)
    }
    
    this.getUser = this.getUser.bind(this)
    this.getALecture = this.getALecture.bind(this)
  }

  getUser() {
    this.setState({
      user: UserStore.getUser()
    })
  }

  getALecture() {
    this.setState({
      lecture: CourseStore.getALecture(this.course_id, this.lecture_id)
    })
  }

  componentWillMount() {
    UserStore.addChangeListener(this.getUser)
    CourseStore.addChangeListener(this.getALecture)
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.getUser)
    CourseStore.removeChangeListener(this.getALecture)
  }
  
  handleStatusChange() {
    UserActions.changeLessonCompleteStatus(this.course_id, this.lecture_id)
  }

  render() {
    let mediaContent, pdfContent

    if (this.state.lecture.content && this.state.lecture.content.media_url) {
      mediaContent = (
        <div className="row" style={{paddingTop: "30px", paddingBottom: "30px"}}>
          <div className="col-sm-12 text-center">
            <HTML5VideoPlayer width={450} height={450}
                              src={this.state.lecture.content.media_url} />
          </div>
        </div>
      )
    }

    if (this.state.lecture.content && this.state.lecture.content.pdf_url) {
      pdfContent = (
        <div style={{borderTop: "1px solid #e7eaec", marginTop: '40px'}}>
          <h4>PDF attachment</h4>
          <a href={this.state.lecture.content.pdf_url} target="_blank">
            {this.state.lecture.content.pdf_url.split('/').pop()}
          </a>
        </div>
      )
    }

    let content
    if (this.state.lecture.content && this.state.lecture.content.content) {
      content = validator.unescape(this.state.lecture.content.content)
    }
    
    let completeButton
    if (this.state.user.user_type === 'STUDENT') {
      let course = this.state.user.courses.find((course) => {
        return course._id === this.course_id
      })
      let completed = (course.completed_lessons && (course.completed_lessons.indexOf(this.lecture_id) !== -1))
      if (completed) {
        completeButton = (
          <div className="col-sm-3 text-right">
            <button style={{marginTop: '20px'}} 
                    onClick={this.handleStatusChange.bind(this)}
                    className="btn btn-default">Mark as Incomplete</button>
          </div>
        )
      }
      else {
        completeButton = (
          <div className="col-sm-3 text-right">
            <button style={{marginTop: '20px'}} 
                    onClick={this.handleStatusChange.bind(this)}
                    className="btn btn-success">Mark as Complete</button>
          </div>
        ) 
      }
    }
    else if (this.state.user.user_type === 'ADMIN' || this.state.user.user_type === 'INSTRUCTOR') {
      completeButton = (
        <div className="col-sm-3 text-right">
          <Link to={`/course/${this.course_id}/lecture/${this.lecture_id}/edit`} 
                style={{margin: '20px 5px 0'}} className="btn btn-primary">Edit</Link>
          <a className="btn btn-default" data-toggle="modal" href="#modal-delete" style={{margin: '20px 5px 0'}}>Delete</a>
          <DeleteLectureModal lecture={this.state.lecture} course_id={this.course_id} />
        </div>       
      ) 
    }
    
    return (
      <div>
        <div className="row wrapper border-bottom white-bg page-heading">
          <div className="col-sm-9">
            <h2>{this.state.lecture.name}</h2>
            <p>{this.state.lecture.description}</p>			
          </div>
          {completeButton}
        </div>


        <div className="wrapper wrapper-content animated fadeInRight" style={{paddingBottom: '30px'}}>

          <div className="row">
            <div className="col-lg-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Lecture Video</h5>

                </div>
                <div className="ibox-content">
                  {mediaContent}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Lecture Content</h5>

                </div>
                <div className="ibox-content profile-content">
                  <div dangerouslySetInnerHTML={{__html:content}}></div>
                  {pdfContent}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    )
  }
}

export default Lecture
