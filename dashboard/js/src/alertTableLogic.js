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
var PRE = views[0][6].constantsPrefix + "-";
var AT_CELL_EVENT         = PRE + "cell-event";
var AT_CELL_ORIGIN        = PRE + "cell-origin";
var AT_CELL_ALERT         = PRE + "cell-alert";
var AT_CELL_PREDICTION    = PRE + "cell-prediction";
var AT_CELL_START         = PRE + "cell-start";
var AT_CELL_END           = PRE + "cell-end";
var AT_CELL_TIME          = PRE + "cell-time";
var AT_CELL_WEIGHT        = PRE + "cell-weight";
var AT_CELL_RESULT        = PRE + "cell-result";
var AT_CELL_ALIAS         = PRE + "cell-alias";
var AT_CELL_DESCRIPTION   = PRE + "cell-description";
var AT_HOUR               = PRE + "hour";
var AT_WINDOW_TIME        = PRE + "window-time";
var AT_PREDICTION_TIME    = PRE + "prediction-time";
var AT_INFO               = PRE + "info";
var AT_INFO_ICON          = PRE + "info-icon";
var AT_ALERT_CLASS        = "danger";
var AT_ALERT_2_CLASS      = "warning";
var AT_SUCCESS_CLASS      = "success";
var AT_ROW_SELECTED       = PRE + "selected-row";
var AT_HIDDEN_ELEMENT     = PRE + "hidden-element";
var AT_ALERT_SELECTED_NAME= PRE + "alert-selected-name";
var AT_CONNECTIONS        = PRE + "connections"
var AT_CONNECTION_ROW     = PRE + "connection-row"
var AT_CONNECTION_BUTTON  = PRE + "connection-button"
var AT_CONNECTION_DIV_ID  = PRE + "connection-"
var AT_LEFT_CONTENT       = PRE + "left-content";
var AT_ALIAS_ACTIVATED      = PRE + "alias-activated"


var AT_TABLE              = PRE + "table";
var AT_TABLE_PRE          = AT_TABLE + "-";
var AT_TABLE_LEFT         = AT_TABLE_PRE + "left";
var AT_TABLE_EVENTS       = AT_TABLE_PRE + "events";
var AT_TABLE_MODEL        = AT_TABLE_PRE + "model";
var AT_TABLE_SUMMARY      = AT_TABLE_PRE + "summary";
var AT_TABLE_RESULTS      = AT_TABLE_PRE + "results";

var AT_COL                = PRE + "col-";
var AT_COL_LEFT           = AT_COL + "left";
var AT_COL_CENTER         = AT_COL + "center";
var AT_COL_RIGHT          = AT_COL + "right";

var AT_STRING_SUCCESS     = "Correctly predicted"
var AT_STRING_SUCCESS_2   = "HIT"
var AT_STRING_MISS_FP     = "False positive"
var AT_STRING_MISS_FP_2   = "MISS-FP"
var AT_STRING_MISS_FN     = "False negative"
var AT_STRING_MISS_FN_2   = "MISS-FN"

var AT_PREFIX_SELECTED    = "* "
var AT_ON   = "on";
var AT_OFF  = "off";

var AT_UPDATE_INTERVAL = 1000;

var AT_ID_PREFIX_ALERTS = PRE + "alert-"
var AT_ID_PREFIX_MODEL_EVENT = PRE + "model-event-"

/*WS commands*/
var AT_WS_EVENT = "event"
var AT_WS_PREDICTION = "prediction"
var AT_WS_MODEL = "model";
var AT_WS_ALIAS = "alias"

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
var AT_WS_RESULT_MISS_FALSE_POSITIVE_CLASS = PRE + "miss-fp"
var AT_WS_RESULT_MISS_FALSE_NEGATIVE_CLASS = PRE + "miss-fn"
var AT_WS_ALERT = "alert"
var AT_WS_ALERT_TIMEOUT = "timeout"
var AT_WS_ALERT_ON = "on"
var AT_WS_ALERT_OFF = "off"
var AT_WS_DESCRIPTION = "description"

//var AT_WS_ALIAS_NAME

var AT_VISUAL_ON = "on";
var AT_VISUAL_OFF = "off";

/* sorts*/
var AT_ORDER_BY_NAME = 1;
var AT_ORDER_BY_ORIGIN = 2;
var AT_ORDER_BY_ALERT = 3;
var AT_ORDER_BY_PREDICTION = 4;
var AT_ORDER_BY_START_DATE = 5;
var AT_ORDER_BY_END_DATE = 6;
var AT_ORDER_BY_DATE = 7;
/**/

/* alert showed */
var AT_SHOW_ALL = 0;
var AT_SHOW_HAPPEN = 1;
var AT_SHOW_ALERTED = 2;

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
if (GLOBAL_DEBUG) {
    atAlertsSortBy = [AT_ORDER_BY_ALERT,AT_ORDER_BY_NAME,AT_ORDER_BY_PREDICTION,AT_ORDER_BY_ORIGIN,AT_ORDER_BY_START_DATE,AT_ORDER_BY_END_DATE];
}
var alertShowed = AT_SHOW_ALL;

var atEventsInWindow = {};
var atEventsInWindowSorted = [];
//var atEventsInWindowSortBy = [AT_ORDER_BY_DATE,AT_ORDER_BY_NAME];

var atAliasTable = {};

var atResults = [];

var wss = {}
var finish = false;
var dateGranularity = 3; // 1 seconds, 2 minutes, 3 hour, 4 day, 5 month, 6 year

var atMaxObservationWindow = 0;
var atMaxPredictionWindow = 0;


var AT_REFRESH_TIME = 100;
var atRefreshEventTableNeeded = true;
var atRefreshAlertsTableNeeded = true;
var atRefreshPredictionResultNeeded = true;

var lastAlertSelected = undefined;

//var
if (GLOBAL_DEBUG) {
    var url = "ws://localhost:2346/summary/"
    var url = "ws://192.168.122.131:2346/summary/"
}


var registerEvent = function (message,origin) {
    var event;
    switch (message.command) {
        case AT_WS_EVENT :
            atNewEvent(message,origin);
            break;
        case AT_WS_MODEL :
            atNewModel(message,origin);
            break;
        case AT_WS_PREDICTION :
            atNewPrediction(message,origin);
            break;
        case AT_WS_ALERT :
            atNewAlert(message,origin);
            break;
        case AT_WS_RESULT :
            atNewResult(message,origin)
            break;
        case AT_WS_ALIAS:
            atNewAlias(message,origin);

    }
}
if (GLOBAL_DEBUG) {

    //atAliasTable['bvtowpocwp03-adm.gestao.rinterna.local-0x10d35'] = {}
    //atAliasTable['bvtowpocwp03-adm.gestao.rinterna.local-0x10d35'].alias = "Admin: Nodo 3 CPU > 75%"
    //atAliasTable['bvtowpocwp03-adm.gestao.rinterna.local-0x10d35'].description = "Evento origen bvtowpocwp03-adm.gestao.rinterna.local-0x10d35";
    //atAliasTable['sasetottaintra5.wt.totta.corp-0x10f69'] = {}
    //atAliasTable['sasetottaintra5.wt.totta.corp-0x10f69'].alias  = "S.A.S.E. Nodo 5 Chasis caido"
    //atAliasTable['sasetottaintra5.wt.totta.corp-0x10f69'].description = "Evento origen sasetottaintra5.wt.totta.corp-0x10f69";
    //atAliasTable['sasetottaintra5.wt.totta.corp-0x10f71'] = {}
    //atAliasTable['sasetottaintra5.wt.totta.corp-0x10f71'].alias  = "S.A.S.E. Nodo 5 CPU > 99%";
    //atAliasTable['sasetottaintra5.wt.totta.corp-0x10f71'].description = "Evento origen sasetottaintra5.wt.totta.corp-0x10f71";
    //atAliasTable['sasetottaintra6.wt.totta.corp-0x10f69'] = {}
    //atAliasTable['sasetottaintra6.wt.totta.corp-0x10f69'].alias  = "S.A.S.E. Nodo 6 - Chasis caido"
    //atAliasTable['sasetottaintra6.wt.totta.corp-0x10f69'].description = "Evento origen sasetottaintra6.wt.totta.corp-0x10f69";
    //atAliasTable['sasetottaintra6.wt.totta.corp-0x10f71'] = {}
    //atAliasTable['sasetottaintra6.wt.totta.corp-0x10f71'].alias  = "S.A.S.E. Nodo 6 CPU > 99%";
    //atAliasTable['sasetottaintra6.wt.totta.corp-0x10f71'].description = "Evento origen sasetottaintra6.wt.totta.corp-0x10f71";
    //atAliasTable['sasotottaintra1.wt.totta.corp-0x10f71'] = {}
    //atAliasTable['sasotottaintra1.wt.totta.corp-0x10f71'].alias  = "S.A.S.E. Nodo 1 CPU > 99%";
    //atAliasTable['sasotottaintra1.wt.totta.corp-0x10f71'].description = "Evento origen sasotottaintra1.wt.totta.corp-0x10f71";
    //atAliasTable['sasotottaintra3.wt.totta.corp-0x10f69'] = {}
    //atAliasTable['sasotottaintra3.wt.totta.corp-0x10f69'].alias  = "S.A.S.E. Nodo 3 Chasis caido"
    //atAliasTable['sasotottaintra3.wt.totta.corp-0x10f69'].description = "Evento origen sasotottaintra3.wt.totta.corp-0x10f69";
    //atAliasTable['sasotottaintra3.wt.totta.corp-0x10f71'] = {}
    //atAliasTable['sasotottaintra3.wt.totta.corp-0x10f71'].alias  = "S.A.S.E. Nodo 3 CPU > 99%";
    //atAliasTable['sasotottaintra3.wt.totta.corp-0x10f71'].description = "Evento origen sasotottaintra3.wt.totta.corp-0x10f71";
    //atAliasTable['sasotottaintra6.wt.totta.corp-0x10f69'] = {}
    //atAliasTable['sasotottaintra6.wt.totta.corp-0x10f69'].alias  = "S.A.S.O. Nodo 6 - Chasis caido";
    //atAliasTable['sasotottaintra6.wt.totta.corp-0x10f69'].description = "Evento origen sasotottaintra6.wt.totta.corp-0x10f69";
    //atAliasTable['sasotottaintra6.wt.totta.corp-0x10f71'] = {}
    //atAliasTable['sasotottaintra6.wt.totta.corp-0x10f71'].alias  = "S.A.S.O. Nodo 6 CPU > 99%";
    //atAliasTable['sasotottaintra6.wt.totta.corp-0x10f71'].description = "Evento origen sasotottaintra6.wt.totta.corp-0x10f71";
    //atAliasTable['bvtolpocip01.totta.corp-0x56e1000'] = {}
    //atAliasTable['bvtolpocip01.totta.corp-0x56e1000'].alias  = "Cop. TOTA. Nodo 1 RAM > 75%";
    //atAliasTable['bvtolpocip01.totta.corp-0x56e1000'].description = "Evento origen bvtolpocip01.totta.corp-0x56e1000";
}
var atNewAlias = function (message,origin) {

    var event = message[AT_WS_EVENT];
    var alias = message[AT_WS_ALIAS];
    var description = message[AT_WS_DESCRIPTION];
    at_print(message);
    atAliasTable[event] = {}
    atAliasTable[event].alias = alias
    atAliasTable[event].description = description
}

var atNewResult = function (message,origin) {
    if (!message[AT_WS_TIME]) {
        message[AT_WS_TIME] = Date.now();
    }
    atResults.push(message);
    atRefreshPredictionResult();
}

var atNewEvent = function (message,origin) {
    var event = {};
    event.name = message[AT_WS_EVENT];
    event.time = message[AT_WS_TIME];
    event.moment = Date.now();
    atEventsInWindow[event.name] = event;
    atEventsInWindowSorted.push(event);
    atRefreshEventTable();
    return event;

}


var atNewModel = function (message,origin) {
    var event
    var eventName = message[AT_WS_EVENT];
    var before = message[AT_WS_BEFORE];
    var after = message[AT_WS_AFTER];
    var eventWeights = message[AT_WS_EVENT_WEIGHTS];
    var intercept = message[AT_WS_INTERCEPT];

    event = atAlertEvents [eventName];
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
    if(atMaxObservationWindow <= before) {
        atMaxObservationWindow = before;
        $("#"+AT_WINDOW_TIME).text(atCountdown(atMaxObservationWindow))
    }
    if (atMaxPredictionWindow <= after) {
        atMaxPredictionWindow = after;
    }
    if(atMaxPredictionWindow <= after) {
        atMaxPredictionWindow = after;
        $("#"+AT_PREDICTION_TIME).text(atCountdown(atMaxPredictionWindow))
    }

    event.intercept = intercept;
    event.eventWeights = []
    eventWeights.forEach(function(e) {
        var eventWeight = {}
        eventWeight.name = e[AT_WS_EVENT];
        if (e[AT_WS_EVENT_WEIGHT]) {
            eventWeight.weight = parseInt(e[AT_WS_EVENT_WEIGHT]*100)/100;
        } else {
            eventWeight.weight = NaN;
        }
        event.eventWeights.push(eventWeight)
        event.selected = false;
    })
    atRefreshAlertTable();
    event.moment = Date.now();
    event.origin = origin;
    return event;
}

var atNewPrediction = function (message,origin) {
    var event = {}
    var eventName = message[AT_WS_EVENT];
    var timeOut = message[AT_WS_ALERT_TIMEOUT]
    var timeNow = message[AT_WS_TIME];
    event = atAlertEvents [eventName];
    var prediction = Math.round(parseFloat(message[AT_WS_PREDICTION]) * 10000) /100.0;
    if (event === undefined){
        event = {}
        event.name = eventName;
        atAlertsSorted.push(event);
        atAlertEvents [eventName] = event;
        event.alertStatus = false;
        event.after= 0;
        event.before = 0;
        event.intercept = 0;
        event.eventWeights = []
        event.selected = false;
    }
    event.prediction = prediction;
    event.reception = Date.now();
    atRefreshAlertTable();
    event.moment = Date.now();
    event.origin = origin;
    return event;
}

var atNewAlert = function (message,origin) {
    var event = {}
    var eventName = message[AT_WS_EVENT];
    var timeOut = message[AT_WS_ALERT_TIMEOUT]
    var timeNow = message[AT_WS_TIME];
    event = atAlertEvents [eventName];
    if (event === undefined){
        event = {}
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
        if (event.alertStatus != alertStatus) {
            event.alertStart = timeNow;
            event.alertStatus = alertStatus;
        }
        event.alertStop = parseInt(timeNow) + parseInt(timeOut);
        atRefreshAlertTable();
    }
    event.moment = Date.now();
    event.origin = origin;
    return event;
}


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

/**
 * Crea una conexión mediante web socket a una url concreta.
 * @param url
 * @param origin
 * @returns {ReconnectingWebSocket}
 */
var atCreateWS = function (url,origin) {
    var ws = new ReconnectingWebSocket(url);
    ws.inheritOnClose = ws.onclose;
    ws.onclose = function (event) {
        this.inheritOnClose(event);
    }
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
            at_print("Incorrect message format, Use JSON format." + e.data)
            return;
        }
        if (message instanceof Array) {
            message.forEach(function (event) {
                registerEvent(event,ws.wsOrigin);
            })
        } else {                                                       +
            registerEvent(message,ws.wsOrigin);
        }
    }
    ws.onclose = function (e) {
        at_print(e);
    }
    return ws;
}


var sortAlerts = function () {
    atAlertsSorted.sort(function (eventA,eventB) {
        for (var key in atAlertsSortBy) {
            /*First, selected sort!*/
            if (eventA.selected != eventB.selected) {
                if (eventA.selected) {
                    return -1
                }
                return 1;
            }
            var result = atCompareAlertsBy(eventA,eventB,atAlertsSortBy[key]);
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
var atCompareAlertsBy = function (eventA,eventB,compareBy) {
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



var atCreateEventRow = function (template, event){
    var row = template.clone().removeClass(DASHBOARD_TEMPLATES);
    if ($("#"+AT_ALIAS_ACTIVATED)[0].checked && atAliasTable[event.name] != undefined) {
        row.find("."+AT_CELL_EVENT).text(atAliasTable[event.name].alias);
    } else {
        row.find("."+AT_CELL_EVENT).text(event.name);
    }
    row.find("."+AT_CELL_TIME).text(atFormattedDate(event.time));
    return row;
}
var sortEvents = function () {
    var newArray = [];
    var newObject = {};
    atEventsInWindowSorted.forEach(function (event) {
        var now = Date.now();
        if (now < (event.time + atMaxObservationWindow)){
            newArray.push(event);
            newObject[event.name] = event;
        }
    })
    atEventsInWindowSorted = newArray;
    atEventsInWindow = newObject;

}
var _atRefreshAlertTableRoutine = function () {
    sortAlerts();
    var alertTable = $("#" + AT_TABLE_LEFT).find('tbody');
    var templateRow = alertTable.find("." + DASHBOARD_TEMPLATES);
    templateRow.detach();
    alertTable.empty();
    alertTable.append(templateRow)
    var alerts = []
    atAlertsSorted.forEach(function (event) {
        if ((event.selected) ||
            (alertShowed == AT_SHOW_ALL) ||
            (alertShowed == AT_SHOW_HAPPEN && event.moment + event.after > Date.now()) ||
            (alertShowed == AT_SHOW_ALERTED && event.alertStatus)) {
            alerts.push(atCreateAlertRow(templateRow, event));
        }
    })
    alerts.forEach(function (alertRow) {
        alertRow.appendTo(alertTable);
    });
}

var _atRefreshSecondsAlertTableRoutine= function (){
    atAlertsSorted.forEach (function (event) {
        var cell = $(document.getElementById(AT_ID_PREFIX_ALERTS+event.name)).find("."+AT_CELL_END)
        if (event.alertStatus || cell.text() != "") {
            var myCountdown = atCountdown(event.alertStop- Date.now());
            if (!myCountdown || myCountdown == "") {
                cell.text("");
                event.alertStatus = false;
                atRefreshAlertTable();
                var dateCell = $(document.getElementById(AT_ID_PREFIX_ALERTS+event.name)).find("."+AT_CELL_START)
                dateCell.text= ("");

            } else {
                cell.text (myCountdown)
            }
        }
    })
}

/*Actualiza la tabla de eventos en la ventana*/
var _atRefreshEventTableRoutine = function () {
    atRefreshEventTableNeeded = false;
    sortEvents();
    atPaintModel(lastAlertSelected);
    var eventTable = $("#" + AT_TABLE_EVENTS).find('tbody');

    var templateRow = eventTable.find("." + DASHBOARD_TEMPLATES);
    templateRow.detach();
    eventTable.empty();
    eventTable.append(templateRow)
    var rows = [];

    atEventsInWindowSorted.forEach(function (event) {
        var row = atCreateEventRow(templateRow, event)
        rows.push(row)
        var timeout = event.time + atMaxObservationWindow - Date.now();
        setTimeout(function () {
            atRefreshEventTable();
        }.bind(row), timeout);
    })
    rows.forEach(function (row) {
        row.appendTo(eventTable);
    })

}


var _atRefreshPredictionResultRoutine = function () {
    var body = $("#"+AT_TABLE_RESULTS+" tbody");
    var template = body.find("."+DASHBOARD_TEMPLATES);
    body.empty();
    body.append(template);
    for (var key in atResults) {
        var message = atResults[key];
        var result = message[AT_WS_RESULT];
        var row =  template.clone().removeClass(DASHBOARD_TEMPLATES);

        if ($("#"+AT_ALIAS_ACTIVATED)[0].checked && atAliasTable[message[AT_WS_EVENT]]){
            row.find("."+AT_CELL_EVENT).text(atAliasTable[message[AT_WS_EVENT]].alias)
        } else {
            row.find("."+AT_CELL_EVENT).text(message[AT_WS_EVENT])
        }
        row.find("."+AT_CELL_TIME).text(atFormattedDate(message[AT_WS_TIME]));
        switch (result) {
            case AT_WS_RESULT_HIT :
                row.addClass(AT_SUCCESS_CLASS)
                row.attr('title',AT_STRING_SUCCESS)
                row.find('.'+AT_CELL_RESULT).text(AT_STRING_SUCCESS_2);
                break;
            case AT_WS_RESULT_MISS_FALSE_NEGATIVE :
                row.addClass(AT_ALERT_CLASS)
                row.attr('title',AT_STRING_MISS_FN)
                row.find('.'+AT_CELL_RESULT).text(AT_STRING_MISS_FN_2);
                break;
            case AT_WS_RESULT_MISS_FALSE_POSITIVE :
                row.addClass(AT_ALERT_2_CLASS)
                row.attr('title',AT_STRING_MISS_FP)
                row.find('.'+AT_CELL_RESULT).text(AT_STRING_MISS_FP_2);
                break;
        }
        body.prepend(row);
    }

}

var atRefreshAlertTable = function () {
    atRefreshAlertsTableNeeded = true;
}
var atRefreshEventTable = function () {
    atRefreshEventTableNeeded = true;
}

var atRefreshPredictionResult = function () {
    atRefreshPredictionResultNeeded = true;
}

var _atRefreshTablesRoutine = function () {
    if (atRefreshEventTableNeeded){
        _atRefreshEventTableRoutine();
        atRefreshEventTableNeeded= false;
    }
    if (atRefreshAlertsTableNeeded) {
        _atRefreshAlertTableRoutine();
        atRefreshAlertsTableNeeded= false;
    }
    if(atRefreshPredictionResultNeeded){
        _atRefreshPredictionResultRoutine();
        atRefreshPredictionResultNeeded= false;
    }
    setTimeout(_atRefreshTablesRoutine,AT_REFRESH_TIME);
}


var _atUpdateHour = function () {
    var now = moment(Date.now()).format("HH:mm:ss");
    $("#"+AT_HOUR).text(now);
    setTimeout(_atUpdateHour,AT_REFRESH_TIME/10);
}

var _timeOutCountdown = function () {
    _atRefreshSecondsAlertTableRoutine();
    setTimeout(_timeOutCountdown,10)
}

setTimeout(_timeOutCountdown,0)
setTimeout(_atRefreshTablesRoutine,AT_REFRESH_TIME);
setTimeout(_atUpdateHour,0)

var atCreateAlertRow = function (templateRow, event){
    var alertRow = templateRow.clone().removeClass(DASHBOARD_TEMPLATES);
    if (event.selected) {
        alertRow.addClass(AT_ROW_SELECTED);
        if ($("#"+AT_ALIAS_ACTIVATED)[0].checked && atAliasTable[event.name] != undefined){
            alertRow.find("."+AT_CELL_EVENT).text(AT_PREFIX_SELECTED + atAliasTable[event.name].alias)
        } else {
            alertRow.find("."+AT_CELL_EVENT).text(AT_PREFIX_SELECTED + event.name)
        }
    } else {
        if ($("#"+AT_ALIAS_ACTIVATED)[0].checked && atAliasTable[event.name] != undefined){
            alertRow.find('.' + AT_CELL_EVENT).text(atAliasTable[event.name].alias);
        } else {

            alertRow.find('.' + AT_CELL_EVENT).text(event.name);
        }

    }
    alertRow.attr('id', AT_ID_PREFIX_ALERTS + event.name)
    //alertRow.find('.' + AT_CELL_END).text(atCountdown(event.alertStop- Date.now()));
    alertRow.find('.' + AT_CELL_ORIGIN).text(event.origin);
    if (event.prediction !== undefined) {
        alertRow.find('.' + AT_CELL_PREDICTION).text(event.prediction);
    }
    if (event.alertStatus !== undefined) {
        if (event.alertStatus) {
            alertRow.find('.' + AT_CELL_ALERT).text(AT_VISUAL_ON);
            alertRow.addClass(AT_ALERT_CLASS);
            alertRow.find('.' + AT_CELL_START).text(atFormattedDate(event.alertStart));
        } else {
            alertRow.find('.' + AT_CELL_ALERT).text(AT_VISUAL_OFF);
            alertRow.find('.' + AT_CELL_START).text("");
        }
    }
    return alertRow;
}

var at_print = function (string,info){
    if (GLOBAL_DEBUG || info){
        console.log(string)
    }
}

var atFormattedDate = function (dateLong) {
    if (dateLong === undefined || dateLong == ""){
        return "";
    }
    switch (dateGranularity) {
        case 6: return moment(dateLong).format("HH:mm:ss - DD/MM/YYYY");
        case 5: return moment(dateLong).format("HH:mm:ss - DD/MM");
        case 4: return moment(dateLong).format("HH:mm:ss - DD");
        case 3: return moment(dateLong).format("HH:mm:ss");
        case 2: return moment(dateLong).format("mm:ss");
        case 1: return moment(dateLong).format("ss");
        default: return "";
    }
}

var atCountdown = function (time ){
    if (!time || time == "" || time < 0) {
        return "";
    }
    var myTime = parseInt(time / 1000);
    var seconds = myTime % 60;
    if (seconds == 0) {
        seconds = "00";
    } else if (seconds < 10) {
        seconds = "0"+seconds;
    }
    if (myTime >= 60) {
        var minutes = parseInt (myTime / 60);
        return minutes+"m "+seconds+"s"
    } else {
        return seconds+"s"
    }

}


/*Buttons functions */
{
    var atStartRoutines = function (){
        console.log("Start Routine");

        // paint left column
        finish = false;
        var connections = $("#"+AT_LEFT_CONTENT).detach()

        $("#"+LEFT_COLUMN_CONTENT).append(connections)
        $("#"+AT_ALIAS_ACTIVATED).switchButton({switcherClick: function () {
            atRefreshAlertTable();
            atRefreshEventTable();
            atPaintModel(lastAlertSelected)
            atRefreshPredictionResult();
            atResizeFunction();
        }});

    }

    var atDebugRoutines = function (){
        console.log("Debug Routine");
        var origins = []
        origins[0] = ["origin1","ws://192.168.122.131:2346/summary/"]
        origins[1] = ["origin2","ws://localhost:2346/summary/"]
        for (var i = 0; i < origins.length;i++){
            atAddConnection(origins[i][0],origins[i][1]);

        }
        atEstablishConnection(origins[1][0],origins[1][1])
        $("#"+AT_CONNECTION_DIV_ID+origins[1][0]).find("a").addClass("active")
    }


    var atResizeFunction = function (){
        at_print("Resize function");
        $(function (){
            var centerWight = $("#"+AT_COL_LEFT).width();
            var width = centerWight / 2;
            $("#"+AT_COL_RIGHT).width(width)
            $("#"+AT_COL_CENTER).width(width)
            var a = $("#"+AT_COL_LEFT).position().left + $("#"+AT_COL_LEFT).width()
            var b = $("#"+AT_COL_RIGHT).position().left
            var position = a + ((b-a) - width) / 2;
            $("#"+AT_COL_CENTER).css('left', position);
            // table results
            {
                $("."+AT_TABLE).each(function (key,table){
                    var headHeight = $(table).find("thead").height();
                    var footHeight = $(table).find("tfoot").height();
                    var parentHeight= $("#"+AT_TABLE_RESULTS).parent().height();
                    headHeight = (headHeight)?headHeight:0;
                    footHeight = (footHeight)?footHeight:0;
                    parentHeight = (parentHeight)?parentHeight:0;
                    var tds = $(table).find("thead tr:last th");
                    tds.each(function(key,td) {
                        $(table).find("tbody tr td:nth-child("+(key+1)+")").width($(td).width())
                    })

                    $(table).find("tbody").height(parentHeight-footHeight-headHeight);

                })
                var thead = $("#"+AT_TABLE_RESULTS+" thead");
                var tbody = $("#"+AT_TABLE_RESULTS+" tbody");
                var tfoot = $("#"+AT_TABLE_RESULTS+" tfoot");
                var div= $("#"+AT_TABLE_RESULTS).parent()
                tbody.height(div.height() - thead.height() - tfoot.height() )
            }
        })
    }

    var atClearFunction = function (){
        at_print("Clear function");
        finish = true;
        //TODO eliminar los ws

        $(window).unbind('resize',atResizeFunction)

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

    var atShowAlerted = function(){
        alertShowed = AT_SHOW_ALERTED;
        atRefreshAlertTable();
    }

    var atShowReceived = function (){
        alertShowed = AT_SHOW_HAPPEN;
        atRefreshAlertTable();
    }

    var atShowAll = function (){
        alertShowed = AT_SHOW_ALL;
        atRefreshAlertTable();
    }
}

var atClickAlertRow = function (target){
    while (target.nodeName != "TR") {
        target = target.parentNode;
        if (target == undefined) {
            return;
        }
    }
    var oldElement = $("#"+AT_TABLE_LEFT).find("."+AT_ROW_SELECTED)
    var id = target.id.replace(AT_ID_PREFIX_ALERTS,"");
    var alertTable = $("#"+AT_TABLE_LEFT).find('tbody');

    target = $(target);

    if (atAlertEvents[id] && !atAlertEvents[id].selected) {
        atAlertEvents[id].selected = true;
        atPaintModel(atAlertEvents[id])
        atResizeFunction();
    } else {
        atPaintModel()
    }

    oldElement.hide(100,function () {
        oldElement.removeClass(AT_ROW_SELECTED)
        oldElement.each(function(key,value) {
            var oldId = value.id.replace(AT_ID_PREFIX_ALERTS,"");
            if (atAlertEvents[oldId]) {
                atAlertEvents[oldId].selected = false;
            }
        })

    });
    target.hide(100,function () {
        if (atAlertEvents[id].selected) {
            target.addClass(AT_ROW_SELECTED);
            if ($("#"+AT_ALIAS_ACTIVATED)[0].checked && atAliasTable[atAlertEvents[id].name] != undefined){
                target.find("."+AT_CELL_EVENT).text(AT_PREFIX_SELECTED + atAliasTable[atAlertEvents[id].name].alias)
            } else {
                target.find("."+AT_CELL_EVENT).text(AT_PREFIX_SELECTED + atAlertEvents[id].name)
            }
            target.prependTo(alertTable)
            target.show(100,atRefreshAlertTable);
        } else {
            atRefreshAlertTable();

        }
    })
}

var atPaintModel = function (alertEvent){

    var body = $("#"+AT_TABLE_MODEL+" tbody");
    var templateRow =  body.find("."+DASHBOARD_TEMPLATES);
    body.empty();
    templateRow.appendTo(body);
    lastAlertSelected= alertEvent;
    if (alertEvent) {
        if ($("#"+AT_ALIAS_ACTIVATED)[0].checked && atAliasTable[alertEvent.name] != undefined){
            $("#"+AT_ALERT_SELECTED_NAME).text(atAliasTable[alertEvent.name].alias)
        } else {
            $("#"+AT_ALERT_SELECTED_NAME).text(alertEvent.name)
        }
        alertEvent.eventWeights.forEach(function (eventWeight) {
            if (eventWeight.weight != 0) {
                var row = templateRow.clone().removeClass(DASHBOARD_TEMPLATES);
                row.attr('id', AT_ID_PREFIX_MODEL_EVENT + eventWeight.name);
                if ($("#"+AT_ALIAS_ACTIVATED)[0].checked && atAliasTable[eventWeight.name] != undefined){
                    row.find("." + AT_CELL_EVENT).text(atAliasTable[eventWeight.name].alias);
                } else {
                    row.find("." + AT_CELL_EVENT).text(eventWeight.name);
                }
                if (!isNaN(eventWeight.weight)) {
                    row.find("." + AT_CELL_WEIGHT).text(eventWeight.weight);
                }
                if (atEventsInWindow[eventWeight.name]) {
                    row.addClass("info")
                    row.find("." + AT_CELL_TIME).text(atFormattedDate(atEventsInWindow[eventWeight.name].time));
                }
                row.appendTo(body);
            }

        });
        $("#"+AT_TABLE_SUMMARY).find("."+AT_CELL_EVENT).text(alertEvent.name);
        if (atAliasTable[alertEvent.name] != undefined) {
            $("#"+AT_TABLE_SUMMARY).find("."+AT_CELL_ALIAS).text(atAliasTable[alertEvent.name].alias)
            $("#"+AT_TABLE_SUMMARY).find("."+AT_CELL_DESCRIPTION).text(atAliasTable[alertEvent.name].description)
        }

        $("#"+AT_TABLE_MODEL).removeClass(AT_HIDDEN_ELEMENT)
        $("#"+AT_TABLE_SUMMARY).removeClass(AT_HIDDEN_ELEMENT)
    } else {
        $("#"+AT_TABLE_MODEL).addClass(AT_HIDDEN_ELEMENT)
        $("#"+AT_TABLE_SUMMARY).addClass(AT_HIDDEN_ELEMENT)
    }
}



/**
 * Esta funcion abre y cierra el panel de información, el que contiene la hora
 */
var atInfoClick = function (){
    var divClick = $("#"+AT_INFO_ICON)
    var divInfo  = $("#"+AT_INFO);
    if (divClick.hasClass(AT_OFF)){
        divClick.removeClass(AT_OFF);
        divInfo.removeClass(AT_OFF);
        divClick.addClass(AT_ON);
        divInfo.addClass(AT_ON);
    } else {
        divClick.removeClass(AT_ON);
        divInfo.removeClass(AT_ON);
        divClick.addClass(AT_OFF);
        divInfo.addClass(AT_OFF);

    }
}



if(GLOBAL_DEBUG) {
    setTimeout(atInfoClick,100)
}

var atClearResults = function () {
    var body = $("#"+AT_TABLE_RESULTS+" tbody");
    var templateRow =  body.find("."+DASHBOARD_TEMPLATES).clone()
    atResults = []
    body.empty();
    body.append(templateRow);
}

var atClearAlerts = function () {
    var body = $("#"+AT_TABLE_LEFT+" tbody");
    var templateRow =  body.find("."+DASHBOARD_TEMPLATES).clone()
    body.empty();
    body.append(templateRow);
}

var atClearModelDescription = function () {
    atPaintModel();
}

var atClearWindowEvents = function () {
    atEventsInWindowSorted = [];
    atEventsInWindow = {};
    atRefreshEventTable();
}

var atResetConnections = function () {
    for (var key in wss) {
        atRemoveConnection(key);
    }
}

var atRemoveConnection = function (id){
    var ws = wss[id].ws;
    if (ws) {
        ws.forcedClose = true;
        ws.close();
    }
}

var atAddConnection = function (id, addr) {
    var connections = $("#"+AT_CONNECTIONS);
    var template = connections.find("."+AT_CONNECTION_ROW+"."+DASHBOARD_TEMPLATES)
    var newConnection = template.clone().removeClass(DASHBOARD_TEMPLATES);
    newConnection.attr("id",AT_CONNECTION_DIV_ID+id);
    var button = newConnection.find("."+AT_CONNECTION_BUTTON);
    button.text(id);
    button.click(atClickConnection.bind(button,id,addr));
    connections.append(newConnection);
}

var atEstablishConnection = function (id, addr) {
    var newWs = {};
    var origin = id;
    newWs.origin = origin;
    newWs.ws = atCreateWS(addr,origin);
    wss[newWs.origin] = newWs;

}

var atClickConnection = function (id,addr) {
    atResetView();
    this.addClass("active");
    atEstablishConnection(id,addr);
}

var atResetView = function () {
    // remove button clicked
    $("#"+AT_CONNECTIONS).find("."+AT_CONNECTION_BUTTON).removeClass("active");

    // Quitar los eventos de la vista, de momento todos, en una iteracción posterior quitar solos los del origen del ws
    atClearAlerts()
    // Quitar los eventos de la ventana de observación
    atClearWindowEvents();
    // Limpiar las últimas predicciones
    atClearResults();
    // Limpiar / Ocular información del modelo
    atClearModelDescription();
    // cerrar las conexiones
    atResetConnections()
    atAlertEvents = {}
    atAlertsSorted = []
    wss = {}
    atMaxObservationWindow = 0;
    atMaxPredictionWindow = 0;
    lastAlertSelected = undefined;
    $("#"+AT_WINDOW_TIME).text(atCountdown(atMaxObservationWindow))
    $("#"+AT_PREDICTION_TIME).text(atCountdown(atMaxPredictionWindow))

}