import React, {Component, PropTypes} from 'react'

import SmallUserProfileBox from './SmallUserProfileBox'
import DeleteUserModal from './DeleteUserModal'
import InviteUserModal from './InviteUserModal'

class UserListBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedUser: (this.props.users.length > 0) ? this.props.users[0] : null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users.length > 0) {
      this.setState({selectedUser: nextProps.users[0]})
    }
  }

  componentDidMount() {
    $('.full-height-scroll').slimscroll({
      height: '100%'
    })
  }
  
  getUserList(users) {
    if (users.length > 0) {
      return users.map((user) => {
        return (
          <tr key={user._id}>
            <td className="client-avatar"><img alt="image" src={user.profile_photo}/> </td>
            <td><a onClick={(event) => {
              this.setState({selectedUser: user})
            }} className="client-link">
              {user.first_name + ' ' + user.last_name}
            </a></td>
            <td className="contact-type"><i className="fa fa-envelope"> </i></td>
            <td>{user.email}</td>
            {(user.status === 'ACTIVE') ? 
              (<td className="client-status"><span className="label label-primary">Active</span></td>)
                : (<td className="client-status"><span className="label label-default">Inactive</span></td>)}
          </tr>
        )
      })
    }
    else {
      return (
        <tr>
          <td className="text-center">
            <p>No user is currently registered</p>
          </td>
        </tr>
      )
    } 
  }

  getSelectedUserDeleteButton(selectedUser) {
    if (selectedUser) {
      return (
        <div className="ibox-tools">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#">
            <i className="fa fa-wrench"></i>
          </a>
          <ul className="dropdown-menu dropdown-user">
            <li><a data-toggle="modal" href="#modal-form">Delete</a>
            </li>
          </ul>
        </div>
      )
    } 
    else {
      return null
    }
  }

  render() {
    let users = this.props.users
    let userList = this.getUserList(users)
    let selectedUserDeleteButton  = this.getSelectedUserDeleteButton(this.state.selectedUser)
    
    return (
      <div className="row">
        <div className="col-sm-7">
          <div className="ibox">
            <div className="ibox-title">
              <h5>Registered Users</h5>
              <div className="text-right">
                <a className="btn btn-primary" data-toggle="modal" href="#modal-invite">Invite User</a>
              </div> 
            </div>
            <div className="ibox-content">
              <div className="clients-list">
                <div className="tab-content">
                  <div id="tab-1" className="tab-pane active">
                    <div className="full-height-scroll">
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <tbody>
                          {userList}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <div className="ibox">
            <div className="ibox-title">
              <h5>User Profile</h5>
              {selectedUserDeleteButton}
            </div>
            <SmallUserProfileBox selectedUser={this.state.selectedUser}
                                 boxNoDefaultMessage="Click a user to view profile"
                                 courseProgressBarDisplay={false} />
          </div>
        </div>
        <DeleteUserModal selectedUser={this.state.selectedUser} deleteUser={this.props.deleteUser} />
        <InviteUserModal inviteUser={this.props.inviteUser} />
      </div>
    )
  }
}

UserListBox.propTypes = {
  users: PropTypes.array.isRequired,
  deleteUser: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired
}

export default UserListBox
