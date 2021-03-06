const request = require('supertest');
const app = require ('../app');
const eventServices = require('../server/services').events;
const eventFixtures = require('../server/fixtures').events;
const _ = require('lodash');
const moment = require('moment');

/*
Supported POST bodies
*/
const userEntersRoom = {"date": "1985­10­26T09:00:00Z", "user": "Doc", "type": "enter"};
const userCommentsInARoom = {"date": "1985­10­27T09:01:00Z", "user": "Doc", "type": "comment", "message": "I love plutonium"};
const userHighFivesAnotherUser = {"date": "1985­10­28T09:02:00Z", "user": "Marty", "type": "highfive", "otheruser": "Doc"};
const userLeavesRoom = {"date": "1985­10­29T09:03:00Z", "user": "Doc", "type": "leave"};

/*
GET URIs
 */
const listURI = '/events?from=2019-02-10T21:03:34Z&to=2019-02-25T21:03:34Z';
const summaryURI = '/events/summary?from=2019-02-10T21:03:34Z&to=2019-02-25T21:03:34Z&by=hour';

describe('Events API', () => {

  beforeEach( async() => {
    await eventFixtures.loadDb;
  });

  afterEach( async() => {
    await eventFixtures.clearDb;
  });

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
      eventServices
        .list({to: '2019-02-25T21:03:34Z', from: '2019-02-10T21:03:34Z'})
        .then((events) => {
          request(app)
            .get(listURI)
            .expect(200)
            .end((err, res) => {
              const apiResults = _.map(res.body.events, (event) => {
                return {
                  ...event,
                  date: moment(event.date, moment.ISO_8601).toDate()
                };
              });
              const dbResults = events["events"];
              expect(apiResults).toMatchObject(dbResults);
              expect(err).toBeNull();
              done();
            });
        });
    });
  });

  describe( 'summary events', () => {
    it( 'the events route will get a summary of types of events', (done) => {
      eventServices
        .summary({by: 'hour', to: '2019-02-25T21:03:34Z', from: '2019-02-10T21:03:34Z'})
        .then((events) => {
          request(app)
            .get(summaryURI)
            .expect(200)
            .end((err, res) => {
              const apiResults = _.map(res.body.events, (event) => {
                return {
                  ...event,
                  date: moment(event.date, moment.ISO_8601).toDate()
                };
              });
              const dbResults = events["events"];
              expect(apiResults).toMatchObject(dbResults);
              expect(err).toBeNull();
              done();
            });
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

