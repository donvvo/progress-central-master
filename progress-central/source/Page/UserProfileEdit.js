/**
 * Created by andrewjjung on 2016-05-19.
 *
 * User profile view
 */

import React, {Component} from 'react'

import UserStore from '../stores/UserStore'

import Header from './Header.js'
import UserProfileEditForm from './Content/User/UserProfileEditForm.js'
import EditProfilePhoto from './Content/User/EditProfilePhoto'

class UserProfileEdit extends Component {
  constructor(props) {
    super(props)
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
    let breadcrumb = [{ name: 'Home', url: '/'}, { name: 'Profile Edit' }]
    let user = this.state.user
    let description = user.description ? user.description : 'No description provided'
    
    return (
      <div>
        <Header name="Profile Edit" breadcrumb={breadcrumb}/>
        <div className="wrapper wrapper-content">
          <div className="row animated fadeInRight">
            <div className="col-md-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Profile Edit</h5>
                </div>
                <div>
                  <div className="ibox-content border-left-right">
                    <div className="row">
                      <div className="col-sm-4">
                        <img alt="image" className="img-responsive" src={user.profile_photo} />
                        <div className="text-center">
                          <a style={{marginTop: '10px'}} data-toggle="modal" className="btn btn-primary" 
                             href="#modal-form">Edit Profile Photo</a>
                          <EditProfilePhoto user={user} />
                        </div>
                      </div>
                      <div className="col-sm-8 profile-content">
                        <UserProfileEditForm user={user} />
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

export default UserProfileEdit
