import React, {Component} from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
import Formsy from 'formsy-react'

import CourseActions from '../../../actions/CourseActions'

import TextInput from '../Form/TextInput'
import DateInput from '../Form/DateInput'
import TextAreaInput from '../Form/TextAreaInput'
import InlineRadioInput from '../Form/InlineRadioInput'

Formsy.addValidationRule('isEndLater', function(values, value) {
  return moment(values.course_start, 'MM/DD/YYYY').isBefore(value)
})
Formsy.addValidationRule('isLaterThanToday', function(values, value) {
  return moment().isBefore(value)
})

class AddCourse extends Component {
  constructor(props) {
    super(props)

    this.dateFormat = "MM/DD/YYYY"

    this.state = {
      canSubmit: false,
    }
  }

  enableButton() {
    this.setState({
      canSubmit: true
    })
  }

  disableButton() {
    this.setState({
      canSubmit: false
    })
  }

  submit(form) {
    var course = {
      _id: this.props.course._id,
      name: form.name,
      description: form.description,
      course_start: form.course_start,
      course_end: form.course_end,
      status: form.status
    }
    CourseActions.editCourse(course, (result) => {
      $(this.refs.modal_form).modal('hide')
    })
  }

  render() {
    let course = this.props.course
    
    let courseStarted = moment().isAfter(course.course_start)
    let courseStartDateValidations = `isDate${courseStarted ? '' : ',isLaterThanToday'}`
    
    return (
      <div id="modal-form" ref="modal_form" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body text-left">
              <div className="row">
                <div className="col-sm-12"><h3 className="m-t-none m-b">Edit Course</h3>
                  <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)}
                               onInvalid={this.disableButton.bind(this)}>
                    <div className="form-group">
                      <label htmlFor="name">Course Name</label>
                      <TextInput name="name" required value={course.name || ""} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="course_start">Course Start Date</label>
                      {courseStarted ? <p>Course start date cannot be modified once the course has already started</p> : null}
                      <DateInput name="course_start" validations={courseStartDateValidations}
                                 validationErrors={{isDate: "Invalid date", 
                                 isLaterThanToday: "Start date must be later than today's date"}} required 
                                 value={moment(course.course_start).format(this.dateFormat) || ""}
                                 disabled={courseStarted}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="course_end">Course End Date</label>
                      <DateInput name="course_end" validations={{isDate: true, isEndLater: true}}
                                 validationErrors={{
                                 isDate: "Invalid date", isEndLater: "End date must be later than start date"
                                 }} required value={moment(course.course_end).format(this.dateFormat) || ""} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Course Description</label>
                      <TextAreaInput name="description" rows="5" value={course.description || ""} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>
                      <strong>Edit</strong>
                    </button>
                  </Formsy.Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddCourse
