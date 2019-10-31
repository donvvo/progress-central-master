import React, {Component} from 'react'
import Formsy from 'formsy-react';

import InputField from '../Form/InputField.js'

class AddCourseForm extends Component {
  sendToServer() {
    console.log('send')
  }

  render() {
    return (
      <Formsy.Form onValidSubmit={this.sendToServer}>
        <div className="form-group"><label>Course Name</label>
          <InputField type="text" name="name" required/>
        </div>
        <div>
          <button className="btn btn-sm btn-primary pull-right m-t-n-xs" type="submit"><strong>Add</strong></button>
        </div>
      </Formsy.Form>
    );
  }
}

export default AddCourseForm
