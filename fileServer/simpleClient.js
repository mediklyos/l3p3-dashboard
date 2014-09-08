/**
 * Created by paco on 2/09/14.
 */
var http = require('http');
var fs = require ('fs')
var options = {
    port: 1337,
    hostname: '127.0.0.1',
    method: 'CONNECTION'
};

var req = http.request(options);
req.end();

req.on('connect', function(res, socket, head) {
    console.log('got connected!');
    socket.on('data', function(chunk) {
        console.log(chunk.toString());
    });
    socket.on('end', function() {
        console.log("Finished")
    });
});
