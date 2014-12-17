/*  Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var http = require('http');
var net = require('net');
var url = require('url');
var fs = require ('fs')
var fileServed = "../dashboard/data/random-data/10M/csv0.csv"

// Create an HTTP tunneling proxy
var proxy = http.createServer(function (req, res) {
    console.log("creating server function")
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay');
});
proxy.on('connect', function(req, cltSocket, head) {
    console.log("connect function")
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Node-Proxy\r\n' +
            '\r\n');
    // connect to an origin server
//    console.log ("Request from: "+req.url)
//    var srvUrl = url.parse('http://' + req.url);
//    var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function() {
//        cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
//            'Proxy-agent: Node-Proxy\r\n' +
//            '\r\n');
//        srvSocket.write(head);
//        srvSocket.pipe(cltSocket);
//        cltSocket.pipe(srvSocket);
    var rdStream= fs.createReadStream(fileServed);
//    cltSocket.write("hola")
    rdStream.pipe(cltSocket);
//    cltSocket.pipe(rdStream);
//    cltSocket.on('data', function (data){
//        cltSocket.write(data);
//    })

//    });
});

proxy.on('data',function (chuck){
    console.log("data function")
})
// now that proxy is running
proxy.listen(1337, function() {
    console.log("listen function")
    // make a request to a tunneling proxy

});


return;

var express = require('express')
var app = express();
var fs = require('fs');
var sizePerPart = 1000;

var http = require('http');

var server = http.createServer(function (req, res) {
    // req is an http.IncomingMessage, which is a Readable Stream
    // res is an http.ServerResponse, which is a Writable Stream

    var body = '';
    // we want to get the data as utf8 strings
    // If you don't set an encoding, then you'll get Buffer objects
    req.setEncoding('utf8');

    // Readable streams emit 'data' events once a listener is added
    req.on('data', function (chunk) {
        body += chunk;
    })
var http = require('http');
var net = require('net');
var url = require('url');

// Create an HTTP tunneling proxy
var proxy = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});
proxy.on('connect', function(req, cltSocket, head) {
  // connect to an origin server
  var srvUrl = url.parse('http://' + req.url);
  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function() {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node-Proxy\r\n' +
                    '\r\n');
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

// now that proxy is running
proxy.listen(1337, '127.0.0.1', function() {

  // make a request to a tunneling proxy
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

    // make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', function(chunk) {
      console.log(chunk.toString());
    });
    socket.on('end', function() {
      proxy.close();
    });
  });
});
    // the end event tells you that you have entire body
    req.on('end', function () {
        try {
            var data = JSON.parse(body);
        } catch (er) {
            // uh oh!  bad json!
            res.statusCode = 400;
            return res.end('error: ' + er.message);
        }

        // write back something interesting to the user:
        res.write(typeof data);
        res.end();
    })
})

server.listen(5050);
return;

var streams = {};


var dataPath = "../dashboard/data/"
var dataUrl = "/data/"

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
    response.send('Hello World!')
})
app.get(dataUrl+'*', function(request, response) {
    // replace first apperance of data
    var path = request.url.replace(new RegExp("/data/","g"),"")
    path = dataPath +path;
    var stats = fs.lstatSync(path);
    if (!fs.existsSync(path)) {
        // Resource not found
        response.send(404);
    } else if (!stats.isFile()){
        response.send(403);
    } else {
//        response.send("accediendo a los datos")
        var part = (request.header('part'))? 0:request.header('part');
        var streamId = new Buffer(request.connection.remoteAddress + request.url).toString("base64")
        // Check if a stream is closed and open again
        streams[streamId] = {}
        streams[streamId].stream = fs.createReadStream(path);

//            streams[streamId].timeRequest  = Date.now();
        streams[streamId].stream.pipe(response);
        if (streams[streamId] === undefined){

        } else {
//            response.send(500);
        }
//        fs.open(path,'r',function (err,file){
//            var size = stats.size;
////            size = sizePerPart;
//            var buffer = new Buffer(size);
//            var position = size * part;
////            var offset = sizePerPart * part;
//
//            fs.read(file,buffer,0,buffer.size,position, function (error,bytesRead,buffer) {
//                console.log(buffer.toString("ascii", 0, buffer.size))
//
//            })
//            if (err != null){
//                console.log("error open the file" + err)
//                response.send(500);
//            } else {
//                response.send(204);
//            }
//
//        })

    }

})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})
