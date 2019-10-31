import React, {Component} from 'react'

import UserActions from '../actions/UserActions'

import Header from './Header.js'
import UserListBox from './Content/User/UserListBox'

class UserList extends Component {
  constructor(props) {
    super(props)
    
    this.state = { 
      users: []
    }
  }

  componentWillMount() {
    UserActions.getAllUsers((users) => {
      this.setState({
        users: users
      })
    })
  }
  
  deleteUser(user) {
    UserActions.deleteUser(user, (user) => {
      let filteredUsers = this.state.users.filter((userElement) => {
        return user._id !== userElement._id
      })
      this.setState({
        users: filteredUsers
      })
      $('#modal-form').modal('hide')
    })
  }
  
  inviteUser(email) {
    UserActions.inviteUser(email, (user) => {
      let newUsers = this.state.users.slice()
      newUsers.push(user)
      this.setState({
        users: newUsers
      })
      $('#modal-invite').modal('hide')
    }) 
  }

  render() {
    let users = this.state.users
    
    return ( 
      <div>
        <Header name='Manage Users'/>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
                <UserListBox users={users} deleteUser={this.deleteUser.bind(this)} 
                             inviteUser={this.inviteUser.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserList
