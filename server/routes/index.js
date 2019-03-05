const eventsController = require('../controllers').events;

module.exports = (app) => {
  app.post('/events', eventsController.create);

  app.get('/events', eventsController.list);

  app.get('/events/summary', eventsController.summary);

  app.post('/events/clear', eventsController.clear);
};
