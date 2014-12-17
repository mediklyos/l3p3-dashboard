/**
 * Created by paco on 2/09/14.
 */
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