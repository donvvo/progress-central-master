import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'


class UserList extends Component {
  componentDidMount() {
    $('.full-height-scroll').slimscroll({
      height: '100%'
    })
  }

  render() {
    let users = this.props.users

    let userList
    if (users.length > 0) {
      userList = users.map((user) => {
        return (
          <tr key={user._id}>
            <td className="client-avatar"><img alt="image" src={user.profile_photo}/> </td>
            <td><a onClick={this.props._onClickHandler(user)} className="client-link">
              {user.first_name + ' ' + user.last_name}
            </a></td>
            <td className="contact-type"><i className="fa fa-envelope"> </i></td>
            <td>{user.email}</td>
          </tr>
        )
      })
    }
    else {
      userList = (
        <tr>
          <td>
            <p style={{textAlign: 'center', margin: 0}}>{this.props.listNoDefaultMessage}</p>
          </td>
        </tr>
      )
    }

    return (
      <div className="ibox">
        <div className="ibox-title">
          <h5>{this.props.listTitle}</h5>
          <div className="text-right">
            {this.props.titleBarLink}
          </div>
        </div>
        <div className="ibox-content">
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
    )
  }
}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  listTitle: PropTypes.string.isRequired,
  listNoDefaultMessage: PropTypes.string.isRequired,
  titleBarLink: PropTypes.object,
  _onClickHandler: PropTypes.func.isRequired
}

export default UserList
