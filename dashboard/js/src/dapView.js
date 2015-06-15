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
var DAP_SVG_UP_CANVAS = PRE +"-svg-up-canvas"
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

var DAP_Z_INDEX_LVL_1 = 20;

var DAP_EVENT_CLASS_OCCURRENCE_PREFIX = PRE + "-event-class-occurrence-"
var DAP_EVENT_CLASS_PREDICTION = PRE + "-prediction-class"
var DAP_EVENT_CLASS_PREDICTION_RESULT = PRE + "-prediction-class-prefix-result-"
var DAP_EVENT_CLASS_SUMMARY = PRE + "-event-class-summary"
var DAP_EVENT_CLASS_ALERT = PRE + "-event-class-alert"
var DAP_EVENT_TYPE_CLASS = PRE + "-event-type-class-"
/*Other constants*/
var DAP_LINE_BOLD = 4;
var DAP_LINE_NORMAL = 2
var DAP_MAX_LG_COL = 12;
var DAP_CHARTS_DEFAULT_TIME = 10*60*1000;
var DAP_SVG_FOOTER_LINE_FONT_SIZE = 10;
var DAP_SVG_FOOTER_LINE_HEIGHT = 10 + DAP_SVG_FOOTER_LINE_FONT_SIZE;
var DAP_SVG_FOOTER_LINE_SEPARATION = 60000 // in milliseconds
var DAP_SVG_FOOTER_SUB_LINE_HEIGHT = 3
var DAP_SVG_FOOTER_STROKE_VERTICAL_LINE = 1
var DAP_SVG_FOOTER_STROKE_VERTICAL_LINE_BOLD = 3
var DAP_SVG_LINES_COLOR = "#ccc"
var DAP_SVG_FOOTER_FONT_FAMILY = "monospace"
var DAP_SVG_FOOTER_MARKS = 6;
var DAP_HEIGHT_STEP = 10;
var DAP_EVENT_CIRCLE_RADIUS = 2;
var DAP_EVENT_CIRCLE_RADIUS_HOVER = 4;
var DAP_EVENT_LINE_WIDTH = 1;
var DAP_EVENT_LINE_WIDTH_HOVER = 2;
var DAP_ZERO_POS = 0.75
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
    DAP_CHARTS_DEFAULT_TIME = 150*1000;
    DAP_SVG_FOOTER_LINE_SEPARATION = 60000
    var debugWSS = []
    var debugEvents =  []
    var num = 0;
    var DAP_STOP = false
    var dap_pause = false;
}

/*view vars*/
var dapCharts = []
var actualHeight = 200;
var activeSmoothie = undefined;

var dapResizeFunction = function (){
    var cssWidth = (100 / DAP_COLS) - 2;
    var colNum =Math.floor(DAP_MAX_LG_COL / DAP_COLS);
    $('#'+DAP_CHARTS).find('.'+DAP_CHART).css('width',cssWidth+"%")
    resizingCanvasChart();
    resizingCanvasChart();
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
    smoothie.timelines = {}
    smoothie.graphTime = DAP_CHARTS_DEFAULT_TIME;
    smoothie.zero = DAP_ZERO_POS

    smoothie.verticalLineTime =DAP_SVG_FOOTER_LINE_SEPARATION;
    smoothie.footerVerticalLine = DAP_SVG_FOOTER_LINE_SEPARATION;
    smoothie.eventsHappend = [];
    smoothie.events = {}
    smoothie.actualColor = 0;
    var canvas = $(section.find('canvas')[0])
    canvas[0].smoothie = smoothie;
    canvas[0].smoothie.paintName = true;
    canvas[0].predictionResults = []
    canvas[0].alerts = {}

    dapCharts.push(smoothie)
    dapResizeFunction()
}

var dapDeleteGraph = function (element) {
    var div = getCharDiv(element);
    var canvas = getCanvas(element)[0];
    if (canvas.wss != undefined) {
        $.each(canvas.wss,function (){
            this.close();
        })
    }
    div.remove();

}

var dapActiveNames = function (event) {
    var canvas = getCanvas(event.target)
    canvas[0].smoothie.paintName = !(canvas[0].smoothie.paintName);
}


var dapAddEventToSmoothie = function (canvas,eventName){
    var smoothie = canvas.smoothie
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
        smoothie.addTimeSeries(smoothie.events[eventName].timeSeries,{
            strokeStyle: web_colors[color],
            lineWidth: DAP_LINE_NORMAL,
            "shape-rendering": "crispEdges",
            fillStyle: chroma(web_colors[color]).darken().alpha(0).css()

        })
        smoothie.events[eventName].timeSeries.lineOptions = smoothie.seriesSet[smoothie.seriesSet.length-1].options;
    }
    return smoothie.events[eventName];

}
var dapAddEventOccurrenceToCanvas = function (canvas,eventId,moment){
    var time;
    if (moment == undefined){
        time = Date.now();
    } else {
        time = moment;
    }
    var jQCanvas = $(canvas)
    var event = dapAddEventToSmoothie(canvas,eventId)
    var occurrenceEvent = {event:event,time: time}
    event.occurrences.push(occurrenceEvent)
    canvas.smoothie.eventsHappend.push(occurrenceEvent )

    paintEvents(jQCanvas)
}


var resizingCanvasChart = function (charts){
    var canvas;
    if (canvas === undefined){
        canvas = $('#'+DAP_CHARTS).find('canvas');
    } else {
        canvas = charts.find('canvas')
    }
    canvas.attr('height',actualHeight)
    $(function (){
        var width = canvas.parent().width();
        if (width != 0 ){
            canvas.attr('width', width)
            $.each(canvas,function(){
                if (this.smoothie !== undefined) {
                    var timePerPixel = this.smoothie.graphTime / width;
                    if (this.smoothie.zero === undefined) {
                        this.smoothie.zero = DAP_ZERO_POS
                    }
                    //this.smoothie.options.millisPerPixel = timePerPixel;
                    drawOnCanvasEvents($(this))
                    var svg =  $(this).parent().find('svg.'+DAP_SVG_FOOTER_CLASS);

                    drawFooter(svg,width,timePerPixel,this.smoothie.footerVerticalLine,this.smoothie.zero);
                    drawOnCanvasBase(this)
                }
                var divChart = getCharDiv(canvas);
                divChart.find("."+DAP_EVENTS_COUNT_PARENT).css('height',canvas.parent().height())
            })
        }
    })
}

var getIndexOfCanvas = function (canvas) {
    return $('canvas').index(canvas)
}

var drawOnCanvasEvents = function (jQCanvas) {
    var canvas = jQCanvas[0];
    var canvasIndex = getIndexOfCanvas(canvas);
    //setTimeout(drawOnCanvasEvents.bind(this,jQCanvas),parseInt(canvas.smoothie.options.millisPerPixel)/4)
    if (dap_pause ){
        return;
    }

    var jQSvg = jQCanvas.parent().find("."+DAP_SVG_UP_CANVAS)
    jQSvg.find("."+DAP_SVG_EVENTS_IN_UP_CANVAS).remove();
    var d3Svg = d3.select(jQSvg[0]);
    var thisDate = Date.now()
    var cy = jQSvg.height()-2
    var eventsToDelete = []
    var predictinoResultToDelete = [];
    var count = 1;
    jQSvg.find("."+DAP_TOOLTIP_EVENTS_OCCURRED).remove();
    $.each(canvas.predictionResults, function (key) {
        /*Eliminar cuando se sale*/
        if (canvas.smoothie.isStoped){
            if (this.lastPosition === undefined){
                return;
            }
        } else {
            this.lastPosition = thisDate - this.time;
        }
        if (this.lastPosition > canvas.smoothie.graphTime *  canvas.smoothie.zero){
            predictinoResultToDelete.push(key)
        } else { // XXX aqui hay un posible error canvas.smoothie.options.millisPerPixel
            var content = $('<div/>', {
                class: DAP_TOOLTIP_EVENTS_OCCURRED_INTERNAL
            })
            if (this.result === DAP_WS_RESULT_MISS_FALSE_POSITIVE) {
                content.append($('<div/>').addClass(DAP_WS_RESULT_MISS_FALSE_POSITIVE_CLASS))
            } else if (this.result === DAP_WS_RESULT_MISS_FALSE_NEGATIVE) {
                content.append($('<div/>').addClass(DAP_WS_RESULT_MISS_FALSE_NEGATIVE_CLASS))
            }
            else if (this.result === DAP_WS_RESULT_HIT){
                content.append($('<div/>').addClass(DAP_WS_RESULT_HIT_CLASS))
            }
            content.css('background', chroma(this.event.color).darken().alpha(0.2).css())
            if (this.isHover || this.isClicked || this.event.isSumaryClicked || this.event.isSumaryHover) {
                content.css('border', '2px solid ' + this.event.color)
            } else {
                content.css('border', '1px solid ' + this.event.color)
            }
            var cx = jQSvg.width() * canvas.smoothie.zero;
            var pixelDifference = parseInt(this.lastPosition / canvas.smoothie.options.millisPerPixel)
            cx -= pixelDifference;
            var tooltip = createTooltip(d3Svg, content, DAP_TOOLTIP_EVENTS_OCCURRED, MY_ALIGNMENT_TOP, cx, 0)
        }

    })
    $.each(canvas.smoothie.eventsHappend,function (key) {
        if (canvas.smoothie.isStoped){
            if (this.lastPosition === undefined){
                return;
            }
        } else {
            this.lastPosition = thisDate - this.time;
        }
        if (this.lastPosition > canvas.smoothie.graphTime *  canvas.smoothie.zero){
            eventsToDelete.push(key)
        }else {
            var cx = jQSvg.width()*canvas.smoothie.zero;
            var pixelDifference = parseInt(this.lastPosition / canvas.smoothie.options.millisPerPixel)
            var lineWidth;
            var radius;
            var fontWeight;
            cx -= pixelDifference;
            if (this.isHover || this.isClicked || this.event.isSumaryClicked || this.event.isSumaryHover){
                lineWidth = DAP_EVENT_LINE_WIDTH_HOVER
                radius = DAP_EVENT_CIRCLE_RADIUS_HOVER
                fontWeight = 'bold'
                var content = $('<div/>', {
                    class: DAP_TOOLTIP_EVENTS_OCCURRED_INTERNAL
                }).append('<div style="white-space: nowrap">Event ID: '+this.event.id+'</div><div style="white-space: nowrap">Time: '+printDate(this.time)+'</div>');
                content.css('border-color',this.event.color)
                content.css('color',this.event.color)
                content.css('background',chroma(this.event.color).darken().alpha(0.2).css())
                var tooltip = createTooltip(d3Svg,content ,DAP_TOOLTIP_EVENTS_OCCURRED,MY_ALIGNMENT_TOP_LEFT,cx,0)

                // TODO el problma es en el repintado, si esta parado se quita
                tooltip.style('z-index',DAP_Z_INDEX_LVL_1);


            } else {
                lineWidth = DAP_EVENT_LINE_WIDTH
                radius = DAP_EVENT_CIRCLE_RADIUS
                fontWeight = 'normal'

            }
            d3Svg.append('line')
                .attr('x1',cx)
                .attr('x2',cx)
                .attr('y1',0)
                .attr('y2',cy)
                .attr('stroke-width', lineWidth)
                .attr('stroke', this.event.color)
                .attr('shape-rendering',"crispEdges")
//                .attr("class", DAP_SVG_EVENTS_IN_UP_CANVAS + " " + DAP_EVENT_CLASS_OCCURRENCE_PREFIX+this.event.id+"-"+this.time)
//                .attr("class", DAP_SVG_EVENTS_IN_UP_CANVAS + " " + DAP_EVENT_TYPE_CLASS+"-"+canvasIndex+"-"+this.event.id+"-"+this.time)
                .attr("class", DAP_SVG_EVENTS_IN_UP_CANVAS)

            var circle = d3Svg.append('circle')
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', radius)
                .attr("class", DAP_SVG_EVENTS_IN_UP_CANVAS)
                .style("fill", this.event.color)
            circle.append('title')
                .text(this.event.id)
                .style("fill", this.event.color);

            if (canvas.smoothie.paintName) {
                var text = d3Svg.append('text')
                    .attr("class", DAP_SVG_EVENTS_IN_UP_CANVAS)
                    .attr('fill', this.event.color)
                    .attr('font-family', DAP_SVG_FOOTER_FONT_FAMILY)
                    .attr('font-size', (DAP_SVG_FOOTER_LINE_FONT_SIZE+5) + "px")
                    .attr('text-anchor', "end")
                    .attr('font-weight',fontWeight)
//            .attr('transform',"rotate(270 "+cx+","+cy+")")
                    .attr('transform', "rotate(270)")
                    .text(this.event.id)
                text
                    .attr('x', -cy + $(text[0]).width() + 1)
                    .attr('y', cx)
            }
        }
    })

    if (eventsToDelete.length > 0 || predictinoResultToDelete.length > 0){
        for (var i = eventsToDelete.length-1;i >=0;i-- ) {
            canvas.smoothie.eventsHappend.splice(eventsToDelete[i],1);
        }
        for (var i = predictinoResultToDelete.length-1;i >=0;i-- ) {
            canvas.predictionResults.splice(predictinoResultToDelete[i],1);
        }
        paintEvents(jQCanvas)
        dapPaintFooter();

    }


}

var dapPaintFooter = function (){
    var jQCanvas = getActiveGraph();
    var canvas = jQCanvas[0]

    if (canvas.smoothie.isStoped){
        return;
    }
    paintFooterPredictions(jQCanvas)
    paintFooterEvents(jQCanvas)
    paintFooterPredictionResult(jQCanvas)
    paintFooterAlerts(jQCanvas);


}

var paintFooterAlerts = function (jQCanvas){
    var canvas = jQCanvas[0]
    var canvasIndex = getIndexOfCanvas(canvas)
    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+DAP_TABLE_EVENTS_ALERTS).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    tbody.empty()
    tbody.append(genericLine)
    $.each(canvas.alerts,function (key) {
        var event = dapAddEventToSmoothie(canvas,key);
        var className = DAP_EVENT_TYPE_CLASS+canvasIndex+"-"+key
        var newLine = genericLine.clone().removeClass(DASHBOARD_TEMPLATES).addClass(className).addClass(DAP_EVENT_CLASS_ALERT)
        newLine.css('color',event.color)
        newLine.find("."+DAP_CELL_1).text(key);
        newLine.find("."+DAP_CELL_2).text(this.type);
        newLine.mouseenter(function (canvas){
            this.isAlertHover = true;
            dapMarkText(canvas,{type:SYSTEM_EVENT_ORIGIN_ALERT,event:this});
        }.bind(event,canvas))
        newLine.mouseleave(function (canvas){
            this.isAlertHover = false;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_ALERT,event:this});
        }.bind(event,canvas))
        newLine.click(function (canvas) {
            this.isAlertClicked = !this.isAlertClicked;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_ALERT,event:this});
        }.bind(event,canvas))
        tbody.append(newLine)


    })

}
var paintFooterPredictions = function (jQCanvas) {
    var canvas = jQCanvas[0]
    var canvasIndex = getIndexOfCanvas(canvas)
    if (canvas.smoothie.isStoped){
        return;
    }
    // TODO

    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+DAP_TABLE_EVENTS_PREDICTION ).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    tbody.empty()
    tbody.append(genericLine)
    $.each(canvas.smoothie.events,function (key) {
        if (this.timeSeries.data.length == 0) {
            return;
        }
        var line = genericLine.clone().removeAttr('class')

        var className = DAP_EVENT_TYPE_CLASS+canvasIndex+"-"+this.id
        var spanEvent =$('<span>'+this.id+'</span>').css('color',this.color)
        var spanPrediction =$('<span>'+this.timeSeries.data[this.timeSeries.data.length-1][1]+'</span>').css('color',this.color)
        line.find('.'+DAP_CELL_1).removeAttr('class').addClass(className).addClass(DAP_EVENT_CLASS_PREDICTION).append(spanEvent);
        line.find('.'+DAP_CELL_2).removeAttr('class').addClass(className).addClass(DAP_EVENT_CLASS_PREDICTION).append(spanPrediction);
        tbody.append(line)

        line.mouseenter (function (canvas){
            this.isPredicitionHover = true;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_PREDICTION,event:this});

        }.bind(this,canvas))

        line.mouseleave (function (canvas){
            this.isPredicitionHover = false;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_PREDICTION,event:this})
        }.bind(this,canvas))
        line.click(function(canvas) {
            this.isPredictionClicked = !this.isPredictionClicked;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_PREDICTION,event:this})
        }.bind(this,canvas))

    })
}

var paintEvents = function (jQCanvas){
    /*Removing tooltip para evitar que se queden si se mueve el raton*/
    $(jQCanvas[0].smoothie.eventsHappend).map (function (){
        this.isHover = false;
        return this;
    })
    /*Paint in the left*/
    if (!jQCanvas[0].smoothie.isStoped){
        paintEventsInADiv(jQCanvas);
        if (isActiveGraph(getCharDiv(jQCanvas))) {
            paintFooterEvents(jQCanvas)
        }
    }
}


var paintEventsInADiv = function (jQCanvas) {
    var container = getCharDiv(jQCanvas).find('.'+DAP_EVENTS_COUNT).find('tbody');
    var genericLine = container.find("."+DASHBOARD_TEMPLATES).clone()
    container.empty();
    container.append(genericLine)
    var canvas = jQCanvas[0];
    var smoothie = canvas.smoothie;
    var events = {}
    $.each(smoothie.events,function (){
        /*Cuidado con los timeSeries con un valor que no esta en la ventana*/
        if (this.timeSeries.data.length !== 0) {
            events[this.id] = {}
            events[this.id].count = 0;
            events[this.id].event = this;
        }
    })
    $.each(canvas.alerts, function (key) {
        events[key] = {}
        events[key].count = 0;
        events[key].event = smoothie.events[key];

    })
    $.each(canvas.predictionResults,function (){
        events[this.event.id] = {}
        events[this.event.id].count = 0;
        events[this.event.id].event = this.event;
    })
    $.each(smoothie.eventsHappend,function () {
        if (events[this.event.id] === undefined){
            events[this.event.id] = {};
            events[this.event.id].count = 1;
            events[this.event.id].event = this.event;
        }else {
            events[this.event.id].count++;
        }
    })


    var shortedKeys = $.map(events,function (value) {return [value.event.id]})
    shortedKeys.sort(function (a,b){
        return a.localeCompare(b);
    })
    var normalLines = []
    var alertedLines = [];
    $.each(shortedKeys, function () {
        var newLine = genericLine.clone().removeClass(DASHBOARD_TEMPLATES).addClass(DAP_EVENT_TYPE_CLASS+getIndexOfCanvas(canvas)+"-"+this).addClass(DAP_EVENT_CLASS_SUMMARY);
        var event = dapAddEventToSmoothie(canvas,this);
        newLine.find("."+DAP_CELL_1).text(this)
        newLine.find("."+DAP_CELL_2).text(events[this].count)
        if (canvas.alerts[this] !== undefined){
            if (canvas.alerts[this].type === DAP_WS_ALERT_ON){
                newLine.find("."+DAP_CELL_3).append($('<div class="dap-alert-box"/>').css('color',event.color).css('background',event.color))
                alertedLines.push(newLine)
            } else {
                normalLines.push(newLine)
            }
        } else {
            normalLines.push(newLine)
        }
//        var div = $('<div/>',{
//            title: this,
//            text: this + " (#"+events[this].count+")"+alerted
//        })
//        div.addClass(DAP_EVENT_TYPE_CLASS+getIndexOfCanvas(canvas)+"-"+this).addClass(DAP_EVENT_CLASS_SUMMARY)
        newLine.mouseenter(function (canvas){
            this.isSumaryHover = true;
            dapMarkText(canvas,{type:SYSTEM_EVENT_ORIGIN_SUMMARY,event:this});
        }.bind(event,canvas))
        newLine.mouseleave(function (canvas){
            this.isSumaryHover = false;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_SUMMARY,event:this});
        }.bind(event,canvas))
        newLine.click(function (canvas) {
            this.isSumaryClicked = !this.isSumaryClicked;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_SUMMARY,event:this});
        }.bind(event,canvas))
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

var paintFooterPredictionResult = function (jQCanvas){
    var canvas = jQCanvas[0]
    if (canvas.smoothie.isStoped){
        return true;
    }
    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+DAP_TABLE_EVENTS_PREDICTION_RESULT).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    var canvasIndex = getIndexOfCanvas(canvas);
    tbody.empty().append(genericLine)
    $.each(canvas.predictionResults, function () {
        var event = this.event;
        var className = DAP_EVENT_TYPE_CLASS+canvasIndex+"-"+event.id
        var newLine = genericLine.clone().removeClass(DASHBOARD_TEMPLATES);
        newLine.addClass(className).addClass(DAP_EVENT_CLASS_PREDICTION_RESULT+canvasIndex+"-"+event.id+"-"+this.time)
        newLine.find("."+DAP_CELL_1).text(this.event.id).css('color',event.color)
        newLine.find("."+DAP_CELL_2).text(printDate(this.time)).css('color',event.color)
        var img;
        if (this.result === DAP_WS_RESULT_MISS_FALSE_POSITIVE){
            img = $('<div/>').addClass(DAP_WS_RESULT_MISS_FALSE_POSITIVE_CLASS)//.addClass(DAP_EVENT_TYPE_CLASS+this.event)
        } else if (this.result === DAP_WS_RESULT_MISS_FALSE_NEGATIVE){
            img = $('<div/>').addClass(DAP_WS_RESULT_MISS_FALSE_NEGATIVE_CLASS)
        } else {
            img = $('<div/>').addClass(DAP_WS_RESULT_HIT_CLASS)
        }
        newLine.find("."+DAP_CELL_3).append(img)
        newLine.mouseenter (function (canvas){
            this.isHover = true;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT,event:this});


        }.bind(this,canvas))

        newLine.mouseleave (function (canvas){
            this.isHover = false;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT,event:this})
        }.bind(this,canvas))
        newLine.click(function(canvas) {
            this.isClicked = !this.isClicked;
            dapMarkText(canvas, {type:SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT,event:this})
        }.bind(this,canvas))
        tbody.append(newLine);

    })
}

var cleanPredictionResults = function () {
    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+DAP_TABLE_EVENTS_PREDICTION_RESULT).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    tbody.empty().append(genericLine)
    var activeCanvas = getActiveGraph();
    activeCanvas[0].predictionResults = [];

}


var dapMarkText = function (canvas, systemEvent,eventOccurrence) {
    var systemEventOrigin = systemEvent.type;
    var eventOccurrence;
    var eventPredictionResult;
    var event;
    var eventClass;
    var canvasIndex = getIndexOfCanvas(canvas);
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
    eventClass = DAP_EVENT_TYPE_CLASS + canvasIndex +"-" + event.id;
    var elements = $("."+eventClass)
    if (event.isSumaryHover || event.isSumaryClicked) {
        elements.css('font-weight', 'bold');
        event.timeSeries.lineOptions.lineWidth = DAP_LINE_BOLD;
    } else {
        elements.css('font-weight', 'normal');
        event.timeSeries.lineOptions.lineWidth = DAP_LINE_NORMAL
    }

    switch (systemEventOrigin) {
        case SYSTEM_EVENT_ORIGIN_OCCURRENCE:
            if (eventOccurrence.isHover || eventOccurrence.isClicked) {
                var stringOccurrenceClass = DAP_EVENT_CLASS_OCCURRENCE_PREFIX + canvasIndex + "-" + eventOccurrence.event.id + "-" + eventOccurrence.time
                $("." + stringOccurrenceClass).css('font-weight', 'bold')
                $("."+eventClass+"."+DAP_EVENT_CLASS_SUMMARY).css('font-weight', 'bold')
            }

            break;
        case SYSTEM_EVENT_ORIGIN_PREDICTION_RESULT:
            if (eventPredictionResult.isHover || eventPredictionResult.isClicked) {
                var stringPredictionResultClass = DAP_EVENT_CLASS_PREDICTION_RESULT+canvasIndex+"-"+event.id+"-"+eventPredictionResult.time
                $("." + stringOccurrenceClass).css('font-weight', 'bold')
                $("."+eventClass+"."+DAP_EVENT_CLASS_SUMMARY).css('font-weight', 'bold')
                $("."+eventClass+"."+stringPredictionResultClass).css('font-weight', 'bold')
            }
            break;
        case SYSTEM_EVENT_ORIGIN_PREDICTION:
            if (event.isPredicitionHover|| event.isPredictionClicked) {
                $("."+eventClass+"."+DAP_EVENT_CLASS_SUMMARY).css('font-weight', 'bold')
                $("."+eventClass+"."+DAP_EVENT_CLASS_PREDICTION).css('font-weight', 'bold')
                event.timeSeries.lineOptions.lineWidth = DAP_LINE_BOLD;
            }
            break;
        case SYSTEM_EVENT_ORIGIN_ALERT:
            if (event.isAlertClicked || event.isAlertHover){
                $("."+eventClass+"."+DAP_EVENT_CLASS_SUMMARY).css('font-weight', 'bold')
                $("."+eventClass+"."+DAP_EVENT_CLASS_ALERT).css('font-weight', 'bold')

            }
            break;
    }
    return;

}



var paintFooterEvents = function (jQCanvas){
    var tbody = $("#" + FOOTER_CONTENT_ID).find("." + DAP_TABLE_EVENTS_OCCURRENCE).find('tbody');
    var canvas = jQCanvas[0];
    var canvasIndex = getIndexOfCanvas(canvas)
    var genericLine = tbody.find("tr." + DASHBOARD_TEMPLATES)
    tbody.empty()
    tbody.append(genericLine)
    for (var i = jQCanvas[0].smoothie.eventsHappend.length - 1; i >= 0; i--) {
        var eventOccurrence = jQCanvas[0].smoothie.eventsHappend[i];
        var line = genericLine.clone().removeAttr('class')
        var className1 = DAP_EVENT_CLASS_OCCURRENCE_PREFIX + canvasIndex + "-" + eventOccurrence.event.id + "-" + eventOccurrence.time
        var className2 = DAP_EVENT_TYPE_CLASS +canvasIndex+"-"+ eventOccurrence.event.id;
        var spanEvent = $('<span>' + eventOccurrence.event.id + '</span>').css('color', eventOccurrence.event.color)
        var spanTime = $('<span>' + printDate(eventOccurrence.time) + '</span>').css('color', eventOccurrence.event.color)
        line.find('.' + DAP_CELL_1).removeAttr('class').addClass(className1).addClass(className2).append(spanEvent);
        line.find('.' + DAP_CELL_2).removeAttr('class').addClass(className1).addClass(className2).append(spanTime);
        tbody.append(line);
        line.mouseenter(function (canvas) {
            this.isHover = true;
            dapMarkText(canvas, {type: SYSTEM_EVENT_ORIGIN_OCCURRENCE,event:this})
        }.bind(eventOccurrence,canvas))

        line.mouseleave(function (canvas) {
            this.isHover = false;
            dapMarkText(canvas,  {type: SYSTEM_EVENT_ORIGIN_OCCURRENCE,event:this})
        }.bind(eventOccurrence,canvas))

        line.click(function (canvas) {
            this.isClicked = !this.isClicked;
            dapMarkText(canvas,  {type: SYSTEM_EVENT_ORIGIN_OCCURRENCE,event:this})
        }.bind(eventOccurrence,canvas))
    }
}

var drawOnCanvasBase = function (canvas){
    var jQCanvas = $(canvas)
    jQCanvas.parent().find('svg.'+DAP_SVG_UP_CANVAS).remove();
    /*No funciona correctamente si se pone directamente ¿Porque?*/
    var width = parseInt(jQCanvas.width());
    var height = parseInt(jQCanvas.height());
    var d3Canvas = d3.selectAll(jQCanvas.parent());
    var svg;
    if (canvas.smoothie.zero !== undefined) {
        svg = d3Canvas.append('svg')
            .attr('class', DAP_SVG_UP_CANVAS)
            .style('width', width + "px")
            .style('height', (height + 2) + "px")
            .style('left', jQCanvas.position().left)
            .style('top', jQCanvas.position().top);
        svg.append('line')
            .attr('x1', jQCanvas.width() * canvas.smoothie.zero)
            .attr('x2', jQCanvas.width() * canvas.smoothie.zero)
            .attr('y1', 0)
            .attr('y2', jQCanvas.height())
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE_BOLD)
            .attr('stroke', '#ff5555')
            .attr('shape-rendering', "crispEdges")
    }
    /*Draw vertical lines left*/
    var lines = 9;
    var separation = jQCanvas.width() * 1/(lines+1)
    var zeroPos = jQCanvas.width() * canvas.smoothie.zero;
    var position = zeroPos;
    while ((position -= separation) > 0) {
        //var hPosition = jQCanvas.width() * (i+1)/(lines+1)
        svg.append('line')
            .attr('x1', position )
            .attr('x2', position )
            .attr('y1', 0)
            .attr('y2', jQCanvas.height())
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', DAP_SVG_LINES_COLOR)
            .attr('shape-rendering', "crispEdges")
    }

    /*Draw vertical right lines*/
    position = zeroPos;
    while ((position += separation) < jQCanvas.width()) {
        //var hPosition = jQCanvas.width() * (i+1)/(lines+1)
        svg.append('line')
            .attr('x1', position )
            .attr('x2', position )
            .attr('y1', 0)
            .attr('y2', jQCanvas.height())
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', DAP_SVG_LINES_COLOR)
            .attr('shape-rendering', "crispEdges")
    }

    /*Draw horizonal*/
    lines = 4;
    separation = jQCanvas.height() / (lines + 1);
    position = jQCanvas.height();
    while ((position -= separation) > 0) {
        svg.append('line')
            .attr('x1', 0 )
            .attr('x2', jQCanvas.width() )
            .attr('y1', position)
            .attr('y2', position)
            .attr('stroke-width', DAP_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', DAP_SVG_LINES_COLOR)
            .attr('shape-rendering', "crispEdges")
    }


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
    $("."+DAP_SELECT_CHART_BUTTON).removeClass('active')//.removeClass('btn-primary').addClass('btn-default')
//    $(event.target).removeClass('btn-default').addClass('btn-primary').addClass('active')
//    $(event.target).removeClass('btn-default').addClass('btn-primary')
    $(event.target).addClass('active')
    $("#"+DAP_FOOTER_CHART_EVENTS).empty()
    var activeCanvas = getActiveGraph();
    paintEvents(activeCanvas)
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

//    $("#"+ORV_COLUMNS_CLICKS).find('.active').removeClass('btn-default').addClass('btn-primary');
}



var dapLoadSource = function (event) {
    if (event.keyCode == 13){
        console.log("Changing the source");
//        onlineResourceView_postLoad_click();
        dapLoadSource_click();


    }
//    console.log("keyCode="+event.keyCode+", indentifier"+ event.keyIdentifier);
}

var dapLoadSource_click = function (){
//    onlineResourceView_postLoad($("#odv-input-url").val());
    _dapLoadSource($("#"+DAP_INPUT_URL).val());
}

var _dapLoadSource = function (url) {
    var canvas =  getActiveGraph()[0];
    if (canvas === undefined){
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
    if (canvas.wss === undefined){
        canvas.wss = []
    }
    ws.canvas = canvas;
    canvas.wss.push(ws);


}

var dapRegisterMessage = function (message,ws) {
    dap_print(message)
    switch (message.command) {
        case DAP_WS_EVENT:
            if (message[DAP_WS_EVENT] === undefined){
                dap_print("Incorrect format of "+DAP_WS_EVENT+" command. Please check the documentation");
                ws.send("Incorrect format of "+DAP_WS_EVENT+" command. Please check the documentation");
            } else {
                dapAddEventOccurrenceToCanvas(ws.canvas,message[DAP_WS_EVENT],message[DAP_WS_TIME])
            }
            break;
        case DAP_WS_PREDICTION:
            if (message[DAP_WS_EVENT] === undefined || message[DAP_WS_PREDICTION] === undefined){
                dap_print("Incorrect format of "+DAP_WS_PREDICTION+" command. Please check the documentation");
                ws.send("Incorrect format of "+DAP_WS_PREDICTION+" command. Please check the documentation");
            } else {
                /*The prediction is in per one, the visualizacion is percent*/
                var prediction = Math.round(message[DAP_WS_PREDICTION] * 10000) / 100
                dapAddPrediction(ws.canvas,message[DAP_WS_EVENT],prediction,message[DAP_WS_TIME])
            }
            break;
        case DAP_WS_TIME:
            dap_changeGraphRange(ws.canvas,message[DAP_WS_BEFORE],message[DAP_WS_AFTER])
            break;
        case DAP_WS_MODEL:
            dap_changeGraphRange(ws.canvas,message[DAP_WS_BEFORE],message[DAP_WS_AFTER])
            break;
        case DAP_WS_RESULT:
            if (message[DAP_WS_EVENT] === undefined || message.result === undefined){
                dap_print("Incorrect format of "+DAP_WS_RESULT+" command. Please check the documentation");
                ws.send("Incorrect format of "+DAP_WS_RESULT+" command. Please check the documentation");
            } else if (!dapAddPredictionResult(ws.canvas,message[DAP_WS_EVENT],Date.now(),message.result)){
                dap_print("The prediction result cannot be registered");
                ws.send("The prediction result cannot be registered");
            }

            break;
        case DAP_WS_ALERT:
            if (message[DAP_WS_EVENT] === undefined) {
                dap_print("Incorrect format of "+DAP_WS_ALERT+" command. Please check the documentation");
                ws.send("Incorrect format of "+DAP_WS_ALERT+" command. Please check the documentation");
            } else {
                dapSetAlert(ws.canvas,message[DAP_WS_EVENT],message[DAP_WS_ALERT],message[DAP_WS_ALERT_TIMEOUT],message[DAP_WS_TIME])
            }
            break;
        default:
            dap_print("Incorrect message")
            ws.send("Incorrect message. Consult documentation")

    }
}

var dap_changeGraphRange = function (canvas,before,after){
    var smoothie = canvas.smoothie;
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


    var width = $(canvas).parent().width();
//    width = canvas.width();
//    width = canvas.parent().outerWidth()
    $(canvas).attr('width', width)

    var timePerPixel = smoothie.graphTime / width;

    var svg =  $(canvas).parent().find('svg.'+DAP_SVG_FOOTER_CLASS);
    drawFooter(svg,width,timePerPixel,smoothie.footerVerticalLine,smoothie.zero);
    drawOnCanvasBase(canvas)



}

var dapSetAlert = function (canvas,event,alert,timeout) {
    /*var objectEvent = */dapAddEventToSmoothie(canvas,event);
    if (canvas.alerts[event] === undefined){
        canvas.alerts[event] = {}
    }
    if (alert == DAP_WS_ALERT_ON || alert == DAP_WS_ALERT_OFF){
        if (canvas.alerts[event].timeoutFunction !== undefined) {
            clearTimeout(canvas.alerts[event].timeoutFunction)
            canvas.alerts[event].timeoutFunction = undefined;
        }
        canvas.alerts[event].type = alert
//        canvas.alerts[event]
        if (timeout !== undefined){
            canvas.alerts[event].timeoutFunction = setTimeout(function (canvas,event) {
                delete canvas.alerts[event];
                paintEventsInADiv($(canvas));
                dapPaintFooter()
            }.bind(this,canvas,event),timeout)
        }
        paintEventsInADiv($(canvas));
        dapPaintFooter()
    }
}

var dapAddPredictionResult = function (canvas,event,timestapm,result){
//    dap_print(event+":"+timestapm+":"+result)
    var objectEvent = dapAddEventToSmoothie(canvas,event);

    var jQCanvas = $(canvas)
    if (canvas.smoothie.isStoped){
        return true;
    }
    if (!(result === DAP_WS_RESULT_HIT || result === DAP_WS_RESULT_MISS_FALSE_POSITIVE || DAP_WS_RESULT_MISS_FALSE_NEGATIVE)) {
        return false;
    }
    var predictionResult = {event:objectEvent,time:timestapm,result:result}
    canvas.predictionResults.push(predictionResult)
    paintEventsInADiv($(canvas));
    dapPaintFooter();
    setTimeout(refreshPredictions.bind(undefined,canvas),/*DAP_TIMEOUT + */canvas.smoothie.graphTime * canvas.smoothie.zero)

    return true;
}

var dapAddPrediction = function (canvas, eventName, prediction,moment) {
    /*The step not work corretly in the librery, this code fix it because put 0 if not exist value or put
     * the last value*/
    var event = dapAddEventToSmoothie(canvas,eventName)
    var time
    if (moment == undefined){
        time = Date.now();
    } else {
        time = moment;
        
    }
    
     if (event.timeSeries.data.length == 0) {
        event.timeSeries.append(time-1,0);

     } else if (event.timeSeries.data[event.timeSeries.data.length-1][0] < (time-canvas.smoothie.graphTime)) {
         event.timeSeries.append(event.timeSeries.data[event.timeSeries.data.length-1][0]+1,-1);
         event.timeSeries.append(time-1,0);
     } else {
        event.timeSeries.append(time-1,event.timeSeries.data[event.timeSeries.data.length-1][1]);
    }
    event.timeSeries.append(time,prediction);
    paintEventsInADiv($(canvas));
    dapPaintFooter();
    setTimeout(refreshPredictions.bind(undefined,canvas),/*DAP_TIMEOUT + */canvas.smoothie.graphTime * canvas.smoothie.zero)
}
var refreshPredictions = function (canvas) {
    var now = Date.now()
    var isDelete = false;
    $.each(canvas.smoothie.seriesSet,function () {
        if (this.timeSeries.data.length > 0){
            if (this.timeSeries.data[this.timeSeries.data.length-1][0] < (now - canvas.smoothie.graphTime * canvas.smoothie.zero)){
                isDelete = true
                while(this.timeSeries.data.length > 0) {
                    this.timeSeries.data.pop();
                }
                paintEventsInADiv($(canvas))
            }
        }

    })
    if (isDelete){
        dapPaintFooter();

    }
}
/**
 * Return a canvas of a selected graph
 */
var getActiveGraph = function (){
    var dom = $("button.active."+DAP_SELECT_CHART_BUTTON)
    return getCanvas(dom);



}

var isActiveGraph= function (divGraph) {
    return divGraph.find("button.active."+DAP_SELECT_CHART_BUTTON).length != 0
}

var getCanvas = function (actualDom){
    return $(getCharDiv(actualDom)).find('canvas')
}

var getCharDiv = function (actualDom) {
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

function dapPause(event){
    var canvas = getCanvas(event.target);
    if (canvas[0].smoothie.isStoped){
        canvas[0].smoothie.start();
        paintEvents(getActiveGraph());
        dapPaintFooter();
    } else {
        canvas[0].smoothie.stop();
    }
    $(event.target).toggleClass("active",canvas[0].smoothie.isStoped)
}


var dapDebugRoutine = function () {
    if (GLOBAL_DEBUG){
        var url = "/data/predictions.json"
        toggleFooter(true);
        dapAddGraph();
        dapCharts[0].zeroTime = Date.now();
        activeSmoothie = 0;
        $($("canvas")[1]).parent().find("."+DAP_SELECT_CHART_BUTTON).addClass('active')
        dap_print("Start debug routines");
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = process;
        xhr.open("GET", "/data/predictions.json", true);
        xhr.send(null);
        function process(event) {
            if (event.currentTarget.readyState == 4) {

                //event.currentTarget.responseText =
                //var cad = "{a{s,d}d}{2{31}3sasd}"
                var cad = event.currentTarget.responseText

                var entries = [];
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
                        entries.push(JSON.parse(line))
                        lastPosition = i+1;
                        leftCurlyBrackets = 0;
                    }
                }
                //var count = 0;
                var count = (cad.match(/\n/g) || []).length;
                var debugPosition = parseInt(Math.random()*entries.length);
                var debugFirstElement = entries[debugPosition];
                dap_print(debugPosition);
                //dap_print(count +"=?"+entries.length)
                var myws = {canvas:$("canvas")[1]}



                dapRegisterMessage( {command:"time",before:600000, after:180000},myws);


                myws.canvas.smoothie.zeroTime = Date.parse(debugFirstElement.time)
                myws.canvas.smoothie.eventsInBuffer = [];
                var bufferTime = myws.canvas.smoothie.graphTime + myws.canvas.smoothie.delay;
                var bufferEnd = myws.canvas.smoothie.zeroTime - bufferTime;

                for (var i = debugPosition; Date.parse(entries[i].time) > bufferEnd;i--) {
                    myws.canvas.smoothie.eventsInBuffer.push(entries[i]);
                }
                dap_print("First in buffer="+myws.canvas.smoothie.eventsInBuffer[0].time);
                dap_print("First in buffer="+myws.canvas.smoothie.eventsInBuffer[myws.canvas.smoothie.eventsInBuffer.length-1].time);
            }
        }
    }
}


var getWindowEvents = function (events, time, position){
    if (position == undefined) {
        position = events.lenght-1;
    }
    var windowEvents = [];
    //for (var i = position)

}

