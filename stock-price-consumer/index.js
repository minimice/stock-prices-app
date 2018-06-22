'use strict';

const listener = require('./listeners/price-listener');
const stockPriceHandler = require('./handlers/price-handler');
const controllers = require('./controllers');
const express = require('express');

const app = express();
const port = process.env.PORT || 4001;
const tickerSymbol = process.env.TICKERSYMBOL || 'SPY';

// Start processing queue messages
(function waitForMessage() {
  var message;

  listener.receiveSingleMessage().then((msg) => {
      message = msg;
      if (!message) {
        return null;
      }
      //console.log('Received %s. Full content: %s', message.subject, JSON.stringify(message));
      
      switch (message.subject) {
        case 'stock-price-updated':
          if (msg.body.ticker === tickerSymbol) { // only handle one ticker
            return stockPriceHandler.handle(message);
          } else {
            return null;
          }
        default:
          console.log('Unhandled message: %s', JSON.stringify(message));
          return null;
      }
    }).then(() => {
      if (!message) {
        return null;
      }
      return listener.deleteMessage(message.receiptHandle).then((data) => {
        //console.log('Processed and removed message.');
      });
    }).catch((err) => {
      console.log('An error occurred: %s', err);
      if (message && message.receiptHandle) {
        return listener.deleteMessage(message.receiptHandle).then((data) => {
          console.log('Removed message. %s. SQS response: %s', JSON.stringify(message), JSON.stringify(data));
        });
      }
    })
    .then(waitForMessage);
}());

app.use('/', controllers);
app.listen(port, function() {
  console.log('Stock price consumer listening on port %s', port);
});