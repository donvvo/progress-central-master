/**
 * Created by andrewjjung on 2016-06-01.
 */

import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import {Link} from 'react-router'

import ErrorActions from '~/source/actions/ErrorActions'

class NavNotificationRow extends Component {
  calcTimestamp(timestamp) {
    try {
      return moment(timestamp).fromNow()
    }
    catch (e) {
      ErrorActions.setError(e) 
    }
  }

  render() {
    return (
      <li>
        <Link to="/notifications">
          <div>
            <i className="fa fa-envelope fa-fw" />{this.props.notification.title}
            <span className="pull-right text-muted small">{this.calcTimestamp(this.props.notification.timestamp)}</span>
          </div>
        </Link>
      </li>
      )
  }
}

NavNotificationRow.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    timestamp: PropTypes.string
  }).isRequired
}

export default NavNotificationRow
