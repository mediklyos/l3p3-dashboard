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
var fs = require ('fs')

var socket;

// Create an HTTP tunneling proxy
var proxy = http.createServer(function (req, res) {
    console.log("creating server function")
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();
});
proxy.on('connect', function(req, cltSocket, head) {
    console.log("connect function")
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: Node-Proxy\r\n' +
        '\r\n');

//    var rdStream= fs.createReadStream("../dashboard/data/random-data/100/csv0.csv");
//    rdStream.pipe(cltSocket);
});

proxy.on('request',function (request, response){
    console.log('request function');
//    var rdStream= fs.createReadStream("../dashboard/data/random-data/100/csv0.csv");
//    rdStream.pipe(socket);

})

proxy.on('connection', function(cltSocket) {
    console.log("connection")
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: Node-Proxy\r\n' +
        'Access-Control-Allow-Origin: *\r\n' +
        '\r\n');
    socket = cltSocket;
    var rdStream= fs.createReadStream("../dashboard/data/random-data/100/csv0.csv");
//    var rdStream= fs.createReadStream("../dashboard/data/random-data/1K/csv0.csv");
//    var rdStream= fs.createReadStream("../dashboard/data/random-data/10K/csv0.csv");
//    var rdStream= fs.createReadStream("../dashboard/data/random-data/100K/csv0.csv");
//    var rdStream= fs.createReadStream("../dashboard/data/random-data/1M/csv0.csv");
//    var rdStream= fs.createReadStream("../dashboard/data/random-data/10M/csv0.csv");
    rdStream.pipe(cltSocket);
});

proxy.listen(1337)
