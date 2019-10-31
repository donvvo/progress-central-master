import React, {Component, PropTypes} from 'react'

import Formsy from 'formsy-react'

import EmailInput from '../Form/EmailInput'

class InviteUserModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false,
    }
  }

  enableButton() {
    this.setState({
      canSubmit: true
    })
  }

  disableButton() {
    this.setState({
      canSubmit: false
    })
  } 
  
  submit(form) {
    this.props.inviteUser(form.email)
  }
  
  render() {
    return (
      <div id="modal-invite" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body text-left">
              <div className="row">
                <div className="col-sm-12"><h3 className="m-t-none m-b">Invite User</h3>
                  <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)}
                               onInvalid={this.disableButton.bind(this)}>
                    <p>Please enter an email of a user you wish to invite.</p>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <EmailInput name="email" required value="" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>
                      <strong>Invite</strong>
                    </button>
                  </Formsy.Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

InviteUserModal.propTypes = {
  inviteUser: PropTypes.func.isRequired
}

export default InviteUserModal
