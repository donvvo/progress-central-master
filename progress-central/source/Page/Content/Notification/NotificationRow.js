/**
 * Created by andrewjjung on 2016-06-01.
 */

import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import {Link} from 'react-router'

import ErrorActions from '~/source/actions/ErrorActions'
import UserActions from '~/source/actions/UserActions'

class NotificationRow extends Component {
  calcTimestamp(timestamp) {
    try {
      return moment(timestamp).fromNow()
    }
    catch (e) {
      ErrorActions.setError(e) 
    }
  }
  
  clickHandler() {
    if (!this.props.notification.read) {
      UserActions.readNotification(this.props.notification._id)
    } 
  }

  render() {
    return (
      <div className={"feed-element" + (!this.props.notification.read ? " notification-unread" : "")}>
        <div className="media-body">
          <div className="panel-heading">
            <strong className="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" aria-expanded="false" className="collapsed"
                 href={`#${this.props.notification._id}`} onClick={this.clickHandler.bind(this)}>
                {this.props.notification.title}</a>
            </strong>
            <small className="pull-right text-navy">{this.calcTimestamp(this.props.notification.timestamp)}</small>
          </div>
          <div id={this.props.notification._id} className="panel-collapse collapse" aria-expanded="false" style={{height: '0px'}}>
            <div className="panel-body">
              {this.props.notification.content}
            </div>
          </div>
        </div>
      </div>
      )
  }
}

NotificationRow.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    timestamp: PropTypes.string
  }).isRequired
}

export default NotificationRow
