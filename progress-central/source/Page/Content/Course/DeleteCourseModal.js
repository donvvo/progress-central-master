import React, {Component, PropTypes} from 'react'
import {browserHistory} from 'react-router'

import CourseActions from '~/source/actions/CourseActions'

class DeleteCourseModal extends Component {
  handleClick() {
    CourseActions.deleteCourse(this.props.course, () => {
      $('#modal-delete').modal('hide')
      browserHistory.push(`/courses`)
    })
  } 
  
  render() {
    return (
      <div id="modal-delete" ref="modal_delete" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body text-left">
              <div className="row">
                <div className="col-sm-12"><h3 className="m-t-none m-b">Delete Course</h3>
                  <p>All the records associated with this course will be deleted. Also, all student records 
                    for this course will be deleted as well. This action is irreversible.
                  <br /><br /><b>Do you really want to delete this course?</b></p>
                  <br />
                </div>
                <div className="col-sm-12 text-right">
                  <button className="btn btn-default btn-margin" data-dismiss="modal">
                    <strong>Cancel</strong>
                  </button>
                  <button className="btn btn-danger btn-margin" onClick={this.handleClick.bind(this)}>
                    <strong>Delete</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DeleteCourseModal.propTypes = {
  course: PropTypes.object.isRequired
}

export default DeleteCourseModal
