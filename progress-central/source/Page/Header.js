import React, {Component, PropTypes} from 'react'

class Header extends Component {
  render() {
    return (
      <div className="row wrapper border-bottom white-bg page-heading">
        <div className="col-sm-12">
          <h2>{this.props.name}</h2>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  name: PropTypes.string.isRequired
}

export default Header
