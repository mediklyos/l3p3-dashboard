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
