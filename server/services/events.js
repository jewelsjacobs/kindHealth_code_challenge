/* eslint-disable no-irregular-whitespace */
const Event = require('../models').event;
const Sequelize = require('sequelize');
let db  = require('../models/index');
const Op = Sequelize.Op;
const _ = require('lodash');
const utils = require('../utils').events;

module.exports = {

  create({ user, type, message, otheruser, date }) {
    return Event
      .create({ user, type, message, otheruser, date: utils.serializeDate(date) });
  },

  list({to, from}) {
    return new Promise((resolve, reject) => {
      return Event
        .findAll({
          where: {
            date: {
              [Op.lt]: utils.serializeDate(to),
              [Op.gt]: utils.serializeDate(from)
            }
          }
        })
        .then((results) => {
          const response = {
            events: []
          };
          response.events = _.map(results, (result) => {
            const filteredEvent = {};
            filteredEvent.id = result.id;
            filteredEvent.date = result.date;
            filteredEvent.user = result.user;
            filteredEvent.type = result.type;
            if (result.message !== null) {
              filteredEvent.message = result.message;
            }
            if (result.otheruser !== null) {
              filteredEvent.otheruser = result.otheruser;
            }
            return filteredEvent;
          });

          resolve(response);
        })
        .catch((error) => reject(error));
    });
  },

  summary({by, to, from}) {
    return new Promise((resolve, reject) => {
      return Event
        .findAll({
          attributes: [
            [db.sequelize.fn('date_trunc', by, db.sequelize.col('date')), 'date'],
            [db.sequelize.fn('COALESCE', Sequelize.literal(`case when type = 'comment' then count(type) end`), 0), 'comments'],
            [db.sequelize.fn('COALESCE', Sequelize.literal(`case when type = 'leave' then count(type) end`), 0), 'leaves'],
            [db.sequelize.fn('COALESCE', Sequelize.literal(`case when type = 'highfive' then count(type) end`), 0), 'highfives'],
            [db.sequelize.fn('COALESCE', Sequelize.literal(`case when type = 'enter' then count(type) end`), 0), 'enters'],
          ],
          where: {
            date: {
              [Op.lt]: utils.serializeDate(to),
              [Op.gt]: utils.serializeDate(from)
            }
          },
          group: ['date', 'type'],
          raw: true
        }).then((events) => {
          const results = {
            events: []
          };
          const transformedEvents = _.reduce(events,(result, value) => {
            return {
              "date": result.date,
              "comments": parseInt(value.comments, 10) + parseInt(result.comments, 10),
              "leaves": parseInt(value.leaves) + parseInt(result.leaves),
              "highfives": parseInt(value.highfives, 10) + parseInt(result.highfives, 10),
              "enters": parseInt(value.enters, 10) + parseInt(result.enters, 10)
            };
          });

          results.events.push(transformedEvents);
          resolve(results);
        })
        .catch((error) => reject(error));
    });
  },

  clear() {
    return Event
      .destroy({ where: {}, truncate: true });
  },
};
