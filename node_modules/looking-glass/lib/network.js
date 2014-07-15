var rtcDataStream = require('rtc-data-stream')
var quickconnect = require('rtc-quickconnect')
var DuplexEmitter = require('duplex-emitter')

module.exports = establishNetwork


function establishNetwork( callback ) {

  var qc = quickconnect('http://rtc.io/switchboard/')
  
  // tell quickconnect we want a datachannel called primary
  qc.createDataChannel('primary')
  // when the primary channel is open, let us know
  qc.on('channel:opened:primary', function(id, dc) {
    var streamToPeer = rtcDataStream( dc )
    var peer = DuplexEmitter( streamToPeer )
    callback( peer )
  });

}