import React, {Component, PropTypes} from 'react'


class DashboardInfoBox extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <span className={`label ${this.props.labelClass} pull-right`}>{this.props.labelTitle}</span>
          <h5>{this.props.boxTitle}</h5>
        </div>
        <div className="ibox-content">
          <h1 className="no-margins">{this.props.boxContent}</h1>
          <small>{this.props.boxSmallCaption}</small>
        </div>
      </div>
    )
  }
}

DashboardInfoBox.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelClass: PropTypes.string.isRequired,
  boxTitle: PropTypes.string.isRequired,
  boxContent: PropTypes.string.isRequired,
  boxSmallCaption: PropTypes.string.isRequired
}

export default DashboardInfoBox
