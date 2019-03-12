const _ = require('lodash');
const faker = require('faker');

module.exports = {

  createEvents: () => {
    return new Promise((resolve, reject) => {
      try {
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

          events.push({
            model: 'event',
            data: singleEvent
          });
        }

        resolve(events);
      } catch(error) {
        reject(error);
      }

    });
  },

  serializeDate(date) {
    let formattedDate = date;

    if (_.indexOf(date, " ") !== -1) {
      formattedDate = _.replace(date, /\s/g, "-");
    } else if (_.indexOf(date, "-") === -1) {
      const year = _.join(_.take(date, 4), "");
      const month = _.join(_.slice(date, 5, 7), "");
      const day = _.join(_.slice(date, 8, 10), "");
      const remaining = _.join(_.slice(date, -10), "");
      formattedDate = `${year}-${month}-${day}${remaining}`;
    }

    return formattedDate;
  },

};
