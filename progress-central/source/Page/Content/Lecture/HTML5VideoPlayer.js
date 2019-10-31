import React, {Component, PropTypes} from 'react'

class HTML5VideoPlayer extends Component {
  /**
   * 'src' property must be a valid url to a MP4 video file.
   * @returns {XML}
   */
  constructor(props) {
    super(props) 
    
    this.defaultWidth = 450
  }

  getStyle(props) {
    if (props.width) {
      return {
        width: `${props.width}px`,
        height: "auto"
      }
    }
    else if (props.height) {
      return {
        width: "auto",
        height: `${props.height}px`
      }
    }
    else {
      return {
        width: `${this.defaultWidth}px`,
        height: "auto"
      }
    }
  }
  render() {
    let style = this.getStyle(this.props)
    
    return (
      <video style={style} controls>
        <source src={this.props.src} type="video/mp4" />
        <source src={this.props.src} type="video/mov" />
      </video>
    )
  }
}

HTML5VideoPlayer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  src: PropTypes.string.isRequired
}

export default HTML5VideoPlayer
