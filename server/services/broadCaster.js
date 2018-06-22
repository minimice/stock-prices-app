'use strict';

const ElastiCache = require('../infrastructure/elasticache');
const Io = require('socket.io');

// I got carried away here, so I'm commenting this out for now :)
// const symbols = process.env.TICKERSYMBOLS || "BX,AAPL,MSFT,SPY,FB";
// const stockChannels = symbols.split(',');

const tickerSymbol = process.env.TICKERSYMBOL || "SPY";
const cacheServer = process.env.CACHESERVER || 'localhost:11211';

function BroadCaster(http) {
  const elastiCache = new ElastiCache({
    Server: cacheServer
  });
  const io = new Io(http);

  // Events
  io.on('connection', function(socket) {
    console.log('A user connected');
    //stockChannels.forEach(tickerSymbol => _broadcastStockToClient(tickerSymbol, socket));
    _broadcastStockToClient(socket);
    socket.on('disconnect', function(){
      console.log('A user disconnected');
    });
  });

  var lastUpdated = 0;
  var lastPrice = 0;

  function _broadcastStockToClient(socket) {
    console.log("Trying to broadcast to client...");
    return elastiCache.getKeyValue(tickerSymbol, (err, cacheData) => {
      if (err) {
        console.log("Error occured: %s", err);
        return null;
      }
      if (cacheData) {
        // decorate it with the ticker symbol and change
        cacheData.ticker = tickerSymbol;
        cacheData.change = 0;
        socket.emit('update', cacheData);
        console.log("Client broadcast");
        console.log(cacheData);
        return cacheData;
      } else {
        // quotes are not available
        return null;
      }
      return null;
    });
  }

  return {
    broadcastStock() {
      return elastiCache.getKeyValue(tickerSymbol, (err, cacheData) => {
        if (err) {
          console.log("Error occured: %s", err);
          return null;
        }
        if (cacheData) {
          var timeChanged = cacheData.timestamp != lastUpdated;
          if (timeChanged) {
            // decorate it with the ticker symbol and change
            cacheData.ticker = tickerSymbol;
            cacheData.change = cacheData.price - lastPrice;
            io.emit('update', cacheData);
            lastUpdated = cacheData.timestamp;
            lastPrice = cacheData.price;
            console.log("All broadcast");
            console.log(cacheData);
          }
          return null;
        } else {
          // quotes are not available
        }
      });
    }
  }
}

module.exports = BroadCaster;
