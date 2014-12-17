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
 * Created by paco on 30/09/14.
 */
var fs = require ('fs')
var csv = require("fast-csv");
var WebSocketServer = require('ws').Server;

var dataCols = undefined;
var events = []
var nEvent = 0;
var file = fs.openSync("data2.csv","w")
var string = "";
var tiempoAnterior = NaN;
var ultimaPosicion = 0;
csv.fromPath("data/data_unorder.csv")
    .on('start',function () {
        nEvent = 0;
    })
    .on("data",function(data){
        if (dataCols === undefined){
            dataCols = data;
            string = '"'+data[0]+'","'+data[1]+'","'+data[2]+'"\n'
            fs.writeSync(file,string)
            string = "";

        } else {
            events[nEvent] = {}
            events[nEvent][dataCols[0]] = data[0];
            events[nEvent][dataCols[1]] = new Date(data[1]);
            events[nEvent][dataCols[2]] = data[2];
            if(events[ultimaPosicion].date < events[nEvent].date){
                var pos = nEvent;
                for (var i = ultimaPosicion; i < nEvent;i++){
                    pos--
                    var day = events[i].date.getDate()
                    if (day < 10) {
                        day = "0"+day;
                    }
                    var month = events[i].date.getMonth()+ 1;
                    if (month< 10) {
                        month = "0"+month;
                    }
                    var hour = events[i].date.getHours();
                    if (hour < 10) {
                        hour = "0"+hour
                    }
                    var minute = events[i].date.getMinutes();
                    if (minute < 10) {
                        minute = "0"+minute
                    }
                    var second = events[i].date.getSeconds();
                    if (second < 10) {
                        second = "0"+second
                    }



                    var date = events[i].date.getFullYear() + "-" + month +"-" + day+ " " +
                        hour + ":" + minute + ":" + second
                    string = '"'+(pos+1)+'",'+date+',"'+events[i][dataCols[2]]+'"\n' + string;

                }
                fs.writeSync(file,string)
                string = "";
                ultimaPosicion = nEvent + 1


            } else {
//                string = '"'+data[0]+'",'+data[1]+',"'+data[2]+'"\n' + string
            }
            nEvent++;
        }
    })
    .on("end",function () {
        console.log(nEvent)
    })
