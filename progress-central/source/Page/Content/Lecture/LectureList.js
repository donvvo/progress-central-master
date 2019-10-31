import React, {Component} from 'react'
import {Link} from 'react-router'

import LectureRow from './LectureRow.js'

class LectureList extends Component {
  render() {
    if (this.props.lectures && this.props.lectures.length > 0) {
      this.lectureComponents = this.props.lectures.map((lecture) => (
        <LectureRow user={this.props.user} course={this.props.course} 
                    key={lecture._id} lecture={lecture} baseUrl={this.props.baseUrl} />  
      ))
    }
    else {
      this.lectureComponents = (
        <tr>
          <td className="project-title text-center">
            <h4>Currently there are no lectures</h4>
          </td>
        </tr>
      )
    }

    let addLecture
    if (this.props.user && (this.props.user.user_type === "ADMIN" || this.props.user.user_type === "INSTRUCTOR")) {
      addLecture = (
        <div className="text-right">
          <Link to={this.props.baseUrl + "/lecture/add"} className="btn btn-primary">Add Lecture</Link>
        </div>
      )
    }

    return (
      <div className="ibox">
        <div className="ibox-title">
          <h5>Lectures</h5>
          {addLecture}
        </div>
        <div className="ibox-content">
          <div className="project-list">
            <table className="table table-hover">
              <tbody>
                {this.lectureComponents}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default LectureList
