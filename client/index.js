'use strict';

const express = require('express');
const port = process.env.PORT || 6001;
const app = express();
const path = require('path');
const controllers = require('./controllers');

// Serve files in public folder as root
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', controllers);
app.listen(port, function() {
  console.log('Client listening on port %s', port);
});