/**
 * Created by Francisco Huertas on 29/10/14.
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
var PRE = views[0][7].constantsPrefix;
/* HTML ID's and classes*/
var DAP_COLS = 1;

var DAP_THRESHOLD_SLIDER_PANEL = PRE + "-threshold-slider-panel";
var DAP_SPAN_THRESHOLD_VALUE = PRE + "-threshold-value";
var DAP_CHARTS = PRE + "-charts"
var DAP_TOOL_BAR = PRE + "-tool-bar"
var DAP_CHART = PRE + "-chart"
var DAP_COLUMNS_CLICK = PRE + "-columns-click"
var DAP_SELECT_CHART_BUTTON = PRE +"-select-graph"
var DAP_SVG_UP = PRE +"-svg-up"
var DAP_SVG_EVENTS_IN_UP_CANVAS = PRE +"-svg-events-in-up-canvas"
var DAP_SVG_FOOTER_CLASS = PRE + "-svg-footer-class"
var DAP_INPUT_URL = PRE + "-input-url"
var DAP_EVENTS_COUNT = PRE + "-events-count"
var DAP_EVENTS_COUNT_PARENT = PRE + "-events-count-parent"
var DAP_TOOLTIP_EVENTS_OCCURRED = PRE + "-tooltip-events-occurred"
var DAP_TOOLTIP_EVENTS_OCCURRED_INTERNAL = PRE + "-tooltip-events-occurred-internal"
var DAP_FOOTER_TABLE_GRAPH = PRE + "-table-graph-footer"
var DAP_FOOTER_CHART_EVENTS = PRE + "-footer-chart-stats-events"
var DAP_TABLE_EVENTS_OCCURRENCE = PRE + "-table-evens-occurrence"
var DAP_TABLE_EVENTS_PREDICTION = PRE + "-table-evens-prediction"
var DAP_TABLE_EVENTS_PREDICTION_RESULT = PRE + "-table-evens-prediction-result"
var DAP_TABLE_EVENTS_ALERTS = PRE + "-table-evens-alerts"
var DAP_CELL_1 = PRE +"-td-1"
var DAP_CELL_2 = PRE +"-td-2"
var DAP_CELL_3 = PRE +"-td-3"
var DAP_TEXT_HIGHLIGHT = PRE + "-highlight-text"
var DAP_SLIDER_TIME = PRE + "-sliderControls-time-slider"
var DAP_SLIDER_FACTOR = PRE + "-sliderControls-window-factor"
var DAP_SLIDER_START_ID = PRE + "-sliderControls-start-date"
var DAP_SLIDER_END_ID = PRE + "-sliderControls-end-date"
var DAP_SLIDER_CURRENT_ID = PRE + "-sliderControls-current-date"
var DAP_SLIDER_FACTOR_CURRENT_ID = PRE + "-slider-window-factor-current"
var DAP_EVENT_CHECKBOX = PRE + "-events-checkbox"
var DAP_EVENT_CHECKBOX_ALL = PRE + "-checkbox-all"
var DAP_EVENT_CHECKBOX_PREFIX_EVENT = PRE + "-"
var DAP_TEMPLATE = PRE + "-template"


var DAP_Z_INDEX_LVL_1 = 20;

var DAP_EVENT_CLASS_OCCURRENCE_PREFIX = PRE + "-event-class-occurrence-"
var DAP_EVENT_CLASS_PREDICTION = PRE + "-prediction-class"
var DAP_EVENT_CLASS_PREDICTION_RESULT = PRE + "-prediction-class-prefix-result-"
var DAP_EVENT_CLASS_SUMMARY = PRE + "-event-class-summary"
var DAP_EVENT_CLASS_ALERT = PRE + "-event-class-alert"
var DAP_EVENT_TYPE_CLASS = PRE + "-event-type-class-"
var DAP_OCCURRENCE_CLASS = PRE + "-event-occurrence"

/*Other constants*/
var DAP_LINE_BOLD = 4;
var DAP_LINE_NORMAL = 2
var DAP_MAX_LG_COL = 12;
var DAP_CHARTS_DEFAULT_TIME = 20*60*1000;
var DAP_SVG_FOOTER_LINE_FONT_SIZE = 10;
var DAP_SVG_FOOTER_LINE_HEIGHT = 10 + DAP_SVG_FOOTER_LINE_FONT_SIZE;
var DAP_SVG_FOOTER_LINE_SEPARATION = 60000 // in milliseconds
var DAP_SVG_FOOTER_SUB_LINE_HEIGHT = 3
var DAP_SVG_FOOTER_STROKE_VERTICAL_LINE_HIDDEN = 0
var DAP_SVG_FOOTER_STROKE_VERTICAL_LINE = 1
var DAP_SVG_FOOTER_STROKE_VERTICAL_LINE_BOLD = 3
var DAP_SVG_LINES_COLOR = "#ccc"
var DAP_SVG_FOOTER_FONT_FAMILY = "monospace"
var DAP_SVG_FOOTER_MARKS = 6;
var DAP_HEIGHT_STEP = 10;
var DAP_EVENT_CIRCLE_RADIUS = 3;
var DAP_EVENT_CIRCLE_RADIUS_HIGHLIGHT = 4;
var DAP_EVENT_LINE_WIDTH = 1;
var DAP_EVENT_LINE_WIDTH_HOVER = 2;
var DAP_ZERO_POS = 0.5
//var DAP_TIMEOUT = -( DAP_CHARTS_DEFAULT_TIME * DAP_ZERO_POS)
var DAP_TIMEOUT = 200

var SYSTEM_EVENT_ORIGIN_PREDICTION = "prediction";
var SYSTEM_EVENT_ORIGIN_SUMMARY = "event";
var SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT = "prediction_result";
var SYSTEM_EVENT_ORIGIN_OCCURRENCE = "occurrence";
var SYSTEM_EVENT_ORIGIN_ALERT = "alert";

/*WS constant messages*/
var DAP_WS_EVENT = "event"
var DAP_WS_PREDICTION = "prediction"
var DAP_WS_TIME = "time"
var DAP_WS_BEFORE = "before"
var DAP_WS_AFTER = "after"
var DAP_WS_RESULT = "result"
var DAP_WS_MODEL = "model"
var DAP_WS_RESULT_HIT = "hit"
var DAP_WS_RESULT_MISS_FALSE_POSITIVE = "miss-fp"
var DAP_WS_RESULT_MISS_FALSE_NEGATIVE = "miss-fn"
var DAP_WS_RESULT_HIT_CLASS = PRE + "-hit"
var DAP_WS_RESULT_MISS_FALSE_POSITIVE_CLASS = PRE + "-miss-fp"
var DAP_WS_RESULT_MISS_FALSE_NEGATIVE_CLASS = PRE + "-miss-fn"
var DAP_WS_ALERT = "alert"
var DAP_WS_ALERT_TIMEOUT = "timeout"
var DAP_WS_ALERT_ON = "on"
var DAP_WS_ALERT_OFF = "off"
var DAP_SECOND = 1000;
var DAP_MINUTE = 60 * DAP_SECOND
var DAP_HOUR = 60 * DAP_MINUTE ;



/*DEBUG vars*/
if (GLOBAL_DEBUG){
    //DAP_CHARTS_DEFAULT_TIME = 150*1000;
    DAP_SVG_FOOTER_LINE_SEPARATION = 60000
    var debugWSS = []
    var num = 0;
    var DAP_STOP = false
}

/*view vars*/
var dapCharts = []
var actualHeight = 200;
var activeSmoothie = undefined;

var dapResizeFunction = function (){
    var cssWidth = (100 / DAP_COLS) - 2;
    var colNum =Math.floor(DAP_MAX_LG_COL / DAP_COLS);
    $('#'+DAP_CHARTS).find('.'+DAP_CHART).css('width',cssWidth+"%")
    dapResizingChart();
    dapResizingChart();
}

var dap_clear = function (){
    if (GLOBAL_DEBUG){
        DAP_STOP = true;

    }
}

var dapInitLeftColumnAndFooter = function (){
    var toolBar = $("#"+DAP_TOOL_BAR)
    toolBar.detach();
    toolBar.appendTo($("#"+LEFT_COLUMN_CONTENT));
    var footerContent = $("."+DAP_FOOTER_TABLE_GRAPH).clone()

    $("#"+FOOTER_CONTENT_ID).append(footerContent)
}

var dapStartRoutines = function (){
    var bundle = {}
    dapInitLeftColumnAndFooter();
    bundle.target = $("#"+DAP_COLUMNS_CLICK).find("input[value="+DAP_COLS+"]")[0]
    dapColumnsClick(bundle)

}


var graph = 0;
var dapAddGraph= function () {
    var section = $('.'+DASHBOARD_TEMPLATES).find('.'+DAP_CHART).clone()

    section.find('.template').removeClass('section')
    section.removeAttr('class').addClass(DAP_CHART)//.addClass("col-lg-1");
    section.appendTo('#'+DAP_CHARTS);
    var smoothie = {}//new SmoothieChart(DAP_SMOOTHIE_DEFAULT_OPTIONS);
    smoothie.graphTime = DAP_CHARTS_DEFAULT_TIME;
    smoothie.zero = DAP_ZERO_POS

    smoothie.verticalLineTime =DAP_SVG_FOOTER_LINE_SEPARATION;
    smoothie.footerVerticalLine = DAP_SVG_FOOTER_LINE_SEPARATION;
    smoothie.eventsHappend = [];
    smoothie.events = {}
    smoothie.actualColor = 0;
    smoothie.after = DAP_CHARTS_DEFAULT_TIME/2;
    smoothie.before = DAP_CHARTS_DEFAULT_TIME/2;
    var svg = section.find('svg.'+DAP_SVG_UP)[0]
    svg.smoothie = smoothie;
    svg.smoothie.paintName = true;
    svg.predictionResults = []
    svg.alerts = {}
    svg.startDate = undefined;
    svg.endDate = undefined;
    svg.currentDate = undefined;
    svg.currentFactor = 1;
    section.find("."+DAP_SLIDER_TIME).slider({
        slide: dapRepaintSlider.bind(svg),
        stop: dapPaintFooter

    });
    //section.find("."+DAP_SLIDER_FACTOR).slider();
    section.find("."+DAP_SLIDER_FACTOR).slider({
        value:100,
        min:50,
        max:200,
        slide: dapChangeWindowSlider.bind(svg)
    });




    dapCharts.push(smoothie)
    dapResizeFunction()
}

var dapDeleteGraph = function (element) {
    var div = dapGetGraphParent(element);
    var svg = dapGetSvg(element)[0];
    if (svg.wss != undefined) {
        $.each(svg.wss,function (){
            this.close();
        })
    }
    div.remove();

}

var dapActiveNames = function (event) {
    var svg = dapGetSvg(event.target)
    svg[0].smoothie.paintName = !(svg[0].smoothie.paintName);
}


var dapAddEventToSmoothie = function (svg,eventName){
    var smoothie = svg.smoothie
    if (smoothie.events[eventName] === undefined){
        var color = smoothie.actualColor;
        smoothie.actualColor++;
        if (smoothie.actualColor >= web_colors.length){
            smoothie.actualColor = 0;
        }
        smoothie.events[eventName] = {}
        smoothie.events[eventName].color = web_colors[color];
        smoothie.events[eventName].id = eventName
        smoothie.events[eventName].timeSeries = new TimeSeries();
        smoothie.events[eventName].occurrences = [];
        smoothie.events[eventName].position = Math.random();
        smoothie.events[eventName].filter = true;
    }
    return smoothie.events[eventName];

}


var dapResizingChart = function (charts){
    var svg;

    svg = $('#'+DAP_CHARTS).find('svg.'+DAP_SVG_UP)
    svg.attr('height',actualHeight)
    $(function (){
        var width = svg.parent().width();
        if (width != 0 ){
            svg.attr('width', width)
            $.each(svg,function(){
                if (this.smoothie !== undefined) {
                    this.smoothie.timePerPixel = this.smoothie.graphTime / width;
                    if (this.smoothie.zero === undefined) {
                        this.smoothie.zero = DAP_ZERO_POS
                    }
                    var svg =  $(this).parent().find('svg.'+DAP_SVG_FOOTER_CLASS);

                    drawFooter(svg,width,this.smoothie.timePerPixel,this.smoothie.footerVerticalLine,this.smoothie.zero);
                    drawOnSvgBase(this)
                    drawOnSvgEvents($(this))
                }
                var divChart = dapGetGraphParent(svg);
                divChart.find("."+DAP_EVENTS_COUNT_PARENT).css('height',$(this).parent().height())
            })
        }
    })
}

var getIndexOfSvg = function (svg) {
    return $('svg.'+DAP_SVG_UP).index(svg)
}

var drawOnSvgEvents = function (jQSvg) {
    var svg = jQSvg[0];
    jQSvg.find("."+DAP_SVG_EVENTS_IN_UP_CANVAS).remove();
    var d3Svg = d3.select(jQSvg[0]);
    var thisDate = Date.now()
    var cy = jQSvg.height()-2
    var eventsToDelete = []
    var predictinoResultToDelete = [];
    var count = 1;
    jQSvg.find("."+DAP_TOOLTIP_EVENTS_OCCURRED).remove();

    if (svg.wss != undefined) {
        $.each(svg.wss, function () {
            dapDrawEventsInGraph(svg);
        })
    }


    if (eventsToDelete.length > 0 || predictinoResultToDelete.length > 0){
        for (var i = eventsToDelete.length-1;i >=0;i-- ) {
            svg.smoothie.eventsHappend.splice(eventsToDelete[i],1);
        }
        for (var i = predictinoResultToDelete.length-1;i >=0;i-- ) {
            svg.predictionResults.splice(predictinoResultToDelete[i],1);
        }
        dapPaintEventsList(jQSvg)
        dapPaintFooter();

    }


}

var dapPaintFooter = function (){
    var jQSvg = getActiveGraph();

        paintFooterPredictions(jQSvg)
        paintFooterEvents(jQSvg)
        paintFooterPredictionResult(jQSvg)
        paintFooterAlerts(jQSvg);
}

var paintFooterAlerts = function (jQSvg){
    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+DAP_TABLE_EVENTS_ALERTS).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    tbody.empty()
    tbody.append(genericLine)

    var svg = jQSvg[0]
    if (svg != undefined) {
        var svgIndex = getIndexOfSvg(svg)
        $.each(svg.alerts, function (key) {
            var event = dapAddEventToSmoothie(svg, key);
            var className = DAP_EVENT_TYPE_CLASS + svgIndex + "-" + key
            var newLine = genericLine.clone().removeClass(DASHBOARD_TEMPLATES).addClass(className).addClass(DAP_EVENT_CLASS_ALERT)
            newLine.css('color', event.color)
            newLine.find("." + DAP_CELL_1).text(key);
            newLine.find("." + DAP_CELL_2).text(this.type);
            newLine.mouseenter(function (svg) {
                this.isAlertHover = true;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_ALERT, event: this});
            }.bind(event, svg))
            newLine.mouseleave(function (svg) {
                this.isAlertHover = false;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_ALERT, event: this});
            }.bind(event, svg))
            newLine.click(function (svg) {
                this.isAlertClicked = !this.isAlertClicked;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_ALERT, event: this});
            }.bind(event, svg))
            tbody.append(newLine)
        })
    }

}
var paintFooterPredictions = function (jQSvg) {
    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+DAP_TABLE_EVENTS_PREDICTION ).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    tbody.empty()
    tbody.append(genericLine)

    var svg = jQSvg[0]
    if (svg != undefined) {
        var svgIndex = getIndexOfSvg(svg)
        $.each(svg.smoothie.events, function (key) {
            if (this.timeSeries.data.length == 0) {
                return;
            }
            var line = genericLine.clone().removeAttr('class')

            var className = DAP_EVENT_TYPE_CLASS + svgIndex + "-" + this.id
            var spanEvent = $('<span>' + this.id + '</span>').css('color', this.color)
            var spanPrediction = $('<span>' + this.timeSeries.data[this.timeSeries.data.length - 1][1] + '</span>').css('color', this.color)
            line.find('.' + DAP_CELL_1).removeAttr('class').addClass(className).addClass(DAP_EVENT_CLASS_PREDICTION).append(spanEvent);
            line.find('.' + DAP_CELL_2).removeAttr('class').addClass(className).addClass(DAP_EVENT_CLASS_PREDICTION).append(spanPrediction);
            tbody.append(line)

            line.mouseenter(function (svg) {
                this.isPredicitionHover = true;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_PREDICTION, event: this});

            }.bind(this, svg))

            line.mouseleave(function (svg) {
                this.isPredicitionHover = false;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_PREDICTION, event: this})
            }.bind(this, svg))
            line.click(function (svg) {
                this.isPredictionClicked = !this.isPredictionClicked;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_PREDICTION, event: this})
            }.bind(this, svg))

        })
    }
}

var paintFooterEvents = function (jQSvg){
    var tbody = $("#" + FOOTER_CONTENT_ID).find("." + DAP_TABLE_EVENTS_OCCURRENCE).find('tbody');
    var genericLine = tbody.find("tr." + DASHBOARD_TEMPLATES)
    tbody.empty()
    tbody.append(genericLine)

    var svg = jQSvg[0];
    if (svg != undefined) {
        var svgIndex = getIndexOfSvg(svg)
        for (var i = svg.smoothie.eventsHappend.length - 1; i >= 0; i--) {
            var eventOccurrence = svg.smoothie.eventsHappend[i];
            var line = genericLine.clone().removeAttr('class')
            var className1 = DAP_EVENT_CLASS_OCCURRENCE_PREFIX + svgIndex + "-" + eventOccurrence.event.id + "-" + eventOccurrence.time
            var className2 = DAP_EVENT_TYPE_CLASS + svgIndex + "-" + eventOccurrence.event.id;
            var spanEvent = $('<span>' + eventOccurrence.event.id + '</span>').css('color', eventOccurrence.event.color)
            var spanTime = $('<span>' + printDate(eventOccurrence.time) + '</span>').css('color', eventOccurrence.event.color)
            line.find('.' + DAP_CELL_1).removeAttr('class').addClass(className1).addClass(className2).append(spanEvent);
            line.find('.' + DAP_CELL_2).removeAttr('class').addClass(className1).addClass(className2).append(spanTime);
            tbody.append(line);
            line.mouseenter(function (svg) {
                this.isHover = true;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_OCCURRENCE, event: this})
            }.bind(eventOccurrence, svg))

            line.mouseleave(function (svg) {
                this.isHover = false;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_OCCURRENCE, event: this})
            }.bind(eventOccurrence, svg))

            line.click(function (svg) {
                this.isClicked = !this.isClicked;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_OCCURRENCE, event: this})
            }.bind(eventOccurrence, svg))
        }
    }
}

var paintFooterPredictionResult = function (jQSvg){
    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+DAP_TABLE_EVENTS_PREDICTION_RESULT).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    tbody.empty().append(genericLine);
    var svg = jQSvg[0]
    if (svg != undefined) {
        var svgIndex = getIndexOfSvg(svg);
        $.each(svg.predictionResults, function () {
            var event = this.event;
            var className = DAP_EVENT_TYPE_CLASS + svgIndex + "-" + event.id
            var newLine = genericLine.clone().removeClass(DASHBOARD_TEMPLATES);
            newLine.addClass(className).addClass(DAP_EVENT_CLASS_PREDICTION_RESULT + svgIndex + "-" + event.id + "-" + this.time)
            newLine.find("." + DAP_CELL_1).text(this.event.id).css('color', event.color)
            newLine.find("." + DAP_CELL_2).text(printDate(this.time)).css('color', event.color)
            var img;
            if (this.result === DAP_WS_RESULT_MISS_FALSE_POSITIVE) {
                img = $('<div/>').addClass(DAP_WS_RESULT_MISS_FALSE_POSITIVE_CLASS)//.addClass(DAP_EVENT_TYPE_CLASS+this.event)
            } else if (this.result === DAP_WS_RESULT_MISS_FALSE_NEGATIVE) {
                img = $('<div/>').addClass(DAP_WS_RESULT_MISS_FALSE_NEGATIVE_CLASS)
            } else {
                img = $('<div/>').addClass(DAP_WS_RESULT_HIT_CLASS)
            }
            newLine.find("." + DAP_CELL_3).append(img)
            newLine.mouseenter(function (svg) {
                this.isHover = true;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT, event: this});


            }.bind(this, svg))

            newLine.mouseleave(function (svg) {
                this.isHover = false;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT, event: this})
            }.bind(this, svg))
            newLine.click(function (svg) {
                this.isClicked = !this.isClicked;
                dapMarkText(svg, {type: SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT, event: this})
            }.bind(this, svg))
            tbody.append(newLine);
        })
    }
}

var dapPaintEventsList = function (jQSvg){
    /*Removing tooltip para evitar que se queden si se mueve el raton*/
    if (jQSvg[0] == undefined) {

    } else {
        $(jQSvg[0].smoothie.eventsHappend).map(function () {
            this.isHover = false;
            return this;
        })
        /*Paint in the left*/
        dapPaintEventsInADiv(jQSvg);
        if (isActiveGraph(dapGetGraphParent(jQSvg))) {
            paintFooterEvents(jQSvg)
        }
    }
}


var dapPaintEventsInADiv = function (jQSvg) {
    var container = dapGetGraphParent(jQSvg).find('.'+DAP_EVENTS_COUNT).find('tbody');
    var genericLine = container.find("."+DASHBOARD_TEMPLATES).clone()
    container.empty();
    container.append(genericLine)
    var svg = jQSvg[0];
    var smoothie = svg.smoothie;
    var events = {}

    /*Quitado de momento porque si no hay alertas y demas meten ruido*/
    //$.each(smoothie.events,function (){
    //    events[this.id] = {}
    //    events[this.id].count = 0;
    //    events[this.id].event = this;
    //})
    //$.each(svg.alerts, function (key) {
    //    events[key] = {}
    //    events[key].count = 0;
    //    events[key].event = smoothie.events[key];
    //
    //})
    //$.each(svg.predictionResults,function (){
    //    events[this.event.id] = {}
    //    events[this.event.id].count = 0;
    //    events[this.event.id].event = this.event;
    //})
    $.each(smoothie.eventsHappend,function () {
        if (events[this.event.id] === undefined){
            events[this.event.id] = {};
            events[this.event.id].count = 1;
            events[this.event.id].event = this.event;
        }else {
            events[this.event.id].count++;
        }
    })


    var shortedKeys = $.map(events,function (value) {
        return [value.event.id]
    })
    shortedKeys.sort(function (a,b){
        var diff = events[b].count - events[a].count ;
        return (diff == 0)? events[a].event.id.localeCompare(events[b].event.id):diff;
    })
    var normalLines = []
    var alertedLines = [];
    $.each(shortedKeys, function () {
        var newLine = genericLine.clone().removeClass(DASHBOARD_TEMPLATES).addClass(DAP_EVENT_TYPE_CLASS+getIndexOfSvg(svg)+"-"+this).addClass(DAP_EVENT_CLASS_SUMMARY);
        var event = dapAddEventToSmoothie(svg,this);
        newLine.find("."+DAP_CELL_1).text(this)
        var highlighted = event.isSumaryHover || event.isSumaryClicked
        if (highlighted) {
            alternativeAddClass(newLine,DAP_TEXT_HIGHLIGHT)
        } else{
            alternativeRemoveClass(newLine,DAP_TEXT_HIGHLIGHT)
        };
        newLine.find("."+DAP_CELL_2).text(events[this].count)
        newLine.find("."+DAP_CELL_3+" input")[0].value = this;
        newLine.find("."+DAP_CELL_3+" input").prop("checked",event.filter)
        if (svg.alerts[this] !== undefined){
            if (svg.alerts[this].type === DAP_WS_ALERT_ON){
                newLine.find("."+DAP_CELL_3).append($('<div class="dap-alert-box"/>').css('color',event.color).css('background',event.color))
                alertedLines.push(newLine)
            } else {
                normalLines.push(newLine)
            }
        } else {
            normalLines.push(newLine)
        }
        newLine.find("."+DAP_CELL_1).mouseenter(function (svg){
            this.isSumaryHover = true;
            dapMarkText(svg,{type:SYSTEM_EVENT_ORIGIN_SUMMARY,event:this});
        }.bind(event,svg))
        newLine.find("."+DAP_CELL_1).mouseleave(function (svg){
            this.isSumaryHover = false;
            dapMarkText(svg, {type:SYSTEM_EVENT_ORIGIN_SUMMARY,event:this});
        }.bind(event,svg))
        newLine.find("."+DAP_CELL_1).click(function (svg) {
            this.isSumaryClicked = !this.isSumaryClicked;
            dapMarkText(svg, {type:SYSTEM_EVENT_ORIGIN_SUMMARY,event:this});
        }.bind(event,svg))
        newLine.css('color',event.color)
//        container.append(newLine)
    })

    for (var i = 0; i < alertedLines.length;i++){
        container.append(alertedLines[i])
        if (i == alertedLines.length-1){
            alertedLines[i].css('border-bottom','1px solid black')
        }
    }
    for (var i = 0; i < normalLines.length;i++){
        container.append(normalLines[i])
    }

}



var cleanPredictionResults = function () {
    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+DAP_TABLE_EVENTS_PREDICTION_RESULT).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    tbody.empty().append(genericLine)
    var activeSvg = getActiveGraph();
    activeSvg[0].predictionResults = [];

}


var dapMarkText = function (svg, systemEvent) {
    var systemEventOrigin = systemEvent.type;
    var eventOccurrence;
    var eventPredictionResult;
    var event;
    var eventClass;
    var svgIndex = getIndexOfSvg(svg);
    switch (systemEventOrigin) {
        case SYSTEM_EVENT_ORIGIN_SUMMARY:
            event = systemEvent.event;
            break
        case SYSTEM_EVENT_ORIGIN_OCCURRENCE:
            eventOccurrence = systemEvent.event;
            event = eventOccurrence.event;
            break;
        case SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT:
            eventPredictionResult = systemEvent.event;
            event = eventPredictionResult.event;
            break;
        case SYSTEM_EVENT_ORIGIN_PREDICTION:
            event = systemEvent.event;
            break;
        case SYSTEM_EVENT_ORIGIN_ALERT:
            event = systemEvent.event;
            break;
    }
    eventClass = DAP_EVENT_TYPE_CLASS + svgIndex +"-" + event.id;
    var elements = $(document.getElementsByClassName(eventClass))
    if (event.isSumaryHover || event.isSumaryClicked) {
        // add class and remove class does not work with svg elements, this sentence is equivalment
        alternativeAddClass(elements,DAP_TEXT_HIGHLIGHT);
        dapHighlightSvg(elements,true);
    } else {
        alternativeRemoveClass(elements,DAP_TEXT_HIGHLIGHT);
        dapHighlightSvg(elements,false);
    }

    switch (systemEventOrigin) {
        case SYSTEM_EVENT_ORIGIN_OCCURRENCE:
            if (eventOccurrence.isHover || eventOccurrence.isClicked) {
                var stringOccurrenceClass = DAP_EVENT_CLASS_OCCURRENCE_PREFIX + svgIndex + "-" + eventOccurrence.event.id + "-" + eventOccurrence.time
                dapHighlightSvg($(document.getElementsByClassName(stringOccurrenceClass)),true);
                alternativeAddClass($(document.getElementsByClassName(eventClass+ " "+DAP_EVENT_CLASS_SUMMARY)),DAP_TEXT_HIGHLIGHT)
                alternativeAddClass($(document.getElementsByClassName(stringOccurrenceClass)),DAP_TEXT_HIGHLIGHT)
            }

            break;
        case SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT:
            if (eventPredictionResult.isHover || eventPredictionResult.isClicked) {
                var stringPredictionResultClass = DAP_EVENT_CLASS_PREDICTION_RESULT+svgIndex+"-"+event.id+"-"+eventPredictionResult.time
                $("." + stringOccurrenceClass).css('font-weight', 'bold')
                $("."+eventClass+"."+DAP_EVENT_CLASS_SUMMARY).css('font-weight', 'bold')
                $("."+eventClass+"."+stringPredictionResultClass).css('font-weight', 'bold')
            }
            break;
        case SYSTEM_EVENT_ORIGIN_PREDICTION:
            if (event.isPredicitionHover|| event.isPredictionClicked) {
                $("."+eventClass+"."+DAP_EVENT_CLASS_SUMMARY).css('font-weight', 'bold')
                $("."+eventClass+"."+DAP_EVENT_CLASS_PREDICTION).css('font-weight', 'bold')
            }
            break;
        case SYSTEM_EVENT_ORIGIN_ALERT:
            if (event.isAlertClicked || event.isAlertHover){
                $("."+eventClass+"."+DAP_EVENT_CLASS_SUMMARY).css('font-weight', 'bold')
                $("."+eventClass+"."+DAP_EVENT_CLASS_ALERT).css('font-weight', 'bold')

            }
            break;
    }

}

var drawOnSvgBase = function (svg){
    var jQSvg = $(svg)
    jQSvg.empty();
    var width = parseInt(jQSvg.width());
    var height = parseInt(jQSvg.height());
    var d3Svg = d3.selectAll(jQSvg);
    //var svg;
    if (svg.smoothie.zero !== undefined) {
        d3Svg.append('svg')
            .attr('class', DAP_SVG_UP)
            .style('width', width + "px")
            .style('height', (height + 2) + "px")
            .style('left', jQSvg.position().left)
            .style('top', jQSvg.position().top);
        d3Svg.append('line')
            .attr('x1', jQSvg.width() * svg.smoothie.zero)
            .attr('x2', jQSvg.width() * svg.smoothie.zero)
            .attr('y1', 0)
            .attr('y2', jQSvg.height())
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE_BOLD)
            .attr('stroke', '#ff5555')
            .attr('shape-rendering', "crispEdges")
    }
    /*Draw vertical lines left*/
    var lines = 9;
    var separation = jQSvg.width() * 1/(lines+1)
    var zeroPos = jQSvg.width() * svg.smoothie.zero;
    var position = zeroPos;
    while ((position -= separation) > 0) {
        //var hPosition = jQSvg.width() * (i+1)/(lines+1)
        d3Svg.append('line')
            .attr('x1', position )
            .attr('x2', position )
            .attr('y1', 0)
            .attr('y2', jQSvg.height())
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', DAP_SVG_LINES_COLOR)
            .attr('shape-rendering', "crispEdges")
    }

    /*Draw vertical right lines*/
    position = zeroPos;
    while ((position += separation) < jQSvg.width()) {
        //var hPosition = jQSvg.width() * (i+1)/(lines+1)
        d3Svg.append('line')
            .attr('x1', position )
            .attr('x2', position )
            .attr('y1', 0)
            .attr('y2', jQSvg.height())
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', DAP_SVG_LINES_COLOR)
            .attr('shape-rendering', "crispEdges")
    }

    /*Draw horizonal*/
    lines = 4;
    separation = jQSvg.height() / (lines + 1);
    position = jQSvg.height();
    while ((position -= separation) > 0) {
        d3Svg.append('line')
            .attr('x1', 0 )
            .attr('x2', jQSvg.width() )
            .attr('y1', position)
            .attr('y2', position)
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', DAP_SVG_LINES_COLOR)
            .attr('shape-rendering', "crispEdges")
    }

    var currentDate
    var startDate
    var endDate
    var stringFactor = parseInt(svg.currentFactor * 100);

    if (!(svg.startDate)) {
        startDate = "----";
        endDate = "----";
        currentDate = "----";
    } else {
        var options = {
            hour12: false,

        }
        currentDate = dapParseDate(svg.currentDate);
        startDate = dapParseDate(svg.startDate);
        endDate = dapParseDate(svg.endDate);

    }

    var divParent = dapGetGraphParent (jQSvg)
    divParent.find("."+DAP_SLIDER_START_ID).text(startDate);
    divParent.find("."+DAP_SLIDER_END_ID).text(endDate);
    divParent.find("."+DAP_SLIDER_CURRENT_ID).text(currentDate);
    divParent.find("."+DAP_SLIDER_FACTOR_CURRENT_ID).text(stringFactor)





}

var drawFooter = function (svg,width,timePerPixel,lineSeparation,zero){
    var zeroPos;
    if (zero === undefined){
        zeroPos = width * DAP_ZERO_POS;
    } else {
        zeroPos = width * zero;
    }
    svg.empty();
    svg.attr('height',DAP_SVG_FOOTER_LINE_HEIGHT);
    svg.attr('width',width);
    var v_x1 = 0
    var v_x2 = width
    var v_y = DAP_SVG_FOOTER_SUB_LINE_HEIGHT
    var d3Svg = d3.selectAll(svg.toArray())
    d3Svg.append('line')
        .attr('x1',v_x1)
        .attr('x2',v_x2)
        .attr('y1',v_y)
        .attr('y2',v_y)
        .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
        .attr('stroke', 'black')
        .attr('shape-rendering',"crispEdges")
    //

    var widthStep = lineSeparation / timePerPixel ;
    /*Zero */
    var h_y1 = 0
    var h_y2 = DAP_SVG_FOOTER_SUB_LINE_HEIGHT;
    var h_x = zeroPos;
    d3Svg.append('line')
        .attr('x1',h_x)
        .attr('x2',h_x)
        .attr('y1',h_y1)
        .attr('y2',h_y2)
        .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
        .attr('stroke', 'black')
        .attr('shape-rendering',"crispEdges")
    d3Svg.append('text')
        .attr('fill','black')
        .attr('font-family',DAP_SVG_FOOTER_FONT_FAMILY)
        .attr('font-size',DAP_SVG_FOOTER_LINE_FONT_SIZE + "px")
        .attr('text-anchor',"middle")
        .attr('x',h_x)
        .attr('y',DAP_SVG_FOOTER_LINE_FONT_SIZE + DAP_SVG_FOOTER_SUB_LINE_HEIGHT)
        .text(footerTextCalculator(0,lineSeparation))
    /*Negatives*/
    for (var i = zeroPos-widthStep,j=1;i >= 0; i-=widthStep,j++  ){
        h_x = i;

        var marks
        d3Svg.append('line')
            .attr('x1',h_x)
            .attr('x2',h_x)
            .attr('y1',h_y1)
            .attr('y2',h_y2)
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', 'black')
            .attr('shape-rendering',"crispEdges")
        d3Svg.append('text')
            .attr('fill','black')
            .attr('font-family',DAP_SVG_FOOTER_FONT_FAMILY)
            .attr('font-size',DAP_SVG_FOOTER_LINE_FONT_SIZE + "px")
            .attr('text-anchor',"middle")
            .attr('x',i)
            .attr('y',DAP_SVG_FOOTER_LINE_FONT_SIZE + DAP_SVG_FOOTER_SUB_LINE_HEIGHT)
            .text("-"+footerTextCalculator(j,lineSeparation))
    }
    /*Positives*/
    for (i = zeroPos+widthStep,j=1;i < width; i+=widthStep,j++  ){
        h_x = i;

        d3Svg.append('line')
            .attr('x1',h_x)
            .attr('x2',h_x)
            .attr('y1',h_y1)
            .attr('y2',h_y2)
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', 'black')
            .attr('shape-rendering',"crispEdges")
        d3Svg.append('text')
            .attr('fill','black')
            .attr('font-family',DAP_SVG_FOOTER_FONT_FAMILY)
            .attr('font-size',DAP_SVG_FOOTER_LINE_FONT_SIZE + "px")
            .attr('text-anchor',"middle")
            .attr('x',i)
            .attr('y',DAP_SVG_FOOTER_LINE_FONT_SIZE + DAP_SVG_FOOTER_SUB_LINE_HEIGHT)
            .text(footerTextCalculator(j,lineSeparation))
    }
}

var footerTextCalculator = function (pos, lineSeparation,precission){
    if (precission === undefined){
        precission = 4;
    }
    if (pos == 0){
        return 0;
    }
    var actualPrecision = 0;
    var actualTime = pos * lineSeparation;


    var cad = "";
    var thisTime;
    if (actualTime >= DAP_HOUR){
        thisTime = parseInt(actualTime/DAP_HOUR)
        actualTime -= thisTime * DAP_HOUR;
        cad += thisTime+"h";
        actualPrecision++;

        if (actualPrecision >= precission)
            return cad;
    }
    if (actualTime >= DAP_MINUTE){
        thisTime = parseInt(actualTime/DAP_MINUTE)
        actualTime -= thisTime * DAP_MINUTE;
        cad += thisTime+"m";
        actualPrecision++;

        if (actualPrecision >= precission)
            return cad;
    }
    if (actualTime >= DAP_SECOND){
        thisTime = parseInt(actualTime/DAP_SECOND)
        actualTime -= thisTime * DAP_SECOND;
        cad += thisTime+"s";
        actualPrecision++;

        if (actualPrecision >= precission)
            return cad;
    }
    return cad;


}

var DAPSelectChart = function (event) {
    var isSelected = $(event.target).hasClass('active')
    $("."+DAP_SELECT_CHART_BUTTON).removeClass('active');
    if (isSelected) {
        $(event.target).removeClass('active')
    } else {
        $(event.target).addClass('active')
    }
    $("#"+DAP_FOOTER_CHART_EVENTS).empty()
    var activeSvg = getActiveGraph();
    dapPaintEventsList(activeSvg)
    dapPaintFooter();
}
var dapResizingCols = function () {

    // De esta forma se ejecuta al cargar ejecutar todas las cosas, se hace asi porque antes no se
    // sabe cuanto vale el ancho

    dapResizeFunction()


}

function dapColumnsClick(event){
    $("#"+DAP_COLUMNS_CLICK).find('.btn.btn-primary').removeClass('btn-primary').addClass('btn-default');
    var button = event.target;
    while (!$(button).hasClass('btn')){
        button = button.parentNode;
    }
    $(button).removeClass('btn-default').addClass('btn-primary');
    var newCols = parseInt($(button).find('input').attr('value'))
    if (newCols != DAP_COLS) {
        DAP_COLS = newCols
        dapResizingCols();
    }
}



var dapLoadSource = function (event) {
    if (event.keyCode == 13){
        console.log("Changing the source");
        dapLoadSource_click();


    }
}

var dapLoadSource_click = function (){
    _dapLoadSource($("#"+DAP_INPUT_URL).val());
}

var _dapLoadSource = function (url) {
    var svg =  getActiveGraph()[0];
    if (svg === undefined){
        return;
    }

    if (url === undefined || url == ""){
        return;
    }
    // TODO
//    odv_clear(true);
    var ws = new ReconnectingWebSocket('ws://' + url);
    if (GLOBAL_DEBUG) {
        debugWSS.push(ws);
    }
    ws.onopen = function(e) {
        console.log('Connection Open: '+ e.url);
        lineCount = 0;
    };

    ws.onclose = function() {
        // TODO eliminar y no intentar reconectar

        console.log('Connection closed.');
    };
    ws.onmessage = function(e) {
        /*
         * Messages format
         * {
         *    command: <["event"|"prediction"|"time"|"result"]>,
         *    event : <EventName>, // Commands: event, prediction, result
         *    prediction: <predictionValue>, // Commands: prediction
         *    before: <before time value in ms>, // Commands: prediction
         *    after: <after time value in ms>, // Commands: prediction
         *    result: <[hit|miss]> // Commands: result
         * }
         */
        var message;
        try {
            message = eval('('+ e.data+')');
        } catch (e) {
            dap_print("Incorrect message format, Use JSON format.",false)
            ws.send("Incorrect message format, Use JSON format.")
            return;
        }

        if (message instanceof Array) {
            message.forEach(function (aMessage){
                dapRegisterMessage(aMessage,ws)
            })
        } else {
            dapRegisterMessage(message,ws)
        }

//        console.log(e)


    }
    if (svg.wss === undefined){
        svg.wss = []
    }
    ws.svg = svg;
    svg.wss.push(ws);


}

var dapRegisterMessage = function (message,ws) {
    dap_print(message)
    switch (message.command) {
        //case DAP_WS_EVENT:
        //    if (message[DAP_WS_EVENT] === undefined){
        //        dap_print("Incorrect format of "+DAP_WS_EVENT+" command. Please check the documentation");
        //        ws.send("Incorrect format of "+DAP_WS_EVENT+" command. Please check the documentation");
        //    } else {
        //        dapAddEventOccurrenceToSvg(ws.svg,message[DAP_WS_EVENT],message[DAP_WS_TIME])
        //    }
        //    break;
        case DAP_WS_PREDICTION:
            if (message[DAP_WS_EVENT] === undefined || message[DAP_WS_PREDICTION] === undefined){
                dap_print("Incorrect format of "+DAP_WS_PREDICTION+" command. Please check the documentation");
                ws.send("Incorrect format of "+DAP_WS_PREDICTION+" command. Please check the documentation");
            } else {
                /*The prediction is in per one, the visualizacion is percent*/
                var prediction = Math.round(message[DAP_WS_PREDICTION] * 10000) / 100
                dapAddPrediction(ws.svg,message[DAP_WS_EVENT],prediction,message[DAP_WS_TIME])
            }
            break;
        case DAP_WS_TIME:
            dap_changeGraphRange(ws.svg,message[DAP_WS_BEFORE],message[DAP_WS_AFTER])
            break;
        case DAP_WS_MODEL:
            dap_changeGraphRange(ws.svg,message[DAP_WS_BEFORE],message[DAP_WS_AFTER])
            break;
        case DAP_WS_RESULT:
            if (message[DAP_WS_EVENT] === undefined || message.result === undefined){
                dap_print("Incorrect format of "+DAP_WS_RESULT+" command. Please check the documentation");
                ws.send("Incorrect format of "+DAP_WS_RESULT+" command. Please check the documentation");
            } else if (!dapAddPredictionResult(ws.svg,message[DAP_WS_EVENT],Date.now(),message.result)){
                dap_print("The prediction result cannot be registered");
                ws.send("The prediction result cannot be registered");
            }

            break;
        case DAP_WS_ALERT:
            if (message[DAP_WS_EVENT] === undefined) {
                dap_print("Incorrect format of "+DAP_WS_ALERT+" command. Please check the documentation");
                ws.send("Incorrect format of "+DAP_WS_ALERT+" command. Please check the documentation");
            } else {
                dapSetAlert(ws.svg,message[DAP_WS_EVENT],message[DAP_WS_ALERT],message[DAP_WS_ALERT_TIMEOUT],message[DAP_WS_TIME])
            }
            break;
        default:
            dap_print("Incorrect message")
            ws.send("Incorrect message. Consult documentation")

    }
}

var dap_changeGraphRange = function (svg,before,after,factor) {
    svg.smoothie.after = after;
    svg.smoothie.before = before;
    dap_changeGraphFactor(svg,factor);

}
var dap_changeGraphFactor = function (svg,factor) {
    if (factor == undefined) {
        factor = 1;
    }
    var smoothie = svg.smoothie;
    var after = smoothie.after* factor;
    var before = smoothie.before * factor;

    var zero = smoothie.zero;
    if (before === undefined && after === undefined){
        return;
    } else if (before === undefined){
        before = smoothie.graphTime * zero;
        after = parseInt(after)
    } else if (after === undefined) {
        after = smoothie.graphTime * (1-zero);
        before = parseInt(before)
    } else {
        after = parseInt(after)
        before = parseInt(before)
    }
    var total = after + before

    zero = (before) / total
    smoothie.graphTime = total
    smoothie.zero = zero;
    smoothie.delay = -after


    var width = $(svg).parent().width();
    smoothie.timePerPixel = smoothie.graphTime / width;
//    width = svg.width();
//    width = svg.parent().outerWidth()
    $(svg).attr('width', width)


    var svgFooter =  $(svg).parent().find('svg.'+DAP_SVG_FOOTER_CLASS);
    drawFooter(svgFooter,width,smoothie.timePerPixel,smoothie.footerVerticalLine,smoothie.zero);
    drawOnSvgBase(svg)



}

var dapSetAlert = function (svg,event,alert,timeout) {
    /*var objectEvent = */dapAddEventToSmoothie(svg,event);
    if (svg.alerts[event] === undefined){
        svg.alerts[event] = {}
    }
    if (alert == DAP_WS_ALERT_ON || alert == DAP_WS_ALERT_OFF){
        if (svg.alerts[event].timeoutFunction !== undefined) {
            clearTimeout(svg.alerts[event].timeoutFunction)
            svg.alerts[event].timeoutFunction = undefined;
        }
        svg.alerts[event].type = alert
//        svg.alerts[event]
        if (timeout !== undefined){
            svg.alerts[event].timeoutFunction = setTimeout(function (svg,event) {
                delete svg.alerts[event];
                dapPaintEventsInADiv($(svg));
                dapPaintFooter()
            }.bind(this,svg,event),timeout)
        }
        dapPaintEventsInADiv($(svg));
        dapPaintFooter()
    }
}

var dapAddPredictionResult = function (svg,event,timestapm,result){
//    dap_print(event+":"+timestapm+":"+result)
    var objectEvent = dapAddEventToSmoothie(svg,event);

    if (svg.smoothie.isStoped){
        return true;
    }
    if (!(result === DAP_WS_RESULT_HIT || result === DAP_WS_RESULT_MISS_FALSE_POSITIVE || DAP_WS_RESULT_MISS_FALSE_NEGATIVE)) {
        return false;
    }
    var predictionResult = {event:objectEvent,time:timestapm,result:result}
    svg.predictionResults.push(predictionResult)
    dapPaintEventsInADiv($(svg));
    dapPaintFooter();
    setTimeout(refreshPredictions.bind(undefined,svg),/*DAP_TIMEOUT + */svg.smoothie.graphTime * svg.smoothie.zero)

    return true;
}

var dapAddPrediction = function (svg, eventName, prediction,moment) {
    /*The step not work corretly in the librery, this code fix it because put 0 if not exist value or put
     * the last value*/
    dapAddEventToSmoothie(svg,eventName)
    dapPaintEventsInADiv($(svg));
    dapPaintFooter();
}
var refreshPredictions = function (svg) {
    var now = Date.now()
    var isDelete = false;
    if (isDelete){
        dapPaintFooter();

    }
}
/**
 * Return a svg of a selected graph
 */
var getActiveGraph = function (){
    var dom = $("button.active."+DAP_SELECT_CHART_BUTTON)
    return dapGetSvg(dom);



}

var isActiveGraph= function (divGraph) {
    return divGraph.find("button.active."+DAP_SELECT_CHART_BUTTON).length != 0
}

var dapGetSvg = function (actualDom){
    return $(dapGetGraphParent(actualDom)).find('svg.'+DAP_SVG_UP)
}

var dapGetGraphParent = function (actualDom) {
    if (!(actualDom instanceof jQuery)){
        actualDom = $(actualDom)
    }
    while (!actualDom.hasClass(DAP_CHART) && actualDom.length != 0){
        actualDom = actualDom.parent();

    }
    return actualDom;

}

var dap_print = function (string,debug){
    if (GLOBAL_DEBUG || !debug){
        console.log(string)
    }
}



function dapIncrementChartsHeight(){
    actualHeight += DAP_HEIGHT_STEP;
    dapResizeFunction()
}
function dapDecrementChartsHeight(){
    if (actualHeight <= DAP_HEIGHT_STEP*2){
        return
    }
    actualHeight -= DAP_HEIGHT_STEP;
    dapResizeFunction()
}

function dapPause(event){}

var dapDebugRoutine = function () {
    if (GLOBAL_DEBUG){
        var url = "/data/predictions.json"
        toggleFooter(true);
        dapAddGraph();
        dapCharts[0].zeroTime = Date.now();
        activeSmoothie = 0;
        $($("svg".DAP_SVG_UP)[1]).parent().find("."+DAP_SELECT_CHART_BUTTON).addClass('active')
        dap_print("Start debug routines");
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = process;
        xhr.open("GET", "/data/predictions.json", true);
        xhr.send(null);
        function process(event) {
            if (event.currentTarget.readyState == 4) {

                var cad = event.currentTarget.responseText
                var myws = {svg:$("svg."+DAP_SVG_UP)[1]}
                myws.eventsInBuffer = []
                var curlyBracketsOpen = 0;
                var leftCurlyBrackets = 0;
                var lastPosition = 0;
                for (var i = 0; i < cad.length;i++){
                    var char = cad.charAt(i);
                    if (char == "{") {
                        curlyBracketsOpen++;
                        leftCurlyBrackets++;
                    } else if (char == "}"){
                        curlyBracketsOpen--;
                    }
                    if (curlyBracketsOpen == 0 && leftCurlyBrackets != 0){

                        var line = cad.slice(lastPosition,i+1).trim();
                        var element = JSON.parse(line)
                        element.timeISO = element.time;
                        element.time = Date.parse(element.time);
                        myws.eventsInBuffer.push(element)
                        lastPosition = i+1;
                        leftCurlyBrackets = 0;
                    }
                }
                myws.eventsInBuffer = dapPreprocessEvents(myws.eventsInBuffer);

                myws.svg.wss = [];
                myws.svg.wss.push(myws);
                myws.svg.startDate = myws.eventsInBuffer[myws.eventsInBuffer.length-1].time;
                myws.svg.endDate = myws.eventsInBuffer[0].time;
                myws.svg.currentDate = myws.svg.endDate;

                dap_changeGraphRange(myws.svg,600000,600000)
                var newDate = parseInt(myws.svg.startDate + (myws.svg.endDate-myws.svg.startDate) * Math.random());
                dapRedrawGraph(myws.svg)
                drawOnSvgBase(myws.svg);
                dapDebugSetTime(myws.svg,newDate)
                changeLoadingScreen(false);
            }
        }
    }
}

var dapDebugSetTime = function (svg,date) {
    var parent = dapGetGraphParent(svg)
    svg.currentDate = date;
    svg.smoothie.zeroTime = svg.currentDate;
    parent.find("."+DAP_SLIDER_TIME).slider('option',{value:date})
    dapDrawEventsInGraph(svg);
}


var dapPreprocessEvents = function (events) {
    var out = []
    for (var i = 0; i < events.length; i++){
        for (var j =0;j < events[i].data.length;j++) {
            if (events[i].data[j].time) {
                out.push(events[i].data[j]);
            }
        }
    }
    out.sort(function (ev1,ev2){
        return ev2.time - ev1.time;
    })
    return out;
}

var dapGetWindowEvents = function (events, window, date){
    var windowEvents = [];

    var windowEnd = date - window;

    /*Segunda condicion negada para los undefined*/
    for (var i = 0 ; i < events.length && events[i].time > windowEnd;i++){
        if (events[i].event instanceof Object){
            var a = 0;
        }
        if (events[i].time != undefined && events[i].time <= date)
            windowEvents.push(events[i])

    }
    return windowEvents;
}

var dapDrawEventsInGraph = function (svg ) {
    var jQSvg = $(svg)
    jQSvg.find("."+DAP_OCCURRENCE_CLASS).remove();
    svg.d3svg= d3.select(jQSvg[0]);
    var circleWidth = 3


    svg.smoothie.eventsHappend = []
    $.each(svg.wss , function () {
        var windowEvents = dapGetWindowEvents(this.eventsInBuffer,svg.smoothie.graphTime,this.svg.currentDate + parseInt(svg.smoothie.graphTime / 2));
        windowEvents.forEach(function (value) {
            switch (value.command) {
                case DAP_WS_EVENT:
                    dapPaintEvent(svg,value);
                    break;
                default:
                    //dap_print(value);


            }
        })
    })
    dapPaintEventsInADiv($(svg));

    //dapPaintEventsList($(svg));


}

var dapPaintEvent = function(svg,event) {
    var smoothieEvent = dapAddEventToSmoothie(svg,event[DAP_WS_EVENT]);
    var occurrenceEvent = {event:smoothieEvent,time: event.time}
    smoothieEvent.occurrences.push(occurrenceEvent)
    svg.smoothie.eventsHappend.push(occurrenceEvent )
    if (smoothieEvent.filter) {
        var stringOccurrenceClass = DAP_EVENT_CLASS_OCCURRENCE_PREFIX + getIndexOfSvg(svg) + "-" + event.event + "-" + event.time
        var eventClass = DAP_EVENT_TYPE_CLASS + getIndexOfSvg(svg) +"-" + event.event;

        var x = dapGetXPixel(svg.smoothie.graphTime,svg.smoothie.zeroTime - event.time - svg.smoothie.delay,$(svg).width());

        var y = smoothieEvent.position* $(svg).height();
        var highlighted = smoothieEvent.isSumaryHover || smoothieEvent.isSumaryClicked
        //var className =
        var circle = svg.d3svg.append('circle')
            .attr('cx',x)
            .attr('cy',y)
            .attr('r',(highlighted)?DAP_EVENT_CIRCLE_RADIUS_HIGHLIGHT:DAP_EVENT_CIRCLE_RADIUS)
            .attr('fill',smoothieEvent.color)
            .attr('class',stringOccurrenceClass + " " +eventClass+ " "+DAP_OCCURRENCE_CLASS);
        circle.on("click",function () {
            this.isClicked = !this.isSumaryClicked;
            dapMarkText(svg, {type:SYSTEM_EVENT_ORIGIN_OCCURRENCE,event:this});
        }.bind(occurrenceEvent,svg));
        circle.on("mouseenter",function () {
            this.isHover = true;
            dapMarkText(svg, {type:SYSTEM_EVENT_ORIGIN_OCCURRENCE,event:this});
        }.bind(occurrenceEvent,svg));
        circle.on("mouseleave",function () {
            this.isHover = false;
            dapMarkText(svg, {type:SYSTEM_EVENT_ORIGIN_OCCURRENCE,event:this});
        }.bind(occurrenceEvent,svg));
        svg.d3svg.append('line')
            .attr('x1', x)
            .attr('x2', x)
            .attr('y1', 0)
            .attr('y2', $(svg).height())
            .attr('stroke-width',(highlighted)?  DAP_SVG_FOOTER_STROKE_VERTICAL_LINE:DAP_SVG_FOOTER_STROKE_VERTICAL_LINE_HIDDEN)
            .attr('stroke', smoothieEvent.color)
            .attr('class',stringOccurrenceClass + " " +eventClass+ " "+DAP_OCCURRENCE_CLASS);
    }
}

var dapGetXPixel= function (graphTime,delayInGraph,width) {
    return (1-(delayInGraph / graphTime)) * width;

}

var dapHighlightSvg = function (jElements, highlight) {
    if (highlight) {
        jElements.filter('circle').attr('r',DAP_EVENT_CIRCLE_RADIUS_HIGHLIGHT);
        jElements.filter('line').attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE);
    } else {
        jElements.filter('circle').attr('r',DAP_EVENT_CIRCLE_RADIUS);
        jElements.filter('line').attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE_HIDDEN);

    }
}

var dapParseDate = function (date) {
    if (parseInt(date) == date) {
        date = new Date(date);
    }

    var cad = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    cad += "T"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    return cad;
}

var dapRepaintSlider = function (event,ui) {
    //this.currentDate = parseInt(this.startDate + (this.endDate-this.startDate)*ui.value)
    this.currentDate = ui.value;
    this.smoothie.zeroTime = ui.value;
    //dap_print(new Date(this.currentDate))
    var parent = dapGetGraphParent(this);
    parent.find("."+DAP_SLIDER_CURRENT_ID).text(dapParseDate(this.currentDate));
    sliderUpdateSvg(this);
}

var dapChangeWindowSlider = function (event,ui){
    var parent = dapGetGraphParent(this);
    parent.find("."+DAP_SLIDER_FACTOR_CURRENT_ID).text(ui.value);
    this.currentFactor = ui.value/100;

    dap_changeGraphFactor(this,this.currentFactor);
    sliderUpdateSvg(this)


}

var sliderUpdateSvg = function (svg) {
    dapDrawEventsInGraph(svg);
}

var dapRedrawGraph = function (svg) {
    var parent = dapGetGraphParent(svg);
    parent.find("."+DAP_SLIDER_START_ID).text(dapParseDate(svg.startDate))
    parent.find("."+DAP_SLIDER_END_ID).text(dapParseDate(svg.endDate))
    parent.find("."+DAP_SLIDER_TIME).slider('option',{min: svg.startDate, max: svg.endDate,step:1000})
}

var dapEventCheckboxClick = function (event) {
    var jElement = dapGetGraphParent(event.target);
    var svg = jElement.find("svg."+DAP_SVG_UP)[0];
    var allEvents = jElement.find("tbody input[value!="+DAP_TEMPLATE+"]");
    switch (event.target.value) {
        case DAP_EVENT_CHECKBOX_ALL:
            var allChecked = $(event.target).is(':checked')
            if (allChecked) {
                $.each(svg.smoothie.events,function () {
                    this.filter = true;
                })
            } else {
                $.each(svg.smoothie.events,function () {
                    this.filter = false;
                })
            }
            break;
        default:
            var elementChecked = $(event.target).is(':checked');
            var event = dapAddEventToSmoothie(svg,event.target.value);
            event.filter = elementChecked;
            break;
    }
    dapDrawEventsInGraph(svg)

}