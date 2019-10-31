/**
 * Created by andrewjjung on 2016-05-19.
 *
 * User profile box
 */

import React, {Component} from 'react'
import {Link} from 'react-router'

import ChangePasswordModal from './ChangePasswordModal'

class UserProfileBox extends Component {
  render() {
    let user = this.props.user

    let description = user.description ? user.description : 'No description provided'

    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h5>Profile Detail</h5>
          <div className="ibox-tools">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
              <i className="fa fa-wrench"></i>
            </a>
            <ul className="dropdown-menu dropdown-user">
              <li><Link to={"/user/profile/edit"}>Edit</Link>
              </li>
              <li><a data-toggle="modal" href="#modal-form">Change Password</a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="ibox-content no-padding border-left-right">
            <img alt="image" className="img-responsive" style={{width: '100%'}} src={user.profile_photo} />
          </div>
          <div className="ibox-content profile-content">
            <h4><strong>{user.first_name + ' ' + user.last_name}</strong></h4>
            <p>{user.user_type}</p>
            <h5>
              Email
            </h5>
            <p>
              {user.email}
            </p>
            <h5>
              About me
            </h5>
            <p>
              {description}
            </p>
          </div>
        </div>
        <ChangePasswordModal user={this.props.user} />
      </div>
    )
  }
}

export default UserProfileBox
