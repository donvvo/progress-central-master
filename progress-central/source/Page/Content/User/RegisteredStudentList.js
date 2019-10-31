import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import UserList from './RegisteredUserListComponents/UserList'
import UserProfileBox from './RegisteredUserListComponents/UserProfileBox'


class RegisteredStudentList extends Component {
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
          <UserList users={this.props.users} listTitle="Registered Students"
                    titleBarLink={(<Link to={`/course/${this.props.course._id}/register`}
                      className="btn btn-primary">Register Student</Link>)}
                    _onClickHandler={this._userListOnClickHandler.bind(this)}
                    listNoDefaultMessage="No student is currently registered for this course" />
        </div>
        <div className="col-sm-5">
          <UserProfileBox selectedUser={this.state.selectedUser} boxTitle="Student Profile"
                          boxNoDefaultMessage="Click a student to view profile"
                          courseProgressBarDisplay={true} course={this.props.course} />
        </div>
      </div>
    )
  }
}

export default RegisteredStudentList
