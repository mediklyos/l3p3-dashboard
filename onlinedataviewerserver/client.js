//#!/usr/bin/nodejs

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

var url = process.argv[2] || "ws://localhost:8080";
url = 'ws://onlinedataviewerserver.herokuapp.com'
var WebSocket = require('ws') 
    , ws = new WebSocket(url);
ws.on('open', function() {

    ws.send('something');
    console.log('Open');
});
ws.on('message', function(message) {
    console.log('received: %s', message);
});






