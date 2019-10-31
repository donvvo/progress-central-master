import React, {Component} from 'react'

import UserStore from '../stores/UserStore'
import CourseStore from '../stores/CourseStore'

import CourseList from './Content/Course/CourseList.js'
import Header from './Header.js'


class AboutUs extends Component {
  render() {
    let breadcrumb = [{ name: 'Home', url: '/'}]
    return (
      <div>
        <Header name={"About Us"} breadcrumb={breadcrumb}/>
        <div className="row white-bg" style={{maxHeight: '50vh', overflow: 'hidden'}}>
          <div className="col-md-10 col-md-offset-1">
            <img src="/img/home_adagency_slider1.jpg" style={{width: '100%'}} />
          </div>
        </div>
        <div className="row wrapper wrapper-content white-bg" style={{paddingBottom: '40px'}}>
          <div className="col-md-10 col-md-offset-1">
              <p>Progress Bound was created for the sole purpose of helping businesses improve
                their quality of service, their business function and their association with their communities.</p>
              <p>Through years of experience and research our staff of professionals have designed new management
                and administrative methods to improve your business.</p>
              <p>In our methods you will find new ways to make your business run more efficiently and more affectively.
                Our training programs will help your admin staff gain more knowledge about their work functions
                and will inspire them to work better and harder.</p>
              <p>These programs will give you and your employees marketable skills for future progress of your company.
                We strongly believe that it is through constant learning and training you can make your business
                more profitable and progressive, and this competitive market all of us at progress bound are ready
                to help you achieve any plans or aspirations you have for your business. </p>
              <p>To read more, please visit <a href="http://progressbound.com/about/" target="_blank">our website.</a></p>
          </div>
        </div>
      </div>
    )
  }
}

export default AboutUs
