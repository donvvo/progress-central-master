import React, {Component} from 'react'
import {Link} from 'react-router'

class LectureRow extends Component {
  getCompleteStatus() {
    if (this.props.user.user_type === 'ADMIN') return null
    else {
      // Check if this lecture id is in user.courses.completed_lessons of the student
      if (!this.props.user.courses) return null
      let course = this.props.user.courses.find((course) => {
        return course._id === this.props.course._id
      })
      if (course.completed_lessons && course.completed_lessons.indexOf(this.props.lecture._id) !== -1) {
        return (
          <td className="project-status">
            <span className="label label-success">Complete</span>
          </td>
        )
      }
      else {
        return (
          <td className="project-status">
            <span className="label label-default">Incomplete</span>
          </td>
        )
      }
    }
  }

  render() {
    let lecture = this.props.lecture
    let completeStatus = this.getCompleteStatus()
    
    return (
      <tr>
        <td className="project-title">
          <Link to={this.props.baseUrl + '/lecture/' + lecture._id}>{lecture.name}</Link>
          <br/>
          <small>{lecture.description}</small>
        </td>
        {completeStatus}
      </tr>
    )
  }
}

export default LectureRow
