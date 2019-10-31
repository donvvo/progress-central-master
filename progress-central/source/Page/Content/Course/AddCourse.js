import React, {Component} from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
import Formsy from 'formsy-react'

import CourseActions from '../../../actions/CourseActions'

import TextInput from '../Form/TextInput'
import DateInput from '../Form/DateInput'
import TextAreaInput from '../Form/TextAreaInput'

Formsy.addValidationRule('isEndLater', function(values, value) {
  return moment(values.course_start, 'MM/DD/YYYY').isBefore(value)
})
Formsy.addValidationRule('isLaterThanToday', function(values, value) {
  return moment().isBefore(value)
})

class AddCourse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false,
    }
  }
  /*componentDidMount() {
    let self = this
    jQuery(document).ready(function() {
      $('#add-course-form').submit(function(e) {
        e.preventDefault()
      }).validate({
        submitHandler: function(form) {
          var $form = $(form)
          var name = $form.find('input[name=name]').val()
          var course_start = $form.find('input[name=course_start]').val()
          var course_end = $form.find('input[name=course_end]').val()

          $.ajax({
            url: '/api/course/new',
            dataType: 'json',
            type: 'POST',
            data: { name: name, course_start: course_start, course_end: course_end },
            success: function(data) {
              if (data.msg === 'error') {
                var error = self.state.error          
                error.name = data.name
                error.course_start = data.course_start
                error.course_end = data.course_end

                self.setState({error: error})
              }
              else {
                $('#modal-form').modal('hide')
                var url = '/course/' + data.course._id
                browserHistory.push(url)
              }
            },
            error: function(xhr, status, err) {
              console.error('/course/add', status, err.toString())
            }
          })
        }
      })
    }) 
  }*/

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
      name: form.name,
      description: form.description,
      course_start: form.course_start,
      course_end: form.course_end
    }
    CourseActions.addCourse(course, (result) => {
      $(this.refs.modal_form).modal('hide')
      browserHistory.push(`/course/${result._id}`)
    })
  }

  render() {

    return (
      <div id="modal-form" ref="modal_form" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-12"><h3 className="m-t-none m-b">Add Course</h3>
                  <Formsy.Form onValidSubmit={this.submit.bind(this)} onValid={this.enableButton.bind(this)}
                               onInvalid={this.disableButton.bind(this)}>
                    <div className="form-group">
                      <label htmlFor="name">Course Name</label>
                      <TextInput name="name" required value="" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="course_start">Course Start Date</label>
                      <DateInput name="course_start" validations={{isDate: true, isLaterThanToday: true}}
                                 validationErrors={{isDate: "Invalid date",
                                 isLaterThanToday: "Start date must be later than today's date"}} required value="" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="course_end">Course End Date</label>
                      <DateInput name="course_end" validations={{isDate: true, isEndLater: true}}
                                 validationErrors={{
                                 isDate: "Invalid date", isEndLater: "End date must be later than start date"
                                 }} required value="" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Course Description</label>
                      <TextAreaInput name="description" rows="5" value="" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>
                      <strong>Add</strong>
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
