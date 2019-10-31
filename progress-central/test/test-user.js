/*jshint expr: true*/
var expect = require('chai').expect,
  superagent = require('superagent'),
  moment = require('moment'),
  validator = require('validator'),
  bcrypt = require('bcrypt')

var credentials = require('../credentials.js')
var User = require('../models/user.js')

var db

var urlBase = 'http://localhost:9000'

describe('Test related to Users\n', function() {
  before(function() {
    // MongoDB connection using Mongoose
    var mongoose = require('mongoose')
    var opts = {
      server: {
        socketOptions: {keepAlive: 1}
      }
    }
    mongoose.connect(credentials.mongo.development.connectionString, opts)

    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
  })
  describe('\tEndpoints related to user registration\n\t', function() {
    var testUser
    before(function(done) {
      var hash = bcrypt.hashSync('testingtesting1', 5)
      var user = User({
        email: "testing@gmail.com",
        password: hash,
        first_name: 'test first',
        last_name: 'test last',
        description: 'test description'
      })
      user.save(function(err, user) {
        if (err) return done(err)
        
        testUser = user

        done()
      })
    })
    describe('User#validPassword', function() {
      it('should compare a correct password string with stored hash', function(done) {
        var user = User.findOne({email: 'testing@gmail.com'}, function(err, user) {
          if (err) return done(err)

          expect(user).to.not.be.undefined
          user.validPassword('testingtesting1', function(err, res) {
            if (err) return done(err)

            expect(res).to.be.true

            done()
          })
        })
      })
      it('should compare an incorrect password string with stored hash', function(done) {
        var user = User.findOne({email: 'testing@gmail.com'}, function(err, user) {
          if (err) return done(err)

          expect(user).to.not.be.undefined
          user.validPassword('testingasdfing1', function(err, res) {
            if (err) return done(err)

            expect(res).to.be.false

            done()
          })
        })
      })
    })
    describe('/signup/:invite_key', function() {
      var inviteEmail = 'testingsignup@gmail.com'
      var randomPassword, inviteKey
      before(function(done) {
        User.inviteUser(inviteEmail, function(err, user, password, key) {
          if (err) return done(err)

          randomPassword = password
          inviteKey = key
          
          done()
        })
      })
      it('should display signup page', function(done) {
        superagent.get(`${urlBase}/signup/${inviteKey}`)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res.status).to.equal(200)

          done()
        })
      })
      it('should not display signup page for invalid invite key', function(done) {
        superagent.get(`${urlBase}/signup/asdflkjqwer1`)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res.status).to.equal(404)

          done()
        })       
      })
      it('should signup a user', function(done) {
        superagent.post(`${urlBase}/signup/${inviteKey}`)
          .send({first_name: 'first', last_name: 'last', old_password: randomPassword, new_password: 'asdfasdf1'})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.status).to.equal(200)

            User.findOne({ email: inviteEmail }, function(err, user) {
              if (err) return done(err)

              expect(user.first_name).to.equal('first')
              expect(user.last_name).to.equal('last')
              expect(user.status).to.equal('ACTIVE')

              user.validPassword('asdfasdf1', function(err, res) {
                if (err) return done(err)
                expect(res).to.be.true

                done()
              })
            })
          })
      })
      /*
      it('should check if password is at least 8 characters', function(done) {
        superagent.post(urlBase + '/signup')
          .send({email: 'testing1@gmail.com', first_name: 'first', last_name: 'last', password: 'asdfas1'})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.password).to.not.be.undefined

            done()
          })
      })
      it('should check if password contains at least one number', function(done) {
        superagent.post(urlBase + '/signup')
          .send({email: 'testing1@gmail.com', first_name: 'first', last_name: 'last', password: 'asdfasdf'})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.password).to.not.be.undefined

            done()
          })
      })
      it('should check if password contains at least one character', function(done) {
        superagent.post(urlBase + '/signup')
          .send({email: 'testing1@gmail.com', first_name: 'first', last_name: 'last', password: '12341234'})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.password).to.not.be.undefined

            done()
          })
      })*/
    })
    describe('User#invite', function() {
      it('should create an inactive account', function(done) {
        User.inviteUser('testingnew@gmail.com', function(err, user) {
          if (err) return done(err)
          
          expect(user.email).to.equal('testingnew@gmail.com')
          expect(user.status).to.equal('INACTIVE')
          
          done()
        }) 
      })
      it('should only create an account with unique password', function(done) {
        User.inviteUser('testing@gmail.com', function(err, user) {
          expect(err.message).to.equal('This email is already taken')
          
          done()
        })
      })
    })
    describe('/api/user/invite', function() {
      var agent 
      before(function(done) {
        agent = superagent.agent()
        agent.post(urlBase + '/login')
        .send({email: 'testing@gmail.com', password: 'testingtesting1'})
        .end(function(err, res) {
          if (err) return done(err)

          done()
        }) 
      })
      it('should invite a user', function(done) {
        agent.post(urlBase + '/api/user/invite')
        .send({email: 'testinginvite@gmail.com'})
        .end(function(err, res) {
          if (err) return done(err)
          
          expect(res.body.user.email).to.equal('testinginvite@gmail.com')

          done()
        })
      })
      it('should only invite email that has not been already registered', function(done) {
         agent.post(urlBase + '/api/user/invite')
        .send({email: 'testing@gmail.com'})
        .end(function(err, res) {
          if (err) return done(err)
        
          expect(res.body.error).to.equal('This email is already taken')

          done()
        })       
      })
    })
    describe('/login', function() {
      it('should login a user', function(done) {
        superagent.post(urlBase + '/login')
          .send({email: 'testing@gmail.com', password: 'testingtesting1'})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.status).to.equal(200)

            done()
          })
      })
    })
    describe('/api/user/:user_id/edit', function() {
      var agent
      before(function(done) {
        agent = superagent.agent()
        agent.post(urlBase + '/login')
        .send({email: 'testing@gmail.com', password: 'testingtesting1'})
        .end(function(err, res) {
          if (err) return done(err)

          done()
        })
      })
      it('should edit a user profile', function(done) {
        agent.put(`${urlBase}/api/user/${testUser._id}/edit`)
          .send({ user: 
            {first_name: 'first test', last_name: 'last test', description: 'test changed'}})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.status).to.equal(200)
            expect(res.body.user.first_name).to.equal('first test')
            expect(res.body.user.last_name).to.equal('last test')
            expect(res.body.user.description).to.equal('test changed')
            
            done()
          })
      })
      it('should not edit a user profile with missing fields', function(done) {
        agent.put(`${urlBase}/api/user/${testUser._id}/edit`)
          .send({user: {first_name: "", last_name: "", description: 'test changed'}})
          .end(function(err, res) {
            expect(err).to.not.be.null
            expect(res.status).to.equal(500)
            expect(res.body['user.first_name']).to.not.be.undefined
            expect(res.body['user.last_name']).to.not.be.undefined
            
            done()
          })
      })
      it('should only edit given fields', function(done) {
        agent.put(`${urlBase}/api/user/${testUser._id}/edit`)
          .send({user: {first_name: "first test", last_name: "last test", user_type: "ADMIN"}})
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res.body.user.user_type).to.equal('STUDENT')
            
            done()
          })
      })
    })
    describe('/api/user/:user_id/delete', function() {
      var deleteUser, agent
      before(function(done) {
        var hash = bcrypt.hashSync('testingtesting1', 5)
        var user = User({
          email: "testingdelete@gmail.com",
          password: hash,
          first_name: 'test first',
          last_name: 'test last',
          description: 'test description'
        })
        user.save(function(err, user) {
          if (err) return done(err)

          deleteUser = user

          agent = superagent.agent()
          agent.post(urlBase + '/login')
          .send({email: 'testing@gmail.com', password: 'testingtesting1'})
          .end(function(err, res) {
            if (err) return done(err)

            done()
          })
        })
      })
      it('should delete a user', function(done) {
        agent.delete(`${urlBase}/api/user/${deleteUser._id}/delete`)
        .end(function(err, res) {
          if (err) return done(err)
          
          expect(res.body.user.email).to.equal('testingdelete@gmail.com')
          
          User.find({email: 'testingdelete@gmail.com'}, function(err, user) {
            if (err) return done(err)
            
            expect(user).to.be.empty

            done()
          })
        }) 
      })
    })
  })
  describe('\tEndpoints related to user notification\n\t', function() {
    var testUser
    before(function(done) {
      var hash = bcrypt.hashSync('testingtesting1', 5)
      var user = User({
        email: "testing1@gmail.com",
        password: hash,
        first_name: 'test second',
        last_name: 'test last',
        description: 'test description',
        notifications: [
          {
            title: 'Test notification 1',
            content: 'testing'
          }
        ]
      })
      user.save(function(err, user) {
        if (err) return done(err)

        testUser = user

        done()
      })
    })
    describe('User#addNotification', function() {
      it('adds a notification', function(done) {
        var title = 'Test Add',
          content = 'testing'
        testUser.addNotification(title, content, function(err, user) {
          if (err) return done(err)

          var lastNotification = user.notifications.pop()
          expect(lastNotification.title).to.equal(title)
          expect(lastNotification.content).to.equal(content)
          
          done()
        })
      })
    })
    describe('User', function() {
      before(function(done) {
        var notifications = []
        for (var i = 1; i < 52; i++) {
          notifications.push({ title: `Test 50 -- ${i}`, content: 'testing' })
        }
        User.findByIdAndUpdate(testUser._id,
          { '$push': { 'notifications': {
            '$each': notifications,
            '$slice': -50
          }}}, { 'new': true, 'runValidators': true }, done)
      })
      it('only stores up to 50 most recent notifications', function(done) {
        testUser.addNotification('Test Recent', 'testing', function(err, user) {
          if (err) return done(err)

          expect(user.notifications.length).to.equal(50)

          // Should have the most recent notification
          var notification = user.notifications.pop()
          expect(notification.title).to.equal('Test Recent')

          done()
        })
      })
    })
    describe('User#readNotification', function() {
      it('changes read status of a notification from unread to read', function(done) {
        var notification = testUser.notifications.slice(-1)[0]
        testUser.readNotification([notification._id], function(err, user) {
          if (err) return done(err)

          var modifiedNotification = user.notifications.id(notification._id)
          expect(modifiedNotification.read).to.be.true

          done()
        })
      })
    })
    describe('/api/user/notification', function() {
      var agent
      before(function(done) {
        agent = superagent.agent()
        agent.post(urlBase + '/login')
        .send({email: 'testing1@gmail.com', password: 'testingtesting1'})
        .end(done)
      })
      it('changes read status of indicated notifications from unread to read', function(done) {
        User.findById(testUser._id, function(err, user) {
          if (err) return done(err)

          var notification = user.notifications.pop()

          agent.put(`${urlBase}/api/user/notification`)
          .send({notification_ids: [notification._id]})
          .end(function(err, res) {
            if (err) return done(err)

            expect(res.status).to.equal(200)
            
            var newNotifications = res.body.user.notifications
            var modifiedNotification = newNotifications.find(function(newNotification) {
              return newNotification._id === notification._id.toString()
            }) 
            
            expect(modifiedNotification.read).to.be.true

            done()
          })
        })
        it('silently fails if notification id is invalid', function(done) {
          User.findById(testUser._id, function (err, user) {
            if (err) return done(err)

            agent.put(`${urlBase}/api/user/notification`)
            .send({notification_ids: ['asdfasdf']})
            .end(function (err, res) {
              if (err) return done(err)

              expect(err).to.not.be.null

              expect(res.status).to.equal(200)

              var newNotifications = res.body.user.notifications
              var modifiedNotificaiton = newNotifications.find(function (newNotification) {
                return newNotification._id === notification._id
              })

              expect(modifiedNotificaiton.read).to.be.true

              done()
            })
          })
        })
      })
    })
  })
  after(function(done) {
    db.collection('users').removeMany(function(err) {
      if (err) return done(err)

      db.close(done)
    })
  })
})
