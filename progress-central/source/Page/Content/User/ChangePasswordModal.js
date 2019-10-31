import React, {Component, PropTypes} from 'react'
import Formsy from 'formsy-react'

import UserActions from '../../../actions/UserActions'

import PasswordInput from '../Form/PasswordInput'

Formsy.addValidationRule('validPassword', function(values, value) {
  return value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
})
Formsy.addValidationRule('confirmPassword', function(values, value) {
  return values.password === value
})

class ChangePasswordModal extends Component {
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
    UserActions.changeUserPassword(this.props.user, form.password, () => {
      $(this.refs.modal_form).modal('hide') 
    })
  }

  render() {
    return (
      <div id="modal-form" ref="modal_form" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body text-left">
              <div className="row">
                <div className="col-sm-12"><h3 className="m-t-none m-b">Change Password</h3>
                  <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)}
                               onInvalid={this.disableButton.bind(this)}>
                    <div className="form-group">
                      <label htmlFor="password">New Password</label>
                      <PasswordInput name="password" validations={{validPassword: true}} required value="" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirm-password">Confirm Password</label>
                      <PasswordInput name="confirm_password" validations={{confirmPassword: true}} required value="" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>
                      <strong>Change Password</strong>
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

ChangePasswordModal.propTypes = {
  user: PropTypes.object.isRequired
}

export default ChangePasswordModal
