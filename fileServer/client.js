/**
 * Created by paco on 2/09/14.
 */
var http = require('http');
var fs = require ('fs')
var options = {
    port: 1337,
    hostname: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80'
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


return;

var http = require('http');
// make a request to a tunneling proxy
var options = {
    port: 5050,
    hostname: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80'
};
var req = http.request(options);
req.end();

req.on('connect', function(res, socket, head) {
    console.log('got connected!');

    // make a request over an HTTP tunnel
//    socket.write('GET / HTTP/1.1\r\n' +
//        'Host: www.google.com:80\r\n' +
//        'Connection: close\r\n' +
//        '\r\n');
    var rdStream= fs.createReadStream("../dashboard/data/random-data/10M/csv0.csv");
    console.log("aqui")
    socket.pipe(rdStream);
    socket.on('data', function(chunk) {
        console.log(chunk.toString());
    });
    socket.on('end', function() {
//        proxy.close();
    });
});

return;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
var xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","http://localhost:5000/data/random-data/10M/csv0.csv",false)
xmlhttp.setRequestHeader("part","0");
xmlhttp.send()
console.log(xmlhttp.responseText)
//xmlhttp.setRequestHeader("part","1");
//xmlhttp.send()
//console.log(xmlhttp.responseText)