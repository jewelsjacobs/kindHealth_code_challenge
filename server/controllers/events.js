/* eslint-disable no-irregular-whitespace */
const Event = require('../models').event;
const Sequelize = require('sequelize');
let db  = require('../models/index');
const Op = Sequelize.Op;
const _ = require('lodash');

const rawSQLQueury = `select date_trunc('hour', "date") as "date", \
case when type = 'comment' then count(type) end as "comments", \
case when type = 'leave' then count(type) end as "leaves", \
case when type = 'highfive' then count(type) end as "highfives", \
case when type = 'enter' then count(type) end as "enters" \
from \
public.events \
where \
type is not null \
and "date" > date_trunc(?, \
timestamp ?) \
and "date" < date_trunc(?, \
timestamp ?) \
group by "date", "type";`;

module.exports = {
  create(req, res) {
    const { user, type, message = null, otheruser = null, date } = req.body;
    return Event
      .create({ user, type, message, otheruser, date })
      .then(() => res.status(200).json({status: "ok"}))
      .catch((error) => res.status(400).send(error));
  },

  list(req, res) {
    return Event
      .findAll({
        where: {
          date: {
            [Op.lt]: req.query.to,
            [Op.gt]: req.query.from
          }
        }
      })
      .then((results) => {
        const response = {
          events: []
        };
        const transformedResults = _.map(results, (result) => {
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
        response.events = transformedResults;
        res.status(200).json(response);
      })
      .catch((error) => res.status(400).send(error));
  },

  summary(req, res) {
    return db.sequelize.query(rawSQLQueury,
      { replacements: [req.query.by, req.query.from, req.query.by, req.query.to], type: db.sequelize.QueryTypes.SELECT }
    ).then((events) => {
      const results = {
        events: []
      };

      const transformedEvents = _
        .chain(events)
        .map((event) => {
          (event.comments === null) ? event.comments = 0 : event.comments;
          (event.leaves === null) ? event.leaves = 0 : event.leaves;
          (event.highfives === null) ? event.highfives = 0 : event.highfives;
          (event.enters === null) ? event.enters = 0 : event.enters;
          return event;
        })
        .reduce((result, value) => {
          return {
            "date": result.date,
            "comments": parseInt(value.comments, 10) + parseInt(result.comments, 10),
            "leaves": parseInt(value.leaves) + parseInt(result.leaves),
            "highfives": parseInt(value.highfives, 10) + parseInt(result.highfives, 10),
            "enters": parseInt(value.enters, 10) + parseInt(result.enters, 10)
          };
        })
        .value();

      results.events.push(transformedEvents);
      res.status(200).json(results);
    })
      .catch((error) => res.status(400).send(error));
  },

  clear(req, res) {
    return Event
      .destroy({
        where: {},
        truncate: true
      })
      .then(() => res.status(200).json({status: "ok"}))
      .catch((error) => res.status(400).send(error));
  },
};
