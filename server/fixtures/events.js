const sequelize_fixtures = require('sequelize-fixtures');
const eventServices = require('../services').events;
const eventUtils = require('../utils').events;

const models = require('../models');

module.exports = {

  loadDb: eventUtils.createEvents()
    .then((events) => {
      try {
        return sequelize_fixtures.loadFixtures(events, models);
      } catch (error) {
        return error;
      }
    })
    .catch((err) => {
      return err;
    }),

  clearDb: eventServices.clear()
};
