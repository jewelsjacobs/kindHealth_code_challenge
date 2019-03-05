'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const amountOfEvents = 50;
    const events = [];
    for (let i = 0; i < amountOfEvents; i++) {
      const singleEvent = {
        date: faker.date.recent(30),
        user: faker.name.findName(),
        type: faker.random.arrayElement(["highfive", "comment", "enter", "leave"]),
      };

      if (singleEvent.type === "highfive") {
        singleEvent.otheruser = faker.name.findName();
      }

      if (singleEvent.type === "comment") {
        singleEvent.message = faker.lorem.words();
      }

      events.push(singleEvent);
    }
    return queryInterface.bulkInsert('events', events, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {});
  }
};

