'use strict';

const router = require('express').Router();
const stockPricesServer = process.env.SERVER || 'http://localhost:5000/';

router.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

router.get('/api/monitoring/ping', function(req, res) {
	res.send('PONG!');
});

router.get('/config', function(req,res) {
  const config = {
    server : stockPricesServer
  };
  res.send(config);
});

module.exports = router;
