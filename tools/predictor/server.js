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
 * Created by paco on 26/09/14.
 */

/* DEBUG */
var DEBUG = true;
var modeTimeFirstEvent = true;
var thisTime = 1;

/*Modules */
var fs = require ('fs')
var csv = require("fast-csv");
var WebSocketServer = require('ws').Server;
var port = process.env.PORT || 10081;
var wss = new WebSocketServer({port: port});

//var transform = require('stream-transform');
/*Configuration vars*/
var prediction_time = 5 * 60 * 1000 // 5 min = 5 * 60 seconds * 1000 milliseconds
var prediction_time = 5 * 1000 // 5 min = 5 * 60 seconds * 1000 milliseconds

//Global variables
var interval_time = 1000;
var original_data=undefined;
var data = undefined;
var columns = undefined;
var targets = [];
var models = {};
var events = []
var timeStart = 0;
var intervalReduction = 1000;
var weight_vector;
var now;
var difference
var predictionLine = undefined;
var processed = []

/* Logistical regression functions: sigmoid, calculate_output*/
function sigmoid(input,used_weights,time,prediction_time){
    var sum = 0;
    for(var i=0; i< input.length; i++) {
        if ((time - parseInt(input[i])) <= prediction_time){
            processed.push(i);
            sum += parseInt(used_weights[i]);
        }
    }
    var result = 1/(1+Math.exp(-sum));
    return result;
}

/**
 *
 * @param target The id of the event
 * @param input The list of the weight of the each event. Each element of the list is the value of the last
 * @returns {*}
 */
function calculate_output(target,input,date,prediction_time){ //this takes a targets.length-1 array called input with 1s and 0s indicating the appearance or absence of events in the defined time window
    var weights_index = targets.indexOf(target);
    var used_weights  = models[weights_index].weights;
    // Ponemos date para que este dato siempre lo coje, en la función original añadía un uno.
    input[0] = date;
    var prediction = sigmoid(input,used_weights,date,prediction_time);
    return prediction;
}



/**
 * INit the weight vector, init teh values of the last occurrence of the event. The value set is -(prediction time -1)
 * this is because this events never have happened.
 * @param columns
 */
function initWeightVector(columns,prediction_time){
    var weightVector = []
    weightVector [0] = 0;
    for (var i = 1; i < columns.length;i++) {
//        weightVector[i] = {}
//        weightVector[i].lastOcurrence = -prediction_time - 1;
        weightVector[i] = -prediction_time - 1;
    }
    return weightVector;
}


var nModel = 0;

/* Load Moldel*/


var dataCols = undefined;
var nEvent = 0;


var start = function () {
    // Start to listen
    listen();
};

var initModel = function (eventProcessRoutine) {
    csv.fromPath("data/modelb5f5.csv")
        .on("data", function(data){
            if (columns === undefined){
                columns = data.slice(1);
                weight_vector = initWeightVector(columns,prediction_time);
            } else {
                models[nModel] = {}
                models[nModel].event   = data[0];
                models[nModel].weights = data.slice(1);
                targets[nModel] = data[0];
                nModel++;
            }
        })
        .on("end", function(){
            console.log("Model read");

            eventProcessRoutine();
        });
};

var updateWeightVector = function(weight_vector,event){
    var date = event.date;
    if (date === undefined){
        date = Date.now()
    }
    var weights_index = columns.indexOf(event.type);
    weight_vector[weights_index] = date;
}

var eventsProcessFromCSV = function (){
    /*Reading events*/
    nEvent = 0;
    events = []
    csv.fromPath("data/data.csv")
        .on("data",function(data){
            if (dataCols === undefined){
                dataCols = data;
            } else {
                events[nEvent] = {}
                events[nEvent][dataCols[0]] = data[0];
                events[nEvent][dataCols[1]] = new Date(data[1]).getTime();;
                events[nEvent][dataCols[2]] = data[2];
                nEvent++;
            }
        })
        .on("end",function (){
            now = Date.now();
            timeStart = events[0].date
            console.log(timeStart)
            difference  = now - timeStart;
            for (var i = 0; i < events.length;i++){
                var interval = (events[i].date - timeStart) //intervalReduction;
                setTimeout(function(interval){
                    console.log("Updating weight vector. Event={id:"+this.id + ", date:"+(this.date) + ", type:"+this.type+ "}. Interval1="+(Date.now() - now)+", Interval2="+interval);
                    updateWeightVector(weight_vector,this);
                }.bind(events[i],interval),interval)
            }

    });
}

var firstDebugListenEver5000 = function (){
    var string = targets[0];
    for (var i = 1; i < targets.length;i++){
        string += ","+targets[i]
    }
    console.log(string)
    setTimeout(debugListenEver5000,1000)
}

var listen  = function () {
    console.log("Listen in localhost:"+port)
    socketListen();
//    setTimeout(firstDebugListenEver5000,1000)
}

var socketListen = function (){
    var sendSocketFunction = function(content) {

    }
    //nodename.reourcename$min@max
    wss.on('connection', function (ws) {
        ws.isClosed = false;
        console.log('Creating connection')
        ws.send("");
//        ws.send("Event_65539.prediction$0@100");
        /*Iniciar el modelo con un vector de ocurrencia determinado*/
        initModel(eventsProcessFromCSV);
        var events = [
            {eventName:65539}
        ]
        sendBySocket(ws,events);
        ws.on('message',function (message) {
            console.log("message received")
        })
        ws.on('close',function (message){
            ws.isClosed = true;
        })
    })
}
var debugListenEver5000 = function (){
    setTimeout(debugListenEver5000,1000)
    var thisDate = (Date.now() - parseInt(difference))// * intervalReduction;
    var predictions = []
    var string = "";

    predictions[0] = calculate_output(targets[0],weight_vector,thisDate,prediction_time);
    string += Math.floor(predictions[0] * 100)+"%";
    for (var i = 1; i < targets.length;i++){
        processed = []
        predictions[i] = calculate_output(targets[i],weight_vector,thisDate,prediction_time);
        string += ","+Math.floor(predictions[i] * 100)+"%";
    }

    var count = 0;
    for (var i = 0; i < weight_vector.length;i++) {
        if (weight_vector[i] > 0) {
            count++
        }
    }

    predictionLine = predictions;
    var cad = "";
    for (var key in processed){
        cad += processed[key]+", "
    }
    console.log(string+", Registrados = "+ count + ", Procesados = "+cad)

}


/**
 * This function send a prediction result in a interval_time defined in the constants
 * @param vars, list of vars that must be sent {eventName}
 */
var sendBySocket = function (ws,vars){
//    setTimeout(debugListenEver5000,1000)
    /* Setting the difference time between the actual time and the start data time. Este código debe ser identificado c
    * debug*/

    if (vars.length <= 0){
        return;
    }
    var header = "Event:"+vars[0].eventName+".5min_prediction$0@100";
    for (var i = 1; i < vars.length; i++){
        header += ","+vars[0].eventName+".5_MinutesPrediction$0@100";
    }
    console.log(header)
    ws.send(header)
    setTimeout(predictionToWs.bind(this,ws,vars),interval_time)

}

var predictionToWs = function (ws,events){
    if (ws.isClosed){
        return
    }
    setTimeout(predictionToWs.bind(this,ws,events),interval_time)
    var thisDate = (Date.now() - parseInt(difference))// * intervalReduction;
    if ((events.length  === undefined) || (events.length == 0)){
        return;
    }
    var string = "";
    var prediction = calculate_output(targets[0],weight_vector,thisDate,prediction_time);
    string += Math.floor(prediction * 100);
    for (var i = 1; i < events.length;i++){
        prediction = calculate_output(targets[i],weight_vector,thisDate,prediction_time);
        string += ","+Math.floor(prediction[i] * 100);
    }
//    console.log(string)
    ws.send(string)

}

start();
return;


//Output calculation

