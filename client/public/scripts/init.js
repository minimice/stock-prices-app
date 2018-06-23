$(function () {
  $.ajax({
    url: "/config"
  }).then(function(data) {
    var socket = io(data.server);
    socket.on('update', function(msg){
      $('#symbol').text(msg.ticker);
      $('#price').fadeOut(500, () => {
        $('#price').text("$" + msg.price.toFixed(3));
        $('#price').fadeIn();
      });
      var diff = msg.change.toFixed(3);
      var change = (diff > 0 ? '+' : '') + diff;
      $('#change').text(change + " since last price change");
      $('#time').text("As of " + moment(msg.timestamp*1000).format('MMMM Do YYYY, h:mm:ssa'));
    });
    socket.on('disconnect', function(reason) {
      $('#status').fadeOut(500, () => {
        $('#status').text("🚨Currently offline.  Live quotes will show when a connection is re-established.");
        $('#status').fadeIn();
      });
    });
    socket.on('connect', function() {
      $('#status').fadeOut(500, () => {
        $('#status').text("⚡️Connected to live server.");
        $('#status').fadeIn();
      });
    })
  });
});