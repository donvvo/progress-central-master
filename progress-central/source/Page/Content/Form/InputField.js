import React, {Component} from 'react'
import jQuery from 'jquery'

class TextInput extends Component {
  render() {
    let errorLabel = null
    let inputClassName = "form-control"
    if (this.props.error) {
      errorLabel = (
        <label className="error" for={this.props.name} style={{display: "inline-block"}}>{this.props.error.msg}</label>
      )
      inputClassName = inputClassName + ' error'
    }
    return (
      <div className="form-group"><label>{this.props.label}</label>
        <input type="text" placeholder={this.props.placeholder} className={inputClassName} name={this.props.name} required />
        {errorLabel}
      </div>
    )
  }
} 

class UrlInput extends Component {
  render() {
    let errorLabel = null
    let inputClassName = "form-control"
    if (this.props.error) {
      errorLabel = (
        <label className="error" for={this.props.name} style={{display: "inline-block"}}>{this.props.error.msg}</label>
      )
      inputClassName = inputClassName + ' error'
    }
    return (
      <div className="form-group"><label>{this.props.label}</label>
        <input type="url" placeholder={this.props.placeholder} className={inputClassName} name={this.props.name} />
        {errorLabel}
      </div>
    )
  }
}

class DateInput extends Component {
  componentDidMount() {
    let selector = '#' + this.props.id + ' .input-group.date'
    jQuery(document).ready(function() {
      $(selector).datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
      });
    })
  }

  render() {
    let errorLabel = null
    let inputClassName = "form-control"
    if (this.props.error) {
      errorLabel = (
        <label className="error" for={this.props.name} style={{display: "inline-block"}}>{this.props.error.msg}</label>
      )
      inputClassName = inputClassName + ' error'
    }
    return (
      <div className="form-group" id={this.props.id}><label>{this.props.label}</label>
        <div className="input-group date">
          <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
          <input type="text" className={inputClassName} name={this.props.name} required />
          {errorLabel}
        </div>
      </div>
    )
  }
}

export {TextInput, UrlInput, DateInput}
