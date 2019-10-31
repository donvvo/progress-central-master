/**
 * Created by andrewjjung on 2016-05-31.
 */

jest.disableAutomock()
jest.mock('../source/actions/UserActions')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import {Link} from 'react-router'

import moment from 'moment'

import UserActions from '../source/actions/UserActions'

import NavNotificationRow from '../source/Page/Content/Notification/NavNotificationRow'
import NavNotification from '../source/Page/Content/Notification/NavNotification'
import NotificationsList from '../source/Page/Content/Notification/NotificationsList'
import NotificationRow from '../source/Page/Content/Notification/NotificationRow'

const notifications = [
  {
    _id: 'asdf1',
    title: 'Test Notification 1',
    content: 'Test content 1',
    timestamp: moment('2016-05-01 04:23').toJSON(),
    read: false
  },
  {
    _id: 'asdf2',
    title: 'Test Notification 2',
    content: 'Test content 2',
    timestamp: moment('2016-05-14 01:13').toJSON(),
    read: true
  },
  {
    _id: 'asdf3',
    title: 'Test Notification 3',
    content: 'Test content 3',
    timestamp: moment('2016-05-20 13:00').toJSON(),
    read: false
  },
  {
    _id: 'asdf4',
    title: 'Test Notification 4',
    content: 'Test content 4',
    timestamp: moment('2016-05-31 13:00').toJSON(),
    read: true
  },
  {
    _id: 'asdf5',
    title: 'Test Notification 5',
    content: 'Test content 5',
    timestamp: moment('2016-06-01 13:00').toJSON(),
    read: false
  },
  {
    _id: 'asdf6',
    title: 'Test Notification 6',
    content: 'Test content 6',
    timestamp: moment('2016-06-01 15:00').toJSON(),
    read: false
  }
]

describe('NavNotificationRow', () => {
  it('displays a single notification', () => {
    const notification = notifications[0]
    const notificationRow = TestUtils.renderIntoDocument(
      <NavNotificationRow notification={notification} />
    )
    const divElement = TestUtils.findRenderedDOMComponentWithTag(notificationRow, 'div')

    const content = divElement.textContent

    const expectedTimestampFromNow = moment(notification.timestamp).fromNow()

    expect(content).toEqual(notification.title + expectedTimestampFromNow)
  })
  it('links to full notification page to view the notification', () => {
    const notification = notifications[0]
    const notificationRow = TestUtils.renderIntoDocument(
      <NavNotificationRow notification={notification} />
    )
    const linkElement = TestUtils.findRenderedComponentWithType(notificationRow, Link)

    // TODO: test if link directs to notification page
    expect(linkElement).not.toBeUndefined()
    expect(linkElement).not.toBeNull()
  })
})
describe('NotificationList', () => {
  it('displays no notifications if there is nothing unread', () => {
    const notification = TestUtils.renderIntoDocument(
      <NavNotification notifications={[]} />
    )
    const divElements = TestUtils.scryRenderedDOMComponentsWithTag(notification, 'div')

    expect(divElements[0].textContent).toEqual("No new messages")
  })
  it('displays up to 3 most recent and unread notifications, if there is more than 3 unread notifications', () => {
    const notification = TestUtils.renderIntoDocument(
      <NavNotification notifications={notifications} />
    )
    const divElements = TestUtils.scryRenderedDOMComponentsWithTag(notification, 'div')
    const timeSpans = TestUtils.scryRenderedDOMComponentsWithClass(notification, 'text-muted small')

    expect(divElements.length).toEqual(4)
    expect(timeSpans.length).toEqual(3)
    

    expect(divElements[0].textContent).toEqual(notifications[5].title + moment(notifications[5].timestamp).fromNow())
    
    expect(divElements[1].textContent).toEqual(notifications[4].title + moment(notifications[4].timestamp).fromNow())
    
    expect(divElements[2].textContent).toEqual(notifications[2].title + moment(notifications[2].timestamp).fromNow())
  })
  it('displays up to 3 most recent and unread notifications, if there is less than 3 unread notifications', () => {
    const notification = TestUtils.renderIntoDocument(
      <NavNotification notifications={notifications.slice(0, 4)} />
    )
    const divElements = TestUtils.scryRenderedDOMComponentsWithTag(notification, 'div')
    const timeSpans = TestUtils.scryRenderedDOMComponentsWithClass(notification, 'text-muted small')

    expect(divElements.length).toEqual(3)
    expect(timeSpans.length).toEqual(2)

    expect(divElements[0].textContent).toEqual(notifications[2].title + moment(notifications[2].timestamp).fromNow())

    expect(divElements[1].textContent).toEqual(notifications[0].title + moment(notifications[0].timestamp).fromNow())
  }) 
  it('displays how many notifications are unread', () => {
    const notification = TestUtils.renderIntoDocument(
      <NavNotification notifications={notifications} />
    )
    const countElement = TestUtils.findRenderedDOMComponentWithClass(notification, 'count-info')

    const countText = countElement.childNodes[1].textContent
    
    expect(countText).toEqual("4")
  })
})
describe('NotificationsList', () => {
  const notifications = []
  
  beforeAll(() => {
    for (let i = 0; i < 15; i++) {
      notifications.push({
        _id: `asdf${i}`,
        title: `Test Notification ${i}`,
        content: 'testing',
        timestamp: moment().toJSON(),
        read: false
      })
    }   
  })
  it('displays no notifications and load more button when there is no notification', () => {
    const notificationList = TestUtils.renderIntoDocument(
      <NotificationsList notifications={[]} />
    )
    const notificationRows = TestUtils.scryRenderedComponentsWithType(notificationList, NotificationRow)
    const placeholder = TestUtils.findRenderedDOMComponentWithClass(notificationList, 'no-notification')
    const loadmoreButton = TestUtils.scryRenderedDOMComponentsWithTag(notificationList, 'button')

    expect(notificationRows.length).toEqual(0)
    expect(placeholder.textContent).toEqual("There is no notification") 
    expect(loadmoreButton.length).toEqual(0)
  })
  it('displays notifications and no load more button when there is notifications less than 11', () => {
    const notificationList = TestUtils.renderIntoDocument(
      <NotificationsList notifications={notifications.slice(0, 5)} />
    )
    const notificationRows = TestUtils.scryRenderedComponentsWithType(notificationList, NotificationRow)
    const placeholder = TestUtils.scryRenderedDOMComponentsWithClass(notificationList, 'no-notification')
    const loadmoreButton = TestUtils.scryRenderedDOMComponentsWithTag(notificationList, 'button')

    expect(notificationRows.length).toEqual(5)
    expect(placeholder.length).toEqual(0)
    expect(loadmoreButton.length).toEqual(0)
  })
  it('displays 10 notifications and load more button when there is notifications more than 10', () => {
    const notificationList = TestUtils.renderIntoDocument(
      <NotificationsList notifications={notifications.slice(0, 11)} />
    )
    const notificationRows = TestUtils.scryRenderedComponentsWithType(notificationList, NotificationRow)
    const placeholder = TestUtils.scryRenderedDOMComponentsWithClass(notificationList, 'no-notification')
    const loadmoreButton = TestUtils.scryRenderedDOMComponentsWithTag(notificationList, 'button')

    expect(notificationRows.length).toEqual(10)
    expect(placeholder.length).toEqual(0)
    expect(loadmoreButton.length).toEqual(1)
  })
  it('clicking load more button loads up to 10 more notifications when there is notifications more than 10', () => {
    const notificationList = TestUtils.renderIntoDocument(
      <NotificationsList notifications={notifications} />
    )
    const notificationRows = TestUtils.scryRenderedComponentsWithType(notificationList, NotificationRow)
    const placeholder = TestUtils.scryRenderedDOMComponentsWithClass(notificationList, 'no-notification')
    const loadmoreButton = TestUtils.scryRenderedDOMComponentsWithTag(notificationList, 'button')

    expect(notificationRows.length).toEqual(10)
    expect(placeholder.length).toEqual(0)
    expect(loadmoreButton.length).toEqual(1)
    
    TestUtils.Simulate.click(loadmoreButton[0])

    const newNotificationRows = TestUtils.scryRenderedComponentsWithType(notificationList, NotificationRow)
    const newLoadmoreButton = TestUtils.scryRenderedDOMComponentsWithTag(notificationList, 'button')
    
    expect(newNotificationRows.length).toEqual(15)
    expect(newLoadmoreButton.length).toEqual(0)
  })
})
describe('NotificationRow', () => {
  it('should call NotificationAction.readNotification(notification_id) when clicked', () => {
    const notification = notifications[0]
    const notificationComponent = TestUtils.renderIntoDocument(
      <NotificationRow notification={notification} />
    )
    const notificationReferenceElement = TestUtils.findRenderedDOMComponentWithTag(notificationComponent, 'a')

    TestUtils.Simulate.click(notificationReferenceElement)

    expect(UserActions.readNotification).toBeCalledWith(notification._id)
  })
})

