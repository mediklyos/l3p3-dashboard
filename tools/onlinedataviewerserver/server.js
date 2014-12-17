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
var TIME_OUT = 500;

var fs = require('fs');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: (process.env.PORT || 8080)});

var ip, resource;
var websockets=[];
var line_csv=1;
var timeoutFunction = function (ws,line,data) {
    ip =ws.upgradeReq.connection.remoteAddress;
    console.log("Sending data to  " + ip + "   :" + data[line]);
    if (!ws.isClose) {
        ws.send(data[line]);
        line++;
        line_csv=line;
        if(line==data.length){
            line=1;
        }
        setTimeout(timeoutFunction.bind(this,ws,line,data),TIME_OUT)
    }
    //try {
    //} catch (e) {
    //    console.log("Exceptio catched: " + e)
    //}
}

wss.on('connection', function (ws) {
    ws.isClose = false;
    ws.send('');
    websockets.push(ws);
    var route = "nodes.csv"; //path to the .csv file to broadcast
    fs.readFile(route, 'utf8', function (err, data) {
        var data2 = data.split("\n");
        ws.send(data2[0]);
        setTimeout(timeoutFunction.bind(this,ws,line_csv,data2),TIME_OUT);
    });
    ws.on('message', function(message) {
        console.log('received: %s', message);
        if(!isNaN(parseFloat(message)) && isFinite(message)) {
            //if a number is received, then it is a new timeout value
            TIME_OUT = message * 10;
        }
        else if(message!="Color Map request"){
            //if no ColorMap request, then a resource name has been received
            resource=message;
            console.log("Resource "+resource+" has been stored");
             for(var i=0;i<websockets.length;i++)
                 //broadcasts the new resource to all machines
                 if (websockets[i].isClose) {
                     console.log("size" + console.log)
                     websockets.splice(i, 1);
                 } else {
                     websockets[i].send(resource);
                 }
        }
        else if(resource!=undefined){
            //if a ColorMap request if received, send the resource if there is one (else does nothing)
            ws.send(resource);
            console.log("Resource "+resource+" has been sent");
        }
    });
    ws.on('close', function (message) {
        ws.isClose = true;
    });
});
