import React, {Component, PropTypes} from 'react'
import {browserHistory} from 'react-router'

import CourseActions from '~/source/actions/CourseActions'

class DeleteLectureModal extends Component {
  handleClick() {
    CourseActions.deleteLecture(this.props.course_id, this.props.lecture, () => {
      $('#modal-delete').modal('hide')
      browserHistory.push(`/course/${this.props.course_id}`)
    })
  } 
  
  render() {
    return (
      <div id="modal-delete" ref="modal_delete" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body text-left">
              <div className="row">
                <div className="col-sm-12"><h3 className="m-t-none m-b">Delete Lecture</h3>
                  <p>All the records associated with this lecture will be deleted. Also, all student records 
                    for this lecture will be deleted as well. This action is irreversible.
                  <br /><br /><b>Do you really want to delete this lecture?</b></p>
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

DeleteLectureModal.propTypes = {
  course_id: PropTypes.string.isRequired,
  lecture: PropTypes.object.isRequired
}

export default DeleteLectureModal
