import React, {Component} from 'react'
import {Link} from 'react-router'

import CourseRow from './CourseRow.js'
import AddCourse from './AddCourse.js'

class CourseList extends Component {
  render() {
    if (this.props.courses && this.props.courses.length > 0) {
      this.courseComponents = this.props.courses.map((course) => (
        <CourseRow user={this.props.user} key={course._id} course={course} />
      ))
    }
    else {
      this.courseComponents = (
        <tr>
          <td className="project-title text-center">
            <h4>Currently there are no courses</h4>
          </td>
        </tr>
      )
    }

    let addCourse
    if (this.props.user && (this.props.user.user_type == "ADMIN")) {
      addCourse = (
        <div>
          <div className="text-right">
            <a data-toggle="modal" className="btn btn-primary" href="#modal-form">Add Course</a>
          </div>
          <AddCourse />
        </div>
      )
    }

    let condensedList
    if (this.props.condensedList) {
      condensedList = (
        <div className="row text-center">
          <Link className="btn btn-primary" to="/courses">See All</Link>
        </div>
      )
    }

    return (
      <div className="ibox">
        <div className="ibox-title">
          <h5>Courses</h5>
          {addCourse}
        </div>
        <div className="ibox-content">
          <div className="project-list">
            <table className="table table-hover">
              <tbody>
                {this.courseComponents}
              </tbody>
            </table>
            {condensedList}
          </div>
       </div>
      </div>
    )
  }
}

export default CourseList
