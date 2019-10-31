/**
 * Created by andrewjjung on 2016-05-20.
 *
 * Text area input using formsy-react
 */

import React from 'react'
import {Mixin} from 'formsy-react'

const TextAreaInput = React.createClass({
  mixins: [Mixin],

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
        <textarea className={className} rows={this.props.rows} onChange={this.changeValue} value={this.getValue()} />
        {errorLabel}
      </div>
    )
  }
})

export default TextAreaInput
