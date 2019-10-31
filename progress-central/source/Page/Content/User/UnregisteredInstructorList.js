import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import UserActions from '../../../actions/UserActions'

import UserProfileBox from './RegisteredUserListComponents/UserProfileBox'


class UnregisteredInstructorList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedUser: null,
      checkedUser: []
    }
  }

  componentDidMount() {
    $('.full-height-scroll').slimscroll({
      height: '100%'
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    
    UserActions.registerStudents(this.props.course, this.state.checkedUser, () => {
      var url = `/course/${this.props.course._id}`
      browserHistory.push(url)
    })
  }
  
  onChecked(e) {
    if (e.target.checked) {
      var newList = this.state.checkedUser.slice()
      newList.push(e.target.value)
      this.setState({checkedUser: newList})
    }
    else {
      var newList = this.state.checkedUser.slice()
      this.setState({checkedUser: newList.filter((element) => {
        return element !== e.target.value
      })})
    }
  }

  render() {
    let instructors = this.props.instructors

    let userList
    if (instructors.length > 0) {
      userList = instructors.map((instructor) => {
        return (
          <tr key={instructor._id}>
            <td className="client-avatar"><img alt="image" src={instructor.profile_photo}/> </td>
            <td><a onClick={(event) => {
              this.setState({selectedUser: instructor})
            }} className="client-link">
              {instructor.first_name + ' ' + instructor.last_name}
            </a></td>
            <td className="contact-type"><i className="fa fa-envelope"> </i></td>
            <td>{instructor.email}</td>
            <td><input type="checkbox" name="instructor" value={instructor._id} onChange={this.onChecked.bind(this)} /></td>
          </tr>
        )
      })
    }
    else {
      userList = (
        <tr>
          <td>
            <p>No instructor is currently available.</p>
          </td>
        </tr>
      )
    }


    return (
      <div className="row">
          <div className="col-sm-7">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Unregistered Instructors</h5>
                <div className="text-right">
                  <button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Register</button>
                </div>
              </div>
              <div className="ibox-content">
                <p>Click on checkbox of instructors you want to register for this course</p>
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
            <UserProfileBox selectedUser={this.state.selectedUser} boxTitle="Instructor Profile"
                            boxNoDefaultMessage="Click a instructor to view profile" />
          </div>
      </div>
    )
  }
}

export default UnregisteredInstructorList
