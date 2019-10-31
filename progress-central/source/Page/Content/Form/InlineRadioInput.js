/**
 * Created by andrewjjung on 2016-05-20.
 *
 * Text input using formsy-react
 */

import React from 'react'
import {Mixin} from 'formsy-react'

const InlineRadioInput = React.createClass({
  mixins: [Mixin],

  changeValue(event) {
    this.setValue(event.target.value)
  },

  render() {
    const error = (this.showRequired() || this.showError())
    let errorLabel
    if (error) {
      const errorMessage = (this.getErrorMessage() || "This field is required")
      errorLabel = (
        <label className="error">{errorMessage}</label>
      )
    }

    let radioInput = this.props.radioInput.map((input, index) => {
      return (
        <label key={index} className="radio-inline">
          <input type="radio" name={this.props.name} value={input} checked={input === this.getValue()} />{input}
        </label>
      )})

    return (
      <div onChange={this.changeValue}>
        {radioInput}
        {errorLabel}
      </div>
    )
  }
})

InlineRadioInput.propTypes = {
  checked: React.PropTypes.string,
  radioInput: React.PropTypes.array.isRequired
}

export default InlineRadioInput
