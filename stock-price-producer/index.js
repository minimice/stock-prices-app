'use strict';

const express = require('express');
const controllers = require('./controllers');
const app = express();
const port = process.env.PORT || 4000;
const StockTickerProvider = require('./services/stockTickerProvider'); 
const stockTickerProvider = new StockTickerProvider();
stockTickerProvider.start();

app.use('/', controllers);
app.listen(port, function() {
  console.log('Stock price producer (live) listening on port %s', port);
});