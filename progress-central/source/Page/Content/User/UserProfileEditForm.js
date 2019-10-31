/**
 * Created by andrewjjung on 2016-05-20.
 *
 * Form to edit user profile
 */

import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import Formsy from 'formsy-react'

import UserActions from '../../../actions/UserActions'

import TextInput from '../Form/TextInput.js'
import TextAreaInput from '../Form/TextAreaInput.js'

class UserProfileEditForm extends Component {
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
    var user = {
      _id: this.props.user._id,
      first_name: form.first_name,
      last_name: form.last_name,
      description: form.description
    }
    UserActions.editUserProfile(user, () => {
      var url = '/user/profile/'
      browserHistory.push(url)
    })
  }

  render() {
    let user = this.props.user

    return (
      <div>
        <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)} 
                     onInvalid={this.disableButton.bind(this)}>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <TextInput name="first_name" required value={user.first_name || ""} />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <TextInput name="last_name" required value={user.last_name || ""} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="description">About me</label>
                <TextAreaInput name="description" rows="10" value={user.description || ""} />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>
            <strong>Save</strong>
          </button>
        </Formsy.Form>
      </div>
    )
  }
}

export default UserProfileEditForm
