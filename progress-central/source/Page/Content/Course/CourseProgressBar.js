import React, {Component, PropTypes} from 'react'

import {calcProgress} from '../../../lib/userUtils'

class CourseProgressBar extends Component {
  render() {
    let progressPercent = calcProgress(this.props.student, this.props.course)
    let progressBarWidth = {
      width: progressPercent + "%"
    }

    return (
      <div>
        <small>Completion with: {progressPercent}%</small>
        <div className="progress progress-mini">
          <div style={progressBarWidth} className="progress-bar"></div>
        </div>
      </div>
    )
  }
}

CourseProgressBar.propTypes = {
  course: PropTypes.object,
  student: PropTypes.object
}
export default CourseProgressBar
