import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import UserList from './RegisteredUserListComponents/UserList'
import UserProfileBox from './RegisteredUserListComponents/UserProfileBox'


class RegisteredInstructorList extends Component {
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

  _userListOnClickHandler(user) {
    return (event) => {
      this.setState({selectedUser: user})
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-7">
          <UserList users={this.props.users} listTitle="Registered Instructors"
                    titleBarLink={(<Link to={`/course/${this.props.course._id}/register/instructor`}
                      className="btn btn-primary">Register Instructor</Link>)}
                    _onClickHandler={this._userListOnClickHandler.bind(this)}
                    listNoDefaultMessage="No instructor is currently registered for this course" />
        </div>
        <div className="col-sm-5">
          <UserProfileBox selectedUser={this.state.selectedUser} boxTitle="Instructor Profile"
                          boxNoDefaultMessage="Click a instructor to view profile"/>
        </div>
      </div>
    )
  }
}

export default RegisteredInstructorList
