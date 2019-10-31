/**
 * Created by andrewjjung on 2016-06-01.
 */

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import ErrorActions from '~/source/actions/ErrorActions'

import NotificationRow from './NotificationRow'

class NotificationList extends Component {
  constructor(props) {
    super(props)
    
    this.numberOfNotificationsToDisplay = 10
    this.state = { 
      numDisplayedNotifications: this.numberOfNotificationsToDisplay
    }
  }
  
  getNotificationRows(notifications) {
    if (notifications.length > 0) {
      let displayedNotifications = notifications.slice(0, this.state.numDisplayedNotifications)
      return displayedNotifications.map((notification) => {
        return (
          <NotificationRow key={notification._id} notification={notification} />
        )
      }) 
    }
    else {
      return (
        <div className="feed-element no-notification">
          <div className="media-body text-center">
            <h4>There are no notifications at the moment</h4>
          </div>
        </div>
      )
    }
  }
  
  getMoreButton(notifications) {
    if (notifications.length > this.state.numDisplayedNotifications) {
      return (
        <button className="btn btn-primary btn-block m" onClick={this.handleClick.bind(this)}>
          <i className="fa fa-arrow-down" /> Show More
        </button>
      )
    }
    else {
      return null 
    }
  }

  handleClick() {
    this.setState({
      numDisplayedNotifications: this.state.numDisplayedNotifications + this.numberOfNotificationsToDisplay
    })
  }

  render() {
    let notifications = this.props.notifications
    let notificationRows, moreButton
    
    try {
      notificationRows = this.getNotificationRows(notifications)
      moreButton = this.getMoreButton(notifications) 
    }
    catch (e) {
      ErrorActions.setError(e)
    }
    
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h5>Notifications</h5>
          <br /> <br />
          <p>Click on a notification to read full message. Unread notifications are colored dark gray. Click on an
          unread notification to mark it as read.</p>
        </div>
        <div className="ibox-content">
          <div>
            <div className="feed-activity-list">
              {notificationRows}
            </div>
            {moreButton}
          </div>
        </div>
      </div>
    )
  }
}

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired
}

export default NotificationList
