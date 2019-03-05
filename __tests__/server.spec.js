const request = require('supertest');
const app = require ('../app');
const Event = require('../server/models').event;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/*
Supported POST bodies
*/
const userEntersRoom = {"date": "1985­10­26T09:00:00Z", "user": "Doc", "type": "enter"};

const userCommentsInARoom = {"date": "1985­10­27T09:01:00Z", "user": "Doc", "type": "comment", "message": "I love plutonium"};

const userHighFivesAnotherUser = {"date": "1985­10­28T09:02:00Z", "user": "Marty", "type": "highfive", "otheruser": "Doc"};

const userLeavesRoom = {"date": "1985­10­29T09:03:00Z", "user": "Doc", "type": "leave"};

describe('Events API', () => {
  describe( 'creating events', () => {
    it( 'the events route responds to a POST with a user enters event', (done) => {
      request(app)
      .post('/events')
      .send(userEntersRoom)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body).toHaveProperty('status', 'ok');
        done();
      });
    });
    it( 'the events route responds to a POST with a user comments event', (done) => {
      request(app)
        .post('/events')
        .send(userCommentsInARoom)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body).toHaveProperty('status', 'ok');
          done();
        });
    });
    it( 'the events route responds to a POST with a user high five event', (done) => {
      request(app)
        .post('/events')
        .send(userHighFivesAnotherUser)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body).toHaveProperty('status', 'ok');
          done();
        });
    });
    it( 'the events route responds to a POST with a user leaves event', (done) => {
      request(app)
        .post('/events')
        .send(userLeavesRoom)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body).toHaveProperty('status', 'ok');
          done();
        });
    });
  });

  describe( 'listing events', () => {
    it( 'the events route will get a listing of events', (done) => {
      Event
        .findAll({
          where: {
            date: {
              [Op.lt]: '1985­10­26T09:00:00Z',
              [Op.gt]: '1985­10­29T09:03:00Z'
            }
          }
        })
        .then((events) => {
          request(app)
            .get('/events')
            .send('from=1985­10­26T09:00:00Z&to=1985­10­29T09:03:00Z')
            .expect(200)
            .end((err, res) => {
              expect(err).toBeNull();
              expect(res.body).toEqual(events);
              done();
            });
        })
    });
  });

  describe( 'summary events', () => {
    it( 'the events route responds to a POST with a user enters event', (done) => {
      request(app)
        .post('/events')
        .send(userEntersRoom)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body).toHaveProperty('status', 'ok');
          done();
        });
    });
  });

  describe( 'clearing events', () => {
    it('clears data in db when posting to events clear route', (done) => {
      request(app)
      .post('/events/clear')
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body).toHaveProperty('status', 'ok');
        done();
      });
    });
  });
});

