import React, {Component, PropTypes} from 'react'

import CourseProgressBar from '../Course/CourseProgressBar'

class SmallUserProfileBox extends Component {
  render() {
    let selectedUser = this.props.selectedUser

    let userProfile
    if (selectedUser) {
      let courseProgressBar
      if (selectedUser.user_type === 'STUDENT' && this.props.courseProgressBarDisplay) {
        courseProgressBar = (
          <div className="row">
            <div className="col-lg-12">
              <strong>
                Course Progress
              </strong>
              <CourseProgressBar student={selectedUser} course={this.props.course} />
            </div>
          </div>
        )
      }

      userProfile = (
        <div className="tab-pane active">
          <div className="row m-b-sm">
            <div className="col-lg-12 text-center">
              <img alt="image" className="img-circle" src={selectedUser.profile_photo}
                   style={{width: "62px"}}/>
            </div>
          </div>
          <div className="row m-b-sm">
            <div className="col-lg-12 text-center">
              <h2 style={{wordWrap: 'break-word'}}>{`${selectedUser.first_name} ${selectedUser.last_name}`}</h2>
            </div>
          </div>
          <div className="row m-b-lg">
            <div className="col-lg-12">
              <strong>
                About me
              </strong>
              <p>{selectedUser.description ? selectedUser.description : "This user has not provided a description"}</p>
            </div>
          </div>
          {courseProgressBar}
        </div>
      )
    }
    else {
      userProfile = (
        <div className="tab-pane active">
          <div className="row m-b-lg">
            <div className="col-lg-12 text-center">
              <h4>{this.props.boxNoDefaultMessage}</h4>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="ibox-content">
        <div className="tab-content">
          {userProfile}
        </div>
      </div>
    )
  }
}

SmallUserProfileBox.propTypes = {
  course: PropTypes.object,
  selectedUser: PropTypes.object,
  boxNoDefaultMessage: PropTypes.string.isRequired,
  courseProgressBarDisplay: PropTypes.bool
}

export default SmallUserProfileBox
