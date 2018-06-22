'use strict';

const router = require('express').Router();

router.get('/', function(req, res) {
  res.send('Stock quotes server');
});

router.get('/api/monitoring/ping', function(req, res) {
	res.send('PONG!');
});

module.exports = router;
