import React, {Component, PropTypes} from 'react'

class DeleteUserModal extends Component {
  handleClick() {
    this.props.deleteUser(this.props.selectedUser)
  } 
  
  render() {
    return (
      <div id="modal-form" ref="modal_form" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body text-left">
              <div className="row">
                <div className="col-sm-12"><h3 className="m-t-none m-b">Delete Account</h3>
                  <p>All the records associated with this user will be deleted as well. This action is irreversible.
                  <br /><br /><b>Do you really want to delete this user?</b></p>
                  <br />
                </div>
                <div className="col-sm-12 text-right">
                  <button className="btn btn-default btn-margin" data-dismiss="modal">
                    <strong>Cancel</strong>
                  </button>
                  {this.props.selectedUser ? (
                    <button className="btn btn-danger btn-margin" onClick={this.handleClick.bind(this)}>
                      <strong>Delete</strong>
                    </button>) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DeleteUserModal.propTypes = {
  selectedUser: PropTypes.object,
  deleteUser: PropTypes.func.isRequired
}

export default DeleteUserModal
