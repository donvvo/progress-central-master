import React, {Component} from 'react'
import {Link} from 'react-router'

import UserStore from '../stores/UserStore'

class Navbar extends Component {
  constructor() {
    super()
    this.state = {
      user: UserStore.getUser()
    }
  }

  getUser() {
    this.setState({
      user: UserStore.getUser()
    })
  }

  componentWillMount() {
    UserStore.addChangeListener(this.getUser.bind(this))
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.getUser.bind(this))
  }
  
  render() {
    let user = this.state.user

    let userListLink
    if (user.user_type === 'ADMIN') {
      userListLink = (
        <li>
          <Link to="/user-list"><i className="fa fa-group" /> <span className="nav-label">User Management</span></Link>
        </li>
      )
    }
    
    return (
      <nav className="navbar-default navbar-static-side" style={{position: 'fixed'}} role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <div className="dropdown profile-element"> <span>
                  <img alt="image" className="img-circle profile-thumbnail" src={user.profile_photo} />
                </span>
                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                  <span className="clear"> <span className="block m-t-xs"> <strong className="font-bold">{user.first_name} {user.last_name}</strong>
                </span> <span className="text-muted text-xs block">{user.user_type} <b className="caret"></b></span> </span> </a>
                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li><Link to={"/user/profile"}>Profile</Link></li>
                  <li className="divider" />
                  <li><Link to={"/notifications"}>Notifications</Link></li>
                  <li className="divider" />
                  <li><a href="/logout">Logout</a></li>
                </ul>
              </div>
              <div className="logo-element">
                PC
              </div>
            </li>
            <li>
              <Link to="/"><i className="fa fa-bank" /> <span className="nav-label">Home</span></Link>
            </li>
            <li>
              <Link to="/courses"><i className="fa fa-graduation-cap" /> <span className="nav-label">Courses</span></Link>
            </li>
            {userListLink}
            <li>
              <Link to="/about-us"><i className="fa fa-desktop" /> <span className="nav-label">About Us</span></Link>
            </li>
            <li>
              <Link to="/help"><i className="fa fa-question-circle" /> <span className="nav-label">Help</span></Link>
            </li>
            <li className="special_link">
              <a href="http://progressbound.com/" target="_blank">
                <i className="fa fa-globe"></i> <span className="nav-label">Progress Bound</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Navbar
