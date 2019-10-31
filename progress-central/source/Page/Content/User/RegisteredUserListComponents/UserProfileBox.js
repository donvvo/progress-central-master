import React, {Component, PropTypes} from 'react'

import SmallUserProfileBox from '../SmallUserProfileBox'

class UserProfileBox extends Component {
  render() {
    return (
      <div className="ibox registered-user-profile-box">
        <div className="ibox-title">
          <h5>{this.props.boxTitle}</h5>
        </div>
        <SmallUserProfileBox course={this.props.course}
                             selectedUser={this.props.selectedUser}
                             boxNoDefaultMessage={this.props.boxNoDefaultMessage}
                             courseProgressBarDisplay={this.props.courseProgressBarDisplay}/>
      </div>
    )
  }
}

UserProfileBox.propTypes = {
  course: PropTypes.object,
  selectedUser: PropTypes.object,
  boxTitle: PropTypes.string.isRequired,
  boxNoDefaultMessage: PropTypes.string.isRequired,
  courseProgressBarDisplay: PropTypes.bool
}

export default UserProfileBox
