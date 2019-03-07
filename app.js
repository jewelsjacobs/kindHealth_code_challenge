const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// simple error handler
function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).res.json({
    status: "error"
  });
}

app.use(cors());
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(errorHandler);

require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Nothing to see here. Not doing any fancy 404 stuff'
}));

module.exports = app;
