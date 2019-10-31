import React, {Component} from 'react'

import UserStore from '../stores/UserStore'
import CourseStore from '../stores/CourseStore'

import Header from './Header.js'


class Help extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: UserStore.getUser()
    }

    this.getUser = this.getUser.bind(this)
  }

  getUser() {
    this.setState({
      user: UserStore.getUser()
    })
  }

  componentWillMount() {
    UserStore.addChangeListener(this.getUser)
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.getUser)
  }

  render() {
    let breadcrumb = [{ name: 'Home', url: '/'}]

    var mainContent
    if (this.state.user.user_type !== 'STUDENT') {
      mainContent = (
        <div className="tabs-container">
          <ul className="nav nav-tabs">
            <li className="active"><a data-toggle="tab" href="#tab-1">Add/Edit a Course</a></li>
            <li className=""><a data-toggle="tab" href="#tab-2">Add/Edit a Lecture</a></li>
          </ul>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <div className="panel-body">
                <strong><a href="/creating_editing_course.pdf" target="_blank">Click here to view the manual.</a></strong>

                <p>Our manual explains step by step process to create and edit a course. Please click the link above
                to view our PDF manual.</p>

                <p>If you have any questions, please contact us.</p>
              </div>
            </div>
            <div id="tab-2" className="tab-pane">
              <div className="panel-body">
                <strong><a href="/creating_editing_lecture.pdf" target="_blank">Click here to view the manual.</a></strong>

                <p>Our manual explains step by step process to create and edit a course. Please click the link above
                to view our PDF manual.</p>

                <p>If you have any questions, please contact us.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    else {
      mainContent = (
        <p className="text-center" style={{marginTop: '30px'}}><strong>Current there is no content at the moment.
          If you have any questions about the app, please contact us.</strong></p>
      )
    }

    return (
      <div>
        <Header name={"Help"} breadcrumb={breadcrumb}/>
        <div className="row wrapper wrapper-content white-bg" style={{paddingBottom: '40px'}}>
          <div className="col-md-10 col-md-offset-1">
            <div className="wrapper wrapper-content animated fadeInUp">
              {mainContent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Help
