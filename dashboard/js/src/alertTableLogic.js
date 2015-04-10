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
var AT_ROW_SELECTED =    PRE + "-selected-row";

var AT_ID_PREFIX_ALERTS = PRE + "-alert-"

/*WS commands*/
var AT_WS_EVENT = "event"
var AT_WS_PREDICTION = "prediction"
var AT_WS_MODEL = "model";

var AT_WS_INTERCEPT = "intercept"
var AT_WS_TIME = "time"
var AT_WS_BEFORE = "before"
var AT_WS_AFTER = "after"
var AT_WS_EVENT_WEIGHTS = "events"
var AT_WS_EVENT_WEIGHT = "weight"
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
var AT_ORDER_BY_NAME = 1;
var AT_ORDER_BY_ORIGIN = 2;
var AT_ORDER_BY_ALERT = 3;
var AT_ORDER_BY_PREDICTION = 4;
var AT_ORDER_BY_START_DATE = 5;
var AT_ORDER_BY_END_DATE = 6;
//var AT_ORDER_BY_NAME = "byName";
/**/
/*
 * Alert:
 *  - name: String
 *  - alertStart: int
 * - alertStop: int
 * - origin: string
 * - prediction: float
 * - alertStatus: boolean
 */
var atAlertEvents = {}
var atAlertsSorted = [];
var atAlertsSortBy = [AT_ORDER_BY_NAME,AT_ORDER_BY_ALERT,AT_ORDER_BY_PREDICTION,AT_ORDER_BY_ORIGIN,AT_ORDER_BY_START_DATE,AT_ORDER_BY_END_DATE];
var wss = {}
var finish = false;
var dateGranularity = 3; // 1 seconds, 2 minutes, 3 hour, 4 day, 5 month, 6 year


var atModifySortByList = function (parameter, list) {
    var newList = [];
    if (Math.abs(list[0]) == parameter ){
        newList.add(- list[0])
    } else {
        newList.add(parameter)

    }
    for (var oldItem in list) {
        if (Math.abs(list[oldItem]) != parameter && list[oldItem] != parameter) {
            newList.add(list[oldItem])
        }
    }
    return newList;
}
/*DEBUG VARS*/
if (GLOBAL_DEBUG) {
    var url = "ws://localhost:2345/summary/"
}
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

    drawTableElements();

}

var atDebugRoutines = function (){


    console.log("Debug Routine");
    var newWs = {};
    var origin = "origin1"
    newWs.origin = origin;
    newWs.ws = createWS(url,origin);
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
        var message;
        try {
            message = eval('('+ e.data+')');
        } catch (e) {
            at_print("Incorrect message format, Use JSON format." + messageReceived)
            return;
        }
        if (message instanceof Array) {
            message.forEach(function (event) {
                registerEvent(event,ws.wsOrigin);
            })
        } else {
            registerEvent(message,ws.wsOrigin);
        }
        atRefreshAlertTable() ;
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

var registerEvent = function (message,origin) {
    switch (message.command) {
        case AT_WS_MODEL :
            var eventName = message[AT_WS_EVENT];
            var before = message[AT_WS_BEFORE];
            var after = message[AT_WS_AFTER];
            var eventWeights = message[AT_WS_EVENT_WEIGHTS];
            var intercept = message[AT_WS_INTERCEPT];
            var event = atAlertEvents [eventName];
            if (event === undefined){
                event = {}
                atAlertEvents[eventName] = event;
                atAlertsSorted.push(event);
            }
            event.name = eventName;
            atAlertEvents [eventName] = event;
            event.alertStatus = false;
            event.before = before;
            event.after= after;
            event.intercept = intercept;
            event.eventWeights = []
            eventWeights.forEach(function(e) {
                var eventWeight = {}
                eventWeight.name = e[AT_WS_EVENT];
                eventWeight.name = e[AT_WS_EVENT_WEIGHT];
                eventWeights.push(eventWeight)
                event.selected = false;
            })

            break;
        case AT_WS_PREDICTION :
            var eventName = message[AT_WS_EVENT];
            var timeOut = message[AT_WS_ALERT_TIMEOUT]
            var timeNow = message[AT_WS_TIME];
            var event = atAlertEvents [eventName];
            var prediction = Math.round(parseFloat(message[AT_WS_PREDICTION]) * 10000) /100.0;
            if (event === undefined){
                var event = {}
                event.name = eventName;
                atAlertsSorted.push(event);
                atAlertEvents [eventName] = event;
                event.alertStatus = false;
                event.alertStart = timeNow;
                event.after= 0;
                event.before = 0;
                event.intercept = 0;
                event.eventWeights = []
                event.selected = false;
            }
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
                atAlertsSorted.push(event);
                atAlertEvents [eventName] = event;
                event.alertStatus = false;
                event.alertStart = timeNow;
                event.after= 0;
                event.before = 0;
                event.intercept = 0;
                event.eventWeights = []
                event.selected = false;
            }
            var alertStatus = message[AT_WS_ALERT] == AT_WS_ALERT_ON;
            if (alertStatus) {
                event.origin = origin;
                if (event.alertStatus != alertStatus) {
                    event.alertStart = timeNow;
                    event.alertStatus = alertStatus;
                }
                event.alertStop = parseInt(timeNow) + parseInt(timeOut);

            } else {
                event.alertStart = "";
                event.alertStatus = alertStatus;
                event.alertStop = "";
            }
            break;
    }
    event.origin = origin;



}

var sortAlerts = function () {
    at_print("sort order: "+atAlertsSortBy);
    //atAlertsSortBy = atModifySortByList(atAlertsSortBy,sortBy)
    atAlertsSorted.sort(function (eventA,eventB) {
        for (var key in atAlertsSortBy) {
            /*First, selected sort!*/
            if (eventA.selected != eventB.selected) {
                if (eventA.selected) {
                    return -1
                }
                return 1;
            }
            var result = compareAlertsBy(eventA,eventB,atAlertsSortBy[key]);
            if (result != 0) {
                return result;
            }
        }
        return 0;
    })
}
/*
 * Alert:
 *  - name: String
 *  - alertStart: int
 * - alertStop: int
 * - origin: string
 * - prediction: float
 * - alertStatus: boolean
 */
var compareAlertsBy = function (eventA,eventB,compareBy) {
    switch (compareBy) {
        case AT_ORDER_BY_ALERT :
        case -AT_ORDER_BY_ALERT :
            if (eventA.alertStatus == eventB.alertStatus) {
                return 0;
            }
            return compareBy * (eventA.alertStatus)?-1:1;
        case -AT_ORDER_BY_END_DATE :
        case AT_ORDER_BY_END_DATE :
            if (eventA.alertStop == "" && eventB.alertStop == "") {
                return 0;
            } else if (eventA.alertStop == "") {
                return 1;
            } else if (eventB.alertStop == "") {
                return -1;
            }


            return compareBy * (eventA.alertStop - eventB.alertStop)
        case -AT_ORDER_BY_NAME :
        case AT_ORDER_BY_NAME :
            return compareBy * (eventA.name.localeCompare(eventB.name))
        case -AT_ORDER_BY_ORIGIN :
        case AT_ORDER_BY_ORIGIN :
            return compareBy * (eventA.origin.localeCompare(eventB.origin))
        case -AT_ORDER_BY_PREDICTION :
        case AT_ORDER_BY_PREDICTION :
            return compareBy * (eventB.prediction - eventA.prediction)
        case -AT_ORDER_BY_START_DATE :
        case AT_ORDER_BY_START_DATE :
            if (eventA.alertStart == "" && eventB.alertStart == "") {
                return 0;
            } else if (eventA.alertStart == "") {
                return 1;
            } else if (eventB.alertStart == "") {
                return -1;
            }
            return compareBy * (eventA.alertStart - eventB.alertStart)
        default :
            return 0;
    }


}


var atRefreshAlertTable = function () {
    sortAlerts();
    var alertTable = $("#"+AT_TABLE_LEFT).find('tbody');
    var templateRow = alertTable.find("."+DASHBOARD_TEMPLATES);
    templateRow.detach();
    alertTable.empty();
    alertTable.append(templateRow)
    var alerts = []
    atAlertsSorted.forEach(function (event){
        var alertRow = templateRow.clone().removeClass(DASHBOARD_TEMPLATES);
        if (event.selected) {
            alertRow.addClass(AT_ROW_SELECTED);
        }
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

var atAlertSortByAlert = function () {
    atAlertsSortBy = atModifySortByList(AT_ORDER_BY_ALERT, atAlertsSortBy);
    atRefreshAlertTable();
}
var atAlertSortByEndDate = function () {
    atAlertsSortBy = atModifySortByList(AT_ORDER_BY_END_DATE, atAlertsSortBy);
    atRefreshAlertTable();
}
var atAlertSortByName = function () {
    atAlertsSortBy = atModifySortByList(AT_ORDER_BY_NAME, atAlertsSortBy);
    atRefreshAlertTable();
}
var atAlertSortByOrigin = function () {
    atAlertsSortBy = atModifySortByList(AT_ORDER_BY_ORIGIN, atAlertsSortBy);
    atRefreshAlertTable();
}
var atAlertSortByPrediction = function () {
    atAlertsSortBy = atModifySortByList(AT_ORDER_BY_PREDICTION, atAlertsSortBy);
    atRefreshAlertTable();
}
var atAlertSortByStartDate = function () {
    atAlertsSortBy = atModifySortByList(AT_ORDER_BY_START_DATE, atAlertsSortBy);
    atRefreshAlertTable();
}


var selectAlertRow = function (target){
    while (target.nodeName != "TR") {
        target = target.parentNode;
        if (target == undefined) {
            return;
        }
    }
    //var newEvent = target.id.replace(AT_ID_PREFIX_ALERTS,"");
    //var oldEvent = oldElement[0].id;
    var oldElement = $("#"+AT_TABLE_LEFT).find("."+AT_ROW_SELECTED)
    var id = target.id.replace(AT_ID_PREFIX_ALERTS,"");
    if (atAlertEvents[id]) {
        atAlertEvents[id].selected = true;
    }
    target = $(target);
    target.addClass(AT_ROW_SELECTED)
    oldElement.removeClass(AT_ROW_SELECTED)
    oldElement.each(function(key,value) {
        var oldId = value.id.replace(AT_ID_PREFIX_ALERTS,"");
        if (atAlertEvents[oldId]) {
            atAlertEvents[oldId].selected = false;
        }
    })
    atRefreshAlertTable();


}