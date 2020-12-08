const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http')
const config = require('config')
const winston = require('winston')
const WssModel = require('./models/wss-model')
const index = require('./routes/index');

const app = express();
app.use(bodyParser.json())

// start WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
WssModel.wss = wss
server.listen(config.get('ws-port'), () => {
  winston.info(`Listening WebSockets on ${server.address().port}`)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
