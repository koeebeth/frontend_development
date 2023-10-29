const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const fs = require('fs');

const config = require('./config/config.js');

if (!fs.existsSync(config['MEDIA_DIRECTORY'])) {
  fs.mkdirSync(config['MEDIA_DIRECTORY'], {recursive: true});
}

if (!fs.existsSync(config['TMP_DIRECTORY'])) {
  fs.mkdirSync(config['TMP_DIRECTORY'], {recursive: true});
}

const app = express();

const db = require('./models/index.js');

db.sequelize.sync().then(async function () {
  console.log('Database ready');
});

// Middlewares
app.use(helmet());
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const restRouter = require('./routes/index.js');

app.use('/api/v1', restRouter);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({error: true, message: err.message});
    return;
  } else if(typeof err.name !== "undefined") {
    res.status(500).send({error: true, message: 'Server error.'});
    return;
  }
  next();
});

module.exports = app;

