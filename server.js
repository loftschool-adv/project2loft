#!/usr/bin/env node

/**
 * Module dependencies.
 */

let config = require('./config.json');
let app = require('./app.js');
let debug = require('debug')('project2loft:server');
let http = require('http');


/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || config.http.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

let io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log('user connected');
  socket.on('eventServer', function (data) {
    console.log(data);
    socket.emit('eventClient', { data: 'Hello Client' });
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports.io = io;