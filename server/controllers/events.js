const Event = require('../models').event;
const Sequelize = require('sequelize');
let db  = require('../models/index');
const Op = Sequelize.Op;

/*
* datetime rounded to the preceding time in ISO 8601 format.
* 1985­10­26T09:01:55Z​ would roll up to ​1985­10­26T09:01:00Z​ for the minute,
* 1985­10­26T09:00:00Z​ for the hour, and
* ​1985­10­26T00:00:00Z ​for the day.
*
* Splits up into arrays:
*
* dateTimeStringArray = [1985­10­26T09, 01, 55Z​]
* dayArray = [1985­10­26, 09:01:55Z​]
*
* and reconstructs new datetime
*/
function formatRollup({dateTimeString, timeFrame}) {
  const dateTimeStringArray = dateTimeString.split(':');
  const dayArray = dateTimeString.split('T');
  switch (timeFrame) {
    case "minute":
      dateTimeStringArray[2] = "00Z​";
      return dateTimeStringArray.join(':');
    case "hour":
      dateTimeStringArray[2] = "00Z​";
      dateTimeStringArray[1] = "00";
      return dateTimeStringArray.join(':');
    case "day":
      dayArray[1] = "00:00:00Z";
      return dayArray.join('T');
    default:
      return dateTimeString;
  }
}

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
    console.log({ user, type, message, otheruser, date });
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
      .then((events) => res.status(200).send(events))
      .catch((error) => res.status(400).send(error));
  },

  summary(req, res) {
    return db.sequelize.query(rawSQLQueury,
      { replacements: [req.query.by, req.query.from, req.query.by, req.query.to], type: db.sequelize.QueryTypes.SELECT }
    ).then((events) => {
      events.map((event, i) => {
        (event.comments === null) ? event.comments = 0 : event.comments;
        (event.leaves === null) ? event.leaves = 0 : event.leaves;
        (event.highfives === null) ? event.highfives = 0 : event.highfives;
        (event.enters === null) ? event.enters = 0 : event.enters;
      });
      res.status(200).send(events);
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
