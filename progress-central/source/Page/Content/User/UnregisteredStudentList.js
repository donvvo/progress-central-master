import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import UserActions from '../../../actions/UserActions'

import UserProfileBox from './RegisteredUserListComponents/UserProfileBox'


class UnregisteredStudentList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedStudent: null,
      checkedStudents: []
    }
  }

  componentDidMount() {
    $('.full-height-scroll').slimscroll({
      height: '100%'
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    
    UserActions.registerStudents(this.props.course, this.state.checkedStudents, () => {
      var url = `/course/${this.props.course._id}`
      browserHistory.push(url)
    })
  }
  
  onChecked(e) {
    if (e.target.checked) {
      var newList = this.state.checkedStudents.slice() 
      newList.push(e.target.value)
      this.setState({checkedStudents: newList})
    }
    else {
      var newList = this.state.checkedStudents.slice()
      this.setState({checkedStudents: newList.filter((element) => {
        return element !== e.target.value
      })})
    }
  }

  render() {
    let students = this.props.students

    let studentList
    if (students.length > 0) {
      studentList = students.map((student) => {
        return (
          <tr key={student._id}>
            <td className="client-avatar"><img alt="image" src={student.profile_photo}/> </td>
            <td><a onClick={(event) => {
              this.setState({selectedStudent: student})
            }} className="client-link">
              {student.first_name + ' ' + student.last_name}
            </a></td>
            <td className="contact-type"><i className="fa fa-envelope"> </i></td>
            <td>{student.email}</td>
            <td><input type="checkbox" name="student" value={student._id} onChange={this.onChecked.bind(this)} /></td>
          </tr>
        )
      })
    }
    else {
      studentList = (
        <tr>
          <td>
            <p>No student is currently registered for this course</p>
          </td>
        </tr>
      )
    }


    return (
      <div className="row">
          <div className="col-sm-7">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Unregistered Students</h5>
                <div className="text-right">
                  <button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Register</button>
                </div>
              </div>
              <div className="ibox-content">
                <p>Click on checkbox of students you want to register for this course</p>
                <div className="clients-list">
                  <div className="tab-content">
                    <div id="tab-1" className="tab-pane active">
                      <div className="full-height-scroll">
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <tbody>
                            {studentList}
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
            <UserProfileBox selectedUser={this.state.selectedStudent} boxTitle="Student Profile"
                            boxNoDefaultMessage="Click a student to view profile" />
          </div>
      </div>
    )
  }
}

export default UnregisteredStudentList
