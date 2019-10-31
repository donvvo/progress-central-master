import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import jQuery from 'jquery'

import UserActions from '../../../actions/UserActions'

class EditProfilePhoto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false,
      file: null,
    }
  }
  
  componentDidMount() {
    let self = this
    jQuery(document).ready(function() {
      var $image = $(".image-crop > img")
      $($image).cropper({
        aspectRatio: 1,
        preview: ".img-preview",
        done: function(data) {
          // Output the result data for cropping image.
        }
      });

      var $inputImage = $("#inputImage");
      if (window.FileReader) {
        $inputImage.change(function() {
          var fileReader = new FileReader(),
            files = this.files,
            file;

          if (!files.length) {
            return;
          }

          file = files[0];
          
          self.setState({file: file})

          if (/^image\/\w+$/.test(file.type)) {
            fileReader.readAsDataURL(file);
            fileReader.onload = function () {
              $image.cropper("reset", true).cropper("replace", this.result);
            };
          } else {
            showMessage("Please choose an image file.");
          }
        });
      } else {
        $inputImage.addClass("hide");
      }
    })
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

  handleSubmit() {
    let formData = new FormData()
    let result = $(".image-crop > img").cropper('getData', true);

    formData.append('image', this.state.file)
    formData.append('width', result.width)
    formData.append('height', result.height)
    formData.append('x_coord', result.x)
    formData.append('y_coord', result.y)

    UserActions.editUserProfilePhoto(this.props.user, formData, () => {
      $(this.refs.modal_form).modal('hide') 
    })
  }

  render() {
    return (
      <div id="modal-form" ref="modal_form" className="modal fade" aria-hidden="true">
        <div className="modal-dialog" style={{width: '90%'}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h3 className="modal-title">Edit Profile Photo</h3>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="image-crop">
                    <img src={this.props.user.profile_photo} />
                  </div>
                  <br/>
                  <br/>
                </div>
                <div className="col-md-6">
                  <h4>Preview image</h4>
                  <div className="row">
                    <div className="col-sm-6 text-center">
                      <div className="img-preview img-preview-square"></div>
                      <p>Main Profile Picture</p>
                    </div>
                    <div className="col-sm-6 text-center">
                      <div className="img-preview img-preview-circle"></div>
                      <p>Profile Thumbnail</p>
                    </div>
                  </div>
                  <br/>
                  <br/>
                  <div className="row">
                    <div className="col-sm-12 text-right">
                      <div className="btn-group">
                        <label title="Upload image file" for="inputImage" className="btn btn-primary">
                          <input type="file" accept="image/*" name="file" id="inputImage" className="hide" />
                          Upload new image
                        </label>
                      </div>
                      <button style={{marginLeft: '10px'}} onClick={this.handleSubmit.bind(this)}
                      className="btn btn-primary" disabled={!this.state.file}>
                        <strong>Submit</strong>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EditProfilePhoto
