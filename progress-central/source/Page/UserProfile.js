/**
 * Created by andrewjjung on 2016-05-19.
 *
 * User profile view
 */

import React, {Component} from 'react'

import UserStore from '../stores/UserStore'

import Header from './Header.js'
import UserProfileBox from './Content/User/UserProfileBox.js'

class UserProfile extends Component {
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
    let breadcrumb = [{ name: 'Home', url: '/'}, { name: 'Profile' }]
    return (
      <div>
        <Header name="Profile" breadcrumb={breadcrumb}/>
        <div className="wrapper wrapper-content">
          <div className="row animated fadeInRight">
            <div className="col-md-5">
              <UserProfileBox user={this.state.user} /> 
            </div>
            <div className="col-md-7">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Activites</h5>
                </div>
                <div className="ibox-content">

                  <div>
                    <div className="feed-activity-list">
                      <div className="feed-element">
                        <a href="#" className="pull-left">
                          <img alt="image" className="img-circle" src="/img/profile.jpg" />
                        </a>
                        <div className="media-body ">
                          <strong>Instructor</strong> published a new lecture for <strong>Healthbound</strong> course. <br />
                          <small className="text-muted">month ago 5:30 pm - 12.08.2016</small>

                        </div>
                      </div>

                      <div className="feed-element">
                        <a href="#" className="pull-left">
                          <img alt="image" className="img-circle" src="/img/profile.jpg" />
                        </a>
                        <div className="media-body ">
                          <strong>Instructor</strong> changed course end date for <strong>Healthbound</strong> course. <br />
                          <small className="text-muted">month ago 2:10 pm - 5.08.2016</small>
                        </div>
                      </div>
                      <div className="feed-element">
                        <a href="#" className="pull-left">
                          <img alt="image" className="img-circle" src="/img/a7.jpg" />
                        </a>
                        <div className="media-body ">
                          <strong>Admin</strong> added you to <strong>Healthbound</strong> course. <br />
                          <small className="text-muted">month ago 4:30 pm - 2.08.2016</small>
                        </div>
                      </div>
                      <div className="feed-element">
                        <a href="#" className="pull-left">
                          <img alt="image" className="img-circle" src="/img/a7.jpg" />
                        </a>
                        <div className="media-body ">
                          Your course <strong>Progress Central Tutorial</strong> has started. <br />
                          <small className="text-muted">month ago 10:30 am - 18.07.2016</small>
                        </div>
                      </div>
                      <div className="feed-element">
                        <a href="#" className="pull-left">
                          <img alt="image" className="img-circle" src="/img/a7.jpg" />
                        </a>
                        <div className="media-body ">
                          <strong>Admin</strong> added you to <strong>Progress Central Tutorial</strong> course. <br />
                          <small className="text-muted">month ago 4:30 pm - 16.07.2016</small>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserProfile
