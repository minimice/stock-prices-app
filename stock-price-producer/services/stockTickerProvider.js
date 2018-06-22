'use strict';

const IntrinioRealtime = require('intrinio-realtime');
const HttpsProxyAgent = require('https-proxy-agent');
const SQS = require('../infrastructure/sqs');

// IntrinioRealtime
const username = process.env.INTRINIO_USER;
const password = process.env.INTRINIO_PASSWORD;
const proxyAgent = process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : false;
const symbols = process.env.TICKERSYMBOLS || "BX,AAPL,MSFT,SPY,FB";
const stockChannels = symbols.split(',');

// SQS
const queueUrl = process.env.QUEUEURL || 'http://localhost:9324/queue/testqueue';

function StockTickerProvider() {

  const stockTickerProvider = new IntrinioRealtime({
    username: username,
    password: password,
    agent: proxyAgent,
    provider: "iex"
  });

  const stockTickerQueue = new SQS({
    QueueUrl: queueUrl
  });

  return {
    start() {
      // Listen for quotes
      stockTickerProvider.onQuote(quote => {
        const { ticker, type, price, size, timestamp } = quote;
        
        // JSON output
        // {"type":"bid","timestamp":1529433900.4407654,"ticker":"MSFT","size":114,"price":100}

        // Only push last
        if (type === "last") {
        //if (type === "bid") {
          // push output to an SQS
          stockTickerQueue.pushAndWait('stock-price-updated', quote).catch(e => 
            console.log("SQS queue is not up, quotes will not be pushed until the queue is up.")
          );
          console.log("QUOTE: ", ticker, type, price, size, timestamp, Date.now());
        }
        //console.log("QUOTE: ", ticker, type, price, size, timestamp, Date.now());
      });

      // Join channels
      stockTickerProvider.join(stockChannels);

      return null;
    }
  }
}

module.exports = StockTickerProvider;