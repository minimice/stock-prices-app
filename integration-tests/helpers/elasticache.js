'use strict';

const Memcached = require('memcached');

function ElastiCache(options) {
  const memcached = new Memcached(options.Server);
  return {
    getKeyValue(key, cb) {
      memcached.get(key, (err, data) => cb(err, data));
    },
    deleteKeyValue(key, cb) {
      memcached.del(key, (err) => cb(err));
    }
  }
}

module.exports = ElastiCache;