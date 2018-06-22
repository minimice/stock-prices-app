'use strict';

const ElastiCache = require('../infrastructure/elasticache');

const elastiCache = new ElastiCache({
  Server: process.env.CACHESERVER || 'localhost:11211'
});

const cacheKeyLifetime = process.env.CACHEKEYLIFETIME || 86400;
console.log("Cache key lifetime (seconds) : %s", cacheKeyLifetime);

function _handle(msg) {
  //console.log('Handling stock-price-updated. Message: %s', JSON.stringify(msg, null, 4));
  const stockTicker = msg.body.ticker;
  const stockTickerPrice = {
    price: msg.body.price,
    timestamp: msg.body.timestamp
  };
  return elastiCache.getKeyValue(stockTicker, (err, cacheData) => {
    if (err) {
      console.log('Error occured: %s', err);
      return null;
    }
    var needCacheRefresh = false;
    if (cacheData) {
      needCacheRefresh = cacheData.timestamp < stockTickerPrice.timestamp;
    }
    if (!cacheData) {
      console.log('%s adding with timestamp: %s (cache miss)', stockTicker, stockTickerPrice.timestamp);
      return elastiCache.addKeyValue(stockTicker, stockTickerPrice, cacheKeyLifetime, (err) => {
        if (err) {
          console.log('Error occured: %s', err);
        }
      });
    } else if (needCacheRefresh) {
      // outdated timestamp, update the cache
      console.log('%s replacing with timestamp: %s (cache refresh)', stockTicker, stockTickerPrice.timestamp);
      return elastiCache.replaceKeyValue(stockTicker, stockTickerPrice, cacheKeyLifetime, (err) => {
        if (err) {
          console.log('Error occured: %s', err);
        }
      });
    }
    return null;
  });
}

module.exports = {
  handle: _handle,
};