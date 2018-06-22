'use strict';

const router = require('express').Router();
const tickerSymbol = process.env.TICKERSYMBOL || 'SPY';

router.get('/', function(req, res) {
	res.send('Stock price consumer for stock ticker symbol ' + tickerSymbol);
});

router.get('/api/monitoring/ping', function(req, res) {
	res.send('PONG!');
});

module.exports = router;
