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
var AT_NAT_ACTIVATED      = PRE + "nat-activated"


var AT_TABLE              = PRE + "table";
var AT_TABLE_PRE          = AT_TABLE + "-";
var AT_TABLE_LEFT         = AT_TABLE_PRE + "left";
var AT_TABLE_EVENTS       = AT_TABLE_PRE + "events";
var AT_TABLE_MODEL        = AT_TABLE_PRE + "model";
var AT_TABLE_RESULTS       = AT_TABLE_PRE + "results";

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

var AT_PREFIX_SELECETD    = "* "
var AT_ON   = "on";
var AT_OFF  = "off";

var AT_UPDATE_INTERVAL = 1000;

var AT_ID_PREFIX_ALERTS = PRE + "alert-"
var AT_ID_PREFIX_MODEL_EVENT = PRE + "model-event-"

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
var AT_WS_RESULT_MISS_FALSE_POSITIVE_CLASS = PRE + "miss-fp"
var AT_WS_RESULT_MISS_FALSE_NEGATIVE_CLASS = PRE + "miss-fn"
var AT_WS_ALERT = "alert"
var AT_WS_ALERT_TIMEOUT = "timeout"
var AT_WS_ALERT_ON = "on"
var AT_WS_ALERT_OFF = "off"
var AT_WS_NAT_NAME = "atName"

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
var atAlertsUpdated = true;
var atEventsUpdated = true;

var atEventsInWindow = {};
var atEventsInWindowSorted = [];
//var atEventsInWindowSortBy = [AT_ORDER_BY_DATE,AT_ORDER_BY_NAME];

var wss = {}
var finish = false;
var dateGranularity = 3; // 1 seconds, 2 minutes, 3 hour, 4 day, 5 month, 6 year

var atMaxObservationWindow = 0;
var atMaxPredictionWindow = 0;
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
    }
}

var atNewResult = function (message,origin) {
    at_print(message);

    //result.event = message[AT_WS_EVENT];
    var result = message[AT_WS_RESULT];
    var body = $("#"+AT_TABLE_RESULTS+" tbody");
    var row =  body.find("."+DASHBOARD_TEMPLATES).clone().removeClass(DASHBOARD_TEMPLATES);
    row.find("."+AT_CELL_EVENT).text(message[AT_WS_EVENT])
    row.find("."+AT_CELL_TIME).text(atFormattedDate(Date.now()));
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

var atNewEvent = function (message,origin) {
    var event = {};
    event.name = message[AT_WS_EVENT];
    event.time = message[AT_WS_TIME];
    event.moment = Date.now();
    atEventsInWindow[event.name] = event;
    atEventsInWindowSorted.push(event);
    atEventsUpdated = false;
    return event;

}


var atCountNat = 0;
var atNewModel = function (message,origin) {
    var event
    var eventName = message[AT_WS_EVENT];
    var before = message[AT_WS_BEFORE];
    var after = message[AT_WS_AFTER];
    var eventWeights = message[AT_WS_EVENT_WEIGHTS];
    var intercept = message[AT_WS_INTERCEPT];
    var nat_name = message[AT_WS_NAT_NAME];
    if (nat_name == undefined) {
        if (GLOBAL_DEBUG) {
            nat_name = "PERSONALIZADO_"+atCountNat++;
        }
    }
    event = atAlertEvents [eventName];
    if (event === undefined){
        event = {}
        atAlertEvents[eventName] = event;
        atAlertsSorted.push(event);
    }
    event.name = eventName;
    event.natName = nat_name;
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
        eventWeight.weight = parseInt(e[AT_WS_EVENT_WEIGHT]*100)/100;
        event.eventWeights.push(eventWeight)
        event.selected = false;
    })
    atAlertsUpdated = false;
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
        //event.alertStart = timeNow;
        event.after= 0;
        event.before = 0;
        event.intercept = 0;
        event.eventWeights = []
        event.selected = false;
    }
    event.prediction = prediction;
    event.reception = Date.now();
    atAlertsUpdated = false;
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
        atAlertsUpdated = false;
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
        // limpiar el contenido
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
        //atRefreshAlertTable() ;
    }
    ws.onclose = function (e) {
        at_print(e);
    }
    return ws;
}


var sortAlerts = function () {
    //at_print("sort order: "+atAlertsSortBy);
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


var atRefreshEventTable = function () {
    sortEvents();
    atPaintModel(lastAlertSelected);
    var eventTable = $("#"+AT_TABLE_EVENTS).find('tbody');

    var templateRow = eventTable.find("."+DASHBOARD_TEMPLATES);
    templateRow.detach();
    eventTable.empty();
    eventTable.append(templateRow)
    var rows = [];

    atEventsInWindowSorted.forEach(function (event){
        var row  = atCreateEventRow(templateRow,event)
        rows.push(row)
        var timeout = event.time + atMaxObservationWindow - Date.now();
        setTimeout(function (){
            //this.detach();
            ////var eventRemoved = atEventsInWindowSorted.pop();
            //var removed = atEventsInWindowSorted.splice(atEventsInWindowSorted.indexOf(event),1);
            //at_print(removed);
            //
            atRefreshEventTable();
            atEventsUpdated = false;
        }.bind(row),timeout);
        //at_print("Timeout="+timeout);


    })
    rows.forEach(function (row) {
        row.appendTo(eventTable);
    })

}

var atCreateEventRow = function (template, event){
    var row = template.clone().removeClass(DASHBOARD_TEMPLATES);
    row.find("."+AT_CELL_EVENT).text(event.name);
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
var atRefreshAlertTable = function () {
    sortAlerts();
    var alertTable = $("#"+AT_TABLE_LEFT).find('tbody');
    var templateRow = alertTable.find("."+DASHBOARD_TEMPLATES);
    templateRow.detach();
    alertTable.empty();
    alertTable.append(templateRow)
    var alerts = []
    atAlertsSorted.forEach(function (event){
        if ((event.selected) ||
                (alertShowed == AT_SHOW_ALL) ||
                (alertShowed == AT_SHOW_HAPPEN && event.moment + event.after > Date.now()) ||
                (alertShowed == AT_SHOW_ALERTED && event.alertStatus)) {
            alerts.push(atCreateAlertRow(templateRow,event));
        }
    })
    alerts.forEach(function (alertRow){
        alertRow.appendTo(alertTable);
    });
}

var atRefreshSecondsAlertTable = function (){
    atAlertsSorted.forEach (function (event) {
        //var cell = $("#"+AT_ID_PREFIX_ALERTS+event.name+" ."+AT_CELL_END)
        var cell = $(document.getElementById(AT_ID_PREFIX_ALERTS+event.name)).find("."+AT_CELL_END)
        if (event.alertStatus || cell.text() != "") {
            var myCountdown = atCountdown(event.alertStop- Date.now());
            if (!myCountdown || myCountdown == "") {
                cell.text("");
                event.alertStatus = false;
                atAlertsUpdated = false;

            } else {
                cell.text (myCountdown)
            }
        }
    })
}

var atCreateAlertRow = function (templateRow, event){
    var alertRow = templateRow.clone().removeClass(DASHBOARD_TEMPLATES);
    if (event.selected) {
        alertRow.addClass(AT_ROW_SELECTED);
        if (event.natName){
            alertRow.find("."+AT_CELL_EVENT).text(AT_PREFIX_SELECETD + event.natName)
        } else {
            alertRow.find("."+AT_CELL_EVENT).text(AT_PREFIX_SELECETD + event.name)
        }

        //alertRow.find('.' + AT_CELL_EVENT).text(AT_PREFIX_SELECETD + event.name);
    } else {
        if ($("#"+AT_NAT_ACTIVATED)[0].checked && event.natName != undefined){
            alertRow.find('.' + AT_CELL_EVENT).text(event.natName);
        } else {

            alertRow.find('.' + AT_CELL_EVENT).text(event.name);
        }

    }
    alertRow.attr('id', AT_ID_PREFIX_ALERTS + event.name)
    alertRow.find('.' + AT_CELL_START).text(atFormattedDate(event.alertStart));
    alertRow.find('.' + AT_CELL_END).text(atCountdown(event.alertStop- Date.now()));
    alertRow.find('.' + AT_CELL_ORIGIN).text(event.origin);
    if (event.prediction !== undefined) {
        alertRow.find('.' + AT_CELL_PREDICTION).text(event.prediction);
    }
    if (event.alertStatus !== undefined) {
        if (event.alertStatus) {
            alertRow.find('.' + AT_CELL_ALERT).text(AT_VISUAL_ON);
            alertRow.addClass(AT_ALERT_CLASS);
        } else {
            alertRow.find('.' + AT_CELL_ALERT).text(AT_VISUAL_OFF);
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
        $("#"+AT_NAT_ACTIVATED).switchButton({switcherClick: function () {
            atRefreshAlertTable();
        }});
        //click(function () {
        //    atRefreshAlertTable();
        //})
    }

    var atDebugRoutines = function (){
        console.log("Debug Routine");
        var origins = []
        origins[0] = ["origin1","ws://192.168.122.131:2346/summary/"]
        origins[1] = ["origin2","ws://localhost:2346/summary/"]
        for (var i = 0; i < origins.length;i++){
            atAddConnection(origins[i][0],origins[i][1]);

        }
        //atEstablishConnection(origins[0][0],origins[0][1])
        //$("#"+AT_CONNECTION_DIV_ID+origins[0][0]).find("a").addClass("active")
        atEstablishConnection(origins[1][0],origins[1][1])
        $("#"+AT_CONNECTION_DIV_ID+origins[1][0]).find("a").addClass("active")

        //atEstablishConnection()
        //var newWs = {};
        //var origin = "origin1"
        //newWs.origin = origin;
        //newWs.ws = atCreateWS(url,origin);
        //wss[newWs.origin] = newWs;
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

                        //$("."+AT_TABLE+" tfoot tr td:nth-child("+(key+1)+")").width($(td).width())

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
        //forEach() eliminar los ws

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
    //var atNewEvent = target.id.replace(AT_ID_PREFIX_ALERTS,"");
    //var oldEvent = oldElement[0].id;
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
            if (atAlertEvents[id].natName){
                target.find("."+AT_CELL_EVENT).text(AT_PREFIX_SELECETD + atAlertEvents[id].natName)
            } else {
                target.find("."+AT_CELL_EVENT).text(AT_PREFIX_SELECETD + atAlertEvents[id].name)
            }
            target.prependTo(alertTable)
            target.show(100,atRefreshAlertTable);
            // TODO esto es a lo burro
        } else {
            atRefreshAlertTable();

        }
        //target.remove();
    })
    //atRefreshAlertTable();
}

var atPaintModel = function (alertEvent){

    var body = $("#"+AT_TABLE_MODEL+" tbody");
    var templateRow =  body.find("."+DASHBOARD_TEMPLATES);
    //templateRow.detach();
    body.empty();
    templateRow.appendTo(body);
    lastAlertSelected= alertEvent;
    if (alertEvent) {
        $("#"+AT_ALERT_SELECTED_NAME).text(alertEvent.name)
        alertEvent.eventWeights.forEach(function (eventWeight) {
            if (eventWeight.weight != 0) {
                var row = templateRow.clone().removeClass(DASHBOARD_TEMPLATES);
                row.attr('id', AT_ID_PREFIX_MODEL_EVENT + eventWeight.name);
                row.find("." + AT_CELL_EVENT).text(eventWeight.name);
                row.find("." + AT_CELL_WEIGHT).text(eventWeight.weight);
                if (atEventsInWindow[eventWeight.name]) {
                    row.addClass("info")
                    row.find("." + AT_CELL_TIME).text(atFormattedDate(atEventsInWindow[eventWeight.name].time));
                }
                row.appendTo(body);
            }

        });
        $("#"+AT_TABLE_MODEL).removeClass(AT_HIDDEN_ELEMENT)
    } else {
        $("#"+AT_TABLE_MODEL).addClass(AT_HIDDEN_ELEMENT)
    }
}

var timeOutFunction = function() {

    if (!atAlertsUpdated){
        atRefreshAlertTable();
        atAlertsUpdated = true;
    }

    if (!atEventsUpdated) {
        atRefreshEventTable();
        atEventsUpdated = true;
    }

    setTimeout(timeOutFunction, AT_UPDATE_INTERVAL)
}
var timeOutCountdown = function () {
    atRefreshSecondsAlertTable();
    setTimeout(timeOutCountdown,10)
}
setTimeout(timeOutCountdown,0)
setTimeout(timeOutFunction,AT_UPDATE_INTERVAL)
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


var atUpdateHour = function () {
    var now = moment(Date.now()).format("HH:mm:ss");
    //if (GLOBAL_DEBUG) {
    $("#"+AT_HOUR).text(now);
    //}
    setTimeout(atUpdateHour,1000);
}
setTimeout(atUpdateHour,0)

if(GLOBAL_DEBUG) {
    setTimeout(atInfoClick,100)
}

var atClearResults = function () {
    var body = $("#"+AT_TABLE_RESULTS+" tbody");
    var templateRow =  body.find("."+DASHBOARD_TEMPLATES).clone()//.removeClass(DASHBOARD_TEMPLATES);
    body.empty();
    body.append(templateRow);
}

var atClearAlerts = function () {
    var body = $("#"+AT_TABLE_LEFT+" tbody");
    var templateRow =  body.find("."+DASHBOARD_TEMPLATES).clone()//.removeClass(DASHBOARD_TEMPLATES);
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
    //var body = $("#"+AT_TABLE_EVENTS+" tbody");
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