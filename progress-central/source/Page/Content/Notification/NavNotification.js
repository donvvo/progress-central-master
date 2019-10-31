/**
 * Created by andrewjjung on 2016-06-01.
 */

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import ErrorActions from '~/source/actions/ErrorActions'

import NavNotificationRow from './NavNotificationRow'

class NavNotification extends Component {
  convertNotificationsToComponents(notifications) {
    let components = []
    for (let i = 0; i < notifications.length; i++) {
      let notification = notifications[i]
      components.push((
        <NavNotificationRow key={notification._id} notification={notification} />
      ))
      components.push((
        <li key={i} className="divider" />
      ))
    }

    return components
  }

  getNotificationsList(notifications) {
    let components = []

    if (notifications.length == 0) {
      components.push((
        <li key={0}>
          <div className="text-center">
            <span className="text-muted small">No new messages</span>
          </div>
        </li>
      ))
      components.push((
        <li key={1} className="divider" />
      ))
    }
    else {
      // Use only the 3 most recent notifications
      components = this.convertNotificationsToComponents(notifications.slice(-3).reverse())
    }
    
    components.push((
      <li key="last">
        <div className="text-center link-block">
          <Link to="/notifications">
            <strong>See All Notifications</strong>
            <i className="fa fa-angle-right" style={{marginLeft: '5px'}} />
          </Link>
        </div>
      </li> 
    )) 
    
    return components
  }

  getUnreadNotifications(notifications) {
    return notifications.filter((notification) => {
      return notification.read === false
    })
  }

  render() {
    let unreadNotifications, notificationsList, numNotifications
    
    try {
      unreadNotifications = this.getUnreadNotifications(this.props.notifications)
      notificationsList = this.getNotificationsList(unreadNotifications)

      // Unread notification number should not show at zero
      numNotifications = unreadNotifications.length || ""
    }
    catch (e) {
      ErrorActions.setError(e)
    }
    
    return (
      <li className="dropdown">
        <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#" aria-expanded="true">
          <i className="fa fa-bell" /><span className="label label-primary">{numNotifications}</span>
        </a>
        <ul className="dropdown-menu dropdown-alerts">
          {notificationsList}
        </ul>
      </li>
    )
  }
}

NavNotification.propTypes = {
  notifications: PropTypes.array.isRequired
}

export default NavNotification
