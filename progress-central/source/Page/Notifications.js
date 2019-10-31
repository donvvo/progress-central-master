/**
 * Created by andrewjjung on 2016-05-19.
 *
 * User profile view
 */

import React, {Component} from 'react'

import UserStore from '../stores/UserStore'

import Header from './Header.js'
import NotificationList from './Content/Notification/NotificationsList'

class Notifications extends Component {
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
    let breadcrumb = [{ name: 'Home', url: '/'}, { name: 'Notifications' }]

    return (
      <div>
        <Header name="Notifications" breadcrumb={breadcrumb}/>
        <div className="wrapper wrapper-content">
          <div className="row animated fadeInRight">
            <div className="col-md-8 col-md-offset-2">
              <NotificationList notifications={this.state.user.notifications || []} /> 
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Notifications
