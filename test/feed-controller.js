const expect= require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed controller', () => {
  before((done) => {
    mongoose
    .connect(
      'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/test-messages?retryWrites=true'
    )
    .then(result => {
      const user = new User({
        email: 'test@test.com',
        password: 'tester',
        name: 'Test',
        posts: [],
        _id: '5c0f66b979af55031b34728a'
      });

      return user.save();
    })
    .then(() => {
      done();
    });
  });

  it('should add a created post to the posts of the creator', (done) => {
    const req = {
      title: 'Test post',
      content: 'A test post',
      userId: '5c0f66b979af55031b34728a',
      file: {
        path: 'abc'
      }
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after((done) => {
    User.deleteMany({}).then(() => {
      return mongoose.disconnect();
    })
    .then(() => {
      done();
    });
  });
});