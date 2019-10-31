import React, {Component} from 'react'
import {Link} from 'react-router'
import moment from 'moment'

import {calcProgress} from '../../../lib/userUtils'

class CourseRow extends Component {
  constructor(props) {
    super(props)
    
    this.dateFormat = "M.DD.YYYY"
  }
  getStatusClass(course) {
    if (course.status === "ACTIVE") {
      return "label label-primary"
    }
    else if (course.status === "INACTIVE") {
      return "label label-default"
    }
    else if (course.status === "COMPLETE"){
      return "label label-success"
    }
    else {
      throw new Error('Invalid course status')
    }
  }
  
  getEndDateCol(course) {
    if (course.status === "COMPLETE") {
      return (
        <td className="project-actions">
          <small>Course ended in:</small>
          <div>
            {moment(course.course_end).format(this.dateFormat)}
          </div>
        </td>
      )
    }
    else {
      return (
        <td className="project-actions">
          <small>Course ends in:</small>
          <div>
            {moment(course.course_end).fromNow()}
          </div>
        </td>
      )
    } 
  }

  getMiddleCol(course) {
    if (!this.props.user) return null

    if (this.props.user.user_type === 'ADMIN' || this.props.user.user_type === 'INSTRUCTOR') {
      return (
        <td className="project-description">
          <small>{course.description}</small>
        </td>
      )
    }
    else {
      let progressPercent = calcProgress(this.props.user, course)
      let progressBarWidth = {
        width: progressPercent + "%"
      }

      return (
        <td className="project-completion">
          <small>Completion with: {progressPercent}%</small>
          <div className="progress progress-mini">
            <div style={progressBarWidth} className="progress-bar"></div>
          </div>
        </td>
      )
    }
  }
  
  render() {
    let course = this.props.course
    let statusClass = this.getStatusClass(course)

    let startDate = moment(course.course_start).format(this.dateFormat)
    
    let endDateCol = this.getEndDateCol(course)

    let middleCol = this.getMiddleCol(course)

    return (
      <tr>
        <td className="project-status">
          <span className={statusClass}>{course.status}</span>
        </td>
        <td className="project-title">
          <Link to={'/course/' + course._id}>{course.name}</Link>
          <br/>
          <small>Started {startDate}</small>
        </td>
        {middleCol}
        {endDateCol}
      </tr>
    )
  }
}

export default CourseRow
