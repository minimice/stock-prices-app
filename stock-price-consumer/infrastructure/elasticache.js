'use strict';

const Memcached = require('memcached');

function ElastiCache(options) {
  const memcached = new Memcached(options.Server);
  return {
    getKeyValue(key, cb) {
      memcached.get(key, (err, data) => cb(err,data));
    },
    addKeyValue(key, value, lifetimeInSeconds, cb) {
      memcached.add(key, value, Number(lifetimeInSeconds), (err) => cb(err));
    },
    replaceKeyValue(key, value, lifetimeInSeconds, cb) {
      memcached.replace(key, value, Number(lifetimeInSeconds), (err) => cb(err));
    }
  }
}

module.exports = ElastiCache;