// Run with npm install and npm test after npm run up
// npm run up to run docker-compose
// npm run down to stop docker-compose
'use strict';

const service = require('superagent');
const expect = require('chai').expect;
const ElastiCache = require('./helpers/elasticache');

const elastiCache = new ElastiCache({
  Server: 'localhost:11211'
});

describe('system test', function () {
  beforeEach(function () {
    elastiCache.deleteKeyValue('SPY', (err) => {});
  });

  it('posts a message to SQS and message gets stored in the cache', function (done) {
    service.get('http://localhost:9324/queue/testqueue?Action=SendMessage&MessageBody={"Subject":"stock-price-updated","Message":"{\\"type\\":\\"last\\",\\"timestamp\\":1529623399.6673872,\\"ticker\\":\\"SPY\\",\\"size\\":200,\\"price\\":175}"}')
        .then(() => {
          setTimeout(() => elastiCache.getKeyValue('SPY', (err,data) => {
            //console.log(data);
            expect(data.price).to.equal(175);
            expect(data.timestamp).to.equal(1529623399.6673872);
            done();
          }),1000)
        })
        .catch(e => done(e));
  });
});