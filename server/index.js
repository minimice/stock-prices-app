'use strict';

const express = require('express');
const controllers = require('./controllers');
const port = process.env.PORT || 5000;
const BroadCaster = require('./services/broadCaster');
const Http = require('http');
const app = express();
const http = new Http.Server(app);
const broadCaster = new BroadCaster(http);

app.use('/', controllers);
http.listen(port, function(){
  console.log('Stock quotes server listening on port %s', port);
});

setInterval(() => broadCaster.broadcastStock(), 0);

