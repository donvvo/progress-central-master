var mongoose = require('mongoose')
var moment = require('moment')
var bcrypt = require('bcrypt')
var ObjectId = mongoose.Types.ObjectId;

var credentials = require('./credentials.js')
var Course = require('./models/course.js')
var User = require('./models/user.js')

// MongoDB connection using Mongoose
var opts = {
  server: {
    socketOptions: {keepAlive: 1}
  }
}
mongoose.connect(credentials.mongo.development.connectionString, opts)

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



// Initialize Courses
var courses = [
  {
    _id: new ObjectId(),
    name: "Test Course 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    course_start: moment('2016-04-01').toDate(),
    course_end: moment('2016-04-30').toDate(),
    status: "COMPLETE",
    lessons: [
      {
        name: "Lecture 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        content: {
          content_type: "HTML",
          content: "&lt;h1&gt;Testing&lt;/h1&gt;&lt;p&gt;I am eating &lt;b&gt;crab&lt;/b&gt; meat&lt;/p&gt;",
          media_url: "https://www.youtube.com/embed/xxspKrnpMFE/"
        }
      },
      {
        name: "Lecture 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        content: {
          content_type: "HTML",
          content: "&lt;h1&gt;Testing&lt;/h1&gt;&lt;p&gt;I am eating &lt;b&gt;crab&lt;/b&gt; meat&lt;/p&gt;",
          media_url: "https://www.youtube.com/embed/xxspKrnpMFE/"
        }

      },
      {
        name: "Lecture 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        content: {
          content_type: "HTML",
          content: "&lt;h1&gt;Testing&lt;/h1&gt;&lt;p&gt;I am eating &lt;b&gt;crab&lt;/b&gt; meat&lt;/p&gt;",
          media_url: "https://www.youtube.com/embed/xxspKrnpMFE/"
        }

      }
    ]
  },
  {
    _id: new ObjectId(),
    name: "Test Course 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    course_start: moment('2016-04-15').toDate(),
    course_end: moment('2016-05-30').toDate(),
    status: "ACTIVE"
  },
  {
    _id: new ObjectId(),
    name: "Test Course 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    course_start: moment('2016-05-30').toDate(),
    course_end: moment('2016-06-15').toDate(),
    status: "INACTIVE"
  }  
]

Course.create(courses, function(err, courses) {
  if (err) throw err

  console.log(courses)

  var registeredCourses = courses.map(function(course) {
    return {
      _id: course._id,
      status: "ACTIVE"
    }
  })

  var names = [
    "Rowena Baria",
    "Kylie Rebernik",
    "Katherine Lansbergen",
    "Arnela Radaslic",
    "Jennel Fletcher",
    "Varduhi Chabonyan",
    "Marta Przepiorka",
    "Ivanna Kipic",
    "Shabil Ahmed",
    "Sarah Lee",
    "Aditi Shah",
    "Christina Campoli",
    "Samita Sarwan",
    "Brittney Foster",
    "Tanya Chandler",
    "Veronica Gomez",
    "Parisa Rahimi",
    "Corry Williams",
    "Mathieu Turgeon",
    "Rolindsay De Leon",
    "Kyla Man",
    "Luciano DeFeo",
    "Amanda Nonis",
    "Vanessa DeSouza",
    "Krishia Go",
    "Tatevik Davoyan",
    "Susanna Bakhudarova",
    "Aya Lopez",
    "Armenuhi Zilgfugharyan",
    "Radmehr Arjmandi",
    "Melina Oyarzun",
    "Nairy Parouian",
  ]

  var emails = names.map(function(name) {
    return name.toLowerCase().replace(" ", "-")
  })

  var users = [
    {
      email: "andrewjjung47@gmail.com",
      password: bcrypt.hashSync('progress-admin', 5),
      first_name: "Andrew",
      last_name: "Jung",
      user_type: "ADMIN",
      status: "ACTIVE"
    }, {
      email: "hayk@progress-central.com",
      password: bcrypt.hashSync('progress-admin', 5),
      first_name: "Hayk",
      last_name: "Karavardanyan",
      user_type: "ADMIN",
      status: "ACTIVE"
    }
  ]
  var nameArray
  for (var i = 0; i < names.length; i++) {
    nameArray = names[i].split(" ")
    users.push({
      email: emails[i],
      password: bcrypt.hashSync('progresscentral', 5),
      first_name: nameArray[0],
      last_name: nameArray[1],
      user_type: "STUDENT",
      status: "ACTIVE"
    })
  }

  /* var users = [
    {
      email: "admin@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Admin",
      last_name: "Test",
      user_type: "ADMIN",
      status: 'ACTIVE',
      notifications: [
        {
          title: 'Test Notification 1',
          content: 'Test content 1',
          timestamp: moment('2016-05-01 04:23').toJSON(),
          read: false
        },
        {
          title: 'Test Notification 2',
          content: 'Test content 2',
          timestamp: moment('2016-05-14 01:13').toJSON(),
          read: true
        },
        {
          title: 'Test Notification 3',
          content: 'Test content 3',
          timestamp: moment('2016-05-20 13:00').toJSON(),
          read: false
        },
        {
          title: 'Test Notification 4',
          content: 'Test content 4',
          timestamp: moment('2016-05-31 13:00').toJSON(),
          read: true
        },
        {
          title: 'Test Notification 5',
          content: 'Test content 5',
          timestamp: moment('2016-06-01 13:00').toJSON(),
          read: false
        },
        {
          title: 'Test Notification 6',
          content: 'Test content 6',
          timestamp: moment('2016-06-01 15:00').toJSON(),
          read: false
        }
      ]
    },
    {
      email: "student1@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Student",
      last_name: "One",
      user_type: "STUDENT",
      status: 'ACTIVE',
      courses: registeredCourses
    },
    {
      email: "student2@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Student",
      last_name: "Two",
      status: 'ACTIVE',
      user_type: "STUDENT"
    },
    {
      email: "kumbhare@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Kumbhare",
      last_name: "Admin",
      user_type: "ADMIN",
      status: "ACTIVE"
    },
    {
      email: "sid1@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Student",
      last_name: "One",
      user_type: "STUDENT",
      courses: registeredCourses,
      status: "ACTIVE"
    },
    {
      email: "sid2@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Student",
      last_name: "Two",
      user_type: "STUDENT",
      status: "ACTIVE"
    },
    {
      email: "sid3@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Student",
      last_name: "Three",
      user_type: "STUDENT",
      status: "ACTIVE"
    },
    {
      email: "sid4@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Student",
      last_name: "Four",
      user_type: "STUDENT",
      status: "ACTIVE"
    },
    {
      email: "sid5@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Student",
      last_name: "Five",
      user_type: "STUDENT",
      status: "ACTIVE"
    },
    {
      email: "sid6@test.com",
      password: bcrypt.hashSync('asdfasdf1', 5),
      first_name: "Student",
      last_name: "Six",
      user_type: "STUDENT",
      status: "ACTIVE"
    }
  ] */
  User.create(users, function(err, users) {
    if (err) throw err

    console.log(users)

    db.close()
  })
})
