/* Licensed to the Apache Software Foundation (ASF) under one
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
/*Constants*/
var PRE = views[0][6].constantsPrefix;
var AT_TABLE = PRE + "-table";
var AT_TABLE_LEFT = AT_TABLE + "-left";
var AT_CELL_EVENT =      PRE + "-cell-event";
var AT_CELL_ORIGIN =     PRE + "-cell-origin";
var AT_CELL_ALERT =      PRE + "-cell-alert";
var AT_CELL_PREDICTION = PRE + "-cell-prediction";
var AT_CELL_START =      PRE + "-cell-start";
var AT_CELL_END =        PRE + "-cell-end";
var AT_ALERT_CLASS =     "danger";

var AT_ID_PREFIX_ALERTS = PRE + "-alert-"

/*WS commands*/
var AT_WS_EVENT = "event"
var AT_WS_PREDICTION = "prediction"
var AT_WS_TIME = "time"
var AT_WS_BEFORE = "before"
var AT_WS_AFTER = "after"
var AT_WS_RESULT = "result"
var AT_WS_RESULT_HIT = "hit"
var AT_WS_RESULT_MISS_FALSE_POSITIVE = "miss-fp"
var AT_WS_RESULT_MISS_FALSE_NEGATIVE = "miss-fn"
var AT_WS_RESULT_HIT_CLASS = PRE + "-hit"
var AT_WS_RESULT_MISS_FALSE_POSITIVE_CLASS = PRE + "-miss-fp"
var AT_WS_RESULT_MISS_FALSE_NEGATIVE_CLASS = PRE + "-miss-fn"
var AT_WS_ALERT = "alert"
var AT_WS_ALERT_TIMEOUT = "timeout"
var AT_WS_ALERT_ON = "on"
var AT_WS_ALERT_OFF = "off"

var AT_VISUAL_ON = "on";
var AT_VISUAL_OFF = "off";

/**/
var AT_ORDER_BY_NAME = "byName";
var AT_ORDER_BY_ALERT = "byAlert";
var AT_ORDER_BY_START_DATE = "byStartDate";
var AT_ORDER_BY_END_DATE = "byEndDate";
//var AT_ORDER_BY_NAME = "byName";
/**/
var atAlertEvents = {}
var atAlertEventsSorted = [];
var wss = {}
var finish = false;
var atEventAlertsSortBy;
var dateGranularity = 3; // 1 seconds, 2 minutes, 3 hour, 4 day, 5 month, 6 year

var drawTableElements = function () {
    var tableLeft = $("#"+AT_TABLE_LEFT);
    //var eventTH = tableLeft.find("thead").find("."+AT_CELL_EVENT);
    //
    //var divContent = $('<spam/>').appendTo(eventTH);
    //createSetButtons("visibilityEvents",divContent ,["alerted","received","all"],"","",function(){},true);
    atEventAlertsSortBy = AT_ORDER_BY_NAME;
    console.log("here")


}

var atShowAlerted = function(){

}

var atShowReceived = function (){

}

var atShowAll = function (){

}

var atStartRoutines = function (){
    console.log("Start Routine");
    finish = false;
    alertOrder = AT_ORDER_BY_NAME;

    drawTableElements();

}

var atDebugRoutines = function (){
    var url = "localhost:2034/normal/"

    console.log("Debug Routine");
    var newWs = {};
    var origin = "origin1"
    newWs.origin = origin;
    newWs.ws = createWS('ws://' + url,origin);
    wss[newWs.origin] = newWs;
}

var createWS = function (url,origin) {
    var ws = new ReconnectingWebSocket(url);
    ws.wsOrigin = origin;
    ws.onopen = function (e) {
        at_print(e);
    }
    ws.onmessage = function (e){
        at_print(e);
        registerEvent(e.data,ws.wsOrigin);
    }
    ws.onclose = function (e) {
        at_print(e);
    }
    return ws;
}

var atResizeFunction = function (){
    at_print("Resize function");

}

var atClearFunction = function (){
    at_print("Clear function");
    finish = true;
    //forEach() eliminar los ws

    $(window).unbind('resize',atResizeFunction)

}

var registerEvent = function (messageReceived,origin) {
    var message;
    try {
        message = eval('('+ messageReceived+')');
    } catch (e) {
        at_print("Incorrect message format, Use JSON format." + messageReceived)
        //ws.send("Incorrect message format, Use JSON format." + messageReceived)
        return;
    }
    switch (message.command) {
        case AT_WS_PREDICTION :
            var eventName = message[AT_WS_EVENT];
            var timeOut = message[AT_WS_ALERT_TIMEOUT]
            var timeNow = message[AT_WS_TIME];
            var event = atAlertEvents [eventName];
            var prediction = parseInt(parseFloat(message[AT_WS_PREDICTION]) * 10000) /100.0;
            if (event === undefined){
                var event = {}
                event.name = eventName;
                atAlertEventsSorted.push(event);
                atAlertEvents [eventName] = event;
                event.alertStatus = false;
                event.alertStart = timeNow;
            }
            event.alertStop = parseInt(timeNow) + parseInt(timeOut);
            event.prediction = prediction;
            break;
        case AT_WS_ALERT :
            var eventName = message[AT_WS_EVENT];
            var timeOut = message[AT_WS_ALERT_TIMEOUT]
            var timeNow = message[AT_WS_TIME];
            var event = atAlertEvents [eventName];
            if (event === undefined){
                var event = {}
                event.name = eventName;
                atAlertEventsSorted.push(event);
                atAlertEvents [eventName] = event;
            }
            event.origin = origin;
            var alertStatus = message[AT_WS_ALERT] == AT_WS_ALERT_ON;
            if (event.alertStatus != alertStatus) {
                event.alertStart = timeNow;
                event.alertStatus = alertStatus;

            }
            event.alertStop = parseInt(timeNow) + parseInt(timeOut);
            sortEvents(atAlertEventsSorted,atEventAlertsSortBy);
            break;
    }

    atRefreshAlertTable(atAlertEventsSorted );

}



var sortEvents = function (events,sortBy) {
    switch (sortBy) {
        case AT_ORDER_BY_NAME :
            events.sort(function (eventA,eventB) {
                return eventA.name.localeCompare(eventB.name)
            })
            break;
        case AT_ORDER_BY_ALERT :
            events.sort(function (eventA,eventB){
                if (eventA.alertStatus == eventB.alertStatus){
                    return 0;
                } else if (eventA.alertStatus){
                    return -1;
                } else {
                    return 1;
                }

            })
            break;
        case AT_ORDER_BY_START_DATE :
            events.sort(function (eventA,eventB){
                return eventA.alertStart - eventB.alertStart;
            })
            break;
        case AT_ORDER_BY_END_DATE :
            events.sort(function (eventA,eventB){
                return eventA.alertStop - eventB.alertStop;
            })
            break;
    }
}

var sortEventByName = function (eventA,eventB) {

}

var atRefreshAlertTable = function (events) {
    var alertTable = $("#"+AT_TABLE_LEFT).find('tbody');
    var templateRow = alertTable.find("."+DASHBOARD_TEMPLATES);
    alertTable.find('tr').not(templateRow).remove();
    var alerts = []
    events.forEach(function (event){
        var alertRow = templateRow.clone().removeClass(DASHBOARD_TEMPLATES);
        alertRow.attr('id',AT_ID_PREFIX_ALERTS  + event.name)
        alertRow.find('.'+AT_CELL_EVENT).text(event.name);
        alertRow.find('.'+AT_CELL_START).text(formattedDate(event.alertStart));
        alertRow.find('.'+AT_CELL_END).text(formattedDate(event.alertStop));
        alertRow.find('.'+AT_CELL_ORIGIN).text(event.origin);
        if (event.prediction !== undefined) {
            alertRow.find('.' + AT_CELL_PREDICTION).text(event.prediction);
        }
        if (event.alertStatus !== undefined){
            if (event.alertStatus) {
                alertRow.find('.'+AT_CELL_ALERT).text(AT_VISUAL_ON);
                alertRow.addClass(AT_ALERT_CLASS);
            } else {
                alertRow.find('.'+AT_CELL_ALERT).text(AT_VISUAL_OFF);
            }
        }
        alerts.push(alertRow);
    })
    alerts.forEach(function (alertRow){
        alertRow.appendTo(alertTable);
    });
}

var at_print = function (string,info){
    if (GLOBAL_DEBUG || info){
        console.log(string)
    }
}

var formattedDate = function (dateLong) {
    if (dateLong === undefined || dateLong == ""){
        return "";
    }
    switch (dateGranularity) {
        case 6: return moment(dateLong).format("hh:mm:ss - DD/MM/YYYY");
        case 5: return moment(dateLong).format("hh:mm:ss - DD/MM");
        case 4: return moment(dateLong).format("hh:mm:ss - DD");
        case 3: return moment(dateLong).format("hh:mm:ss");
        case 2: return moment(dateLong).format("mm:ss");
        case 1: return moment(dateLong).format("ss");
        default: return "";
    }
}

var atAlertSortByName = function () {
    atEventAlertsSortBy = AT_ORDER_BY_NAME
    sortEvents(atAlertEventsSorted,atEventAlertsSortBy);
    atRefreshAlertTable(atAlertEventsSorted)
}
var atAlertSortByAlert = function () {
    atEventAlertsSortBy = AT_ORDER_BY_ALERT
    sortEvents(atAlertEventsSorted,atEventAlertsSortBy);
    atRefreshAlertTable(atAlertEventsSorted)
}
var atAlertSortByStartDate = function () {
    atEventAlertsSortBy = AT_ORDER_BY_START_DATE
    sortEvents(atAlertEventsSorted,atEventAlertsSortBy);
    atRefreshAlertTable(atAlertEventsSorted)
}
var atAlertSortByEndDate = function () {
    atEventAlertsSortBy = AT_ORDER_BY_END_DATE
    sortEvents(atAlertEventsSorted,atEventAlertsSortBy);
    atRefreshAlertTable(atAlertEventsSorted)
}