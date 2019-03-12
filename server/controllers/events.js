const eventServices = require('../services').events;

module.exports = {
  create(req, res) {
    const { user, type, message = null, otheruser = null, date } = req.body;
    return eventServices
      .create({ user, type, message, otheruser, date })
      .then(() => res.status(200).json({status: "ok"}))
      .catch((error) => res.status(400).send(error));
  },

  list(req, res) {
    return eventServices
      .list({to: req.query.to, from: req.query.from})
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => res.status(400).send(error));
  },

  summary(req, res) {
    return eventServices
      .summary({by: req.query.by, to: req.query.to, from: req.query.from})
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => res.status(400).send(error));
  },

  clear(req, res) {
    return eventServices
      .clear()
      .then(() => res.status(200).json({status: "ok"}))
      .catch((error) => res.status(400).send(error));
  },
};
