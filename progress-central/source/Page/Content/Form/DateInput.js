/**
 * Created by andrewjjung on 2016-05-22.
 */

import React from 'react'
import jQuery from 'jquery'
import moment from 'moment'
import Formsy, {Mixin} from 'formsy-react'

Formsy.addValidationRule('isDate', function(values, value) {
  return moment(value, 'MM/DD/YYYY', true).isValid()
})

const DateInput = React.createClass({
  mixins: [Mixin],

  componentDidMount() {
    jQuery(document).ready(() => {
      $(this.refs.dateInput).datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
      })
      .on('changeDate', (e) => {
        this.setValue(moment(e.date).format('MM/DD/YYYY'))
      });
    })
  },

  changeValue(event) {
    this.setValue(event.currentTarget.value)
  },

  render() {
    const error = (this.showRequired() || this.showError())
    let className = "form-control"
    let errorLabel
    if (error) {
      className += " error"
      const errorMessage = (this.getErrorMessage() || "This field is required")
      errorLabel = (
        <label className="error">{errorMessage}</label>
      )
    }

    return (
      <div>
        <div ref="dateInput" className="input-group date">
          <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
          <input type="text" className={className} value={this.getValue()} onChange={this.changeValue} 
          disabled={this.props.disabled} />
        </div>
        {errorLabel}
      </div>
    )
  }
})

export default DateInput
