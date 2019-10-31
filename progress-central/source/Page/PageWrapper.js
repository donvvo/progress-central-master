import React, {Component, PropTypes} from 'react'
import Loader from 'react-loader'

import LoadingStore from '../stores/LoadingStore'

import Navbar from './Navbar.js'
import NavNotification from './Content/Notification/NavNotification'

class PageWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: LoadingStore.getLoadingStatus()
    }
  }

  getLoadingStatus() {
    this.setState({
      loading: LoadingStore.getLoadingStatus()
    })
  }

  componentWillMount() {
    LoadingStore.addChangeListener(this.getLoadingStatus.bind(this))
  }

  componentWillUnmount() {
    LoadingStore.removeChangeListener(this.getLoadingStatus.bind(this))
  }

  render() {
    return (
      <div>
        <Navbar />
        <div id="page-wrapper" className="gray-bg">
          <div className="row border-bottom">
            <nav className="navbar navbar-static-top white-bg" role="navigation" style={{marginBottom: 0}}>
              <div className="navbar-header">
                <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i className="fa fa-bars"></i> </a>

              </div>
              <ul className="nav navbar-top-links navbar-right">
                <NavNotification notifications={this.props.user.notifications || []} /> 
                <li>
                  <a href="/logout"><i className="fa fa-sign-out"></i>Log out</a>
                </li>
              </ul>
            </nav>
          </div>

          {this.props.component}
          
          <div className="footer">

            <div>
              <strong>Copyright</strong> Progress Bound &copy; 2016
            </div>
          </div>
        </div>
        
        <Loader loaded={!this.state.loading}>
        </Loader>
      </div>
    )
  }
}

PageWrapper.propTypes = {
  user: PropTypes.object.isRequired
}

export default PageWrapper
