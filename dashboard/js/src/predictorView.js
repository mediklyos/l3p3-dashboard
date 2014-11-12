/**
 * Created by Francisco Huertas on 29/10/14.
 */

var PRE = views[0][5].constantsPrefix;
/* HTML ID's and classes*/
var PV_COLS = 2;

var PV_THRESHOLD_SLIDER_PANEL = PRE + "-threshold-slider-panel";
var PV_SPAN_THRESHOLD_VALUE = PRE + "-threshold-value";
var PV_EVENTS_COL = PRE + "-events-col"
var PV_EVENTS_LIST = PRE + "-events-list"
var PV_CHARTS = PRE + "-charts"
var PV_TOOL_BAR = PRE + "-tool-bar"
var PV_CHART = PRE + "-chart"
var PV_COLUMNS_CLICK = PRE + "-columns-click"
var PV_TEMPORAL_LINE_VERTICAL = PRE + "-temporalLine-vertical"
var PV_TEMPORAL_LINE_HORIZONTAL = PRE + "-temporalLine-horizontal"
var PV_TEMPORAL_LINE_TEXT = PRE + "-temporalLine-horizontal"
var PV_SELECT_CHART_BUTTON = PRE +"-select-graph"
var PV_SVG_UP_CANVAS = PRE +"-svg-up-canvas"
var PV_SVG_EVENTS_IN_UP_CANVAS = PRE +"-svg-events-in-up-canvas"
var PV_SVG_FOOTER_CLASS = PRE + "-svg-footer-class"
var PV_INPUT_URL = PRE + "-input-url"
var PV_EVENTS_COUNT = PRE + "-events-count"
var PV_EVENTS_COUNT_PARENT = PRE + "-events-count-parent"
var PV_EVENTS_LEGEND = PRE + "-events-legend"
var PV_TOOLTIP  = PRE + "-tooltip"
var PV_TOOLTIP_EVENTS_OCCURRED = PRE + "-tooltip-events-occurred"
var PV_TOOLTIP_EVENTS_OCCURRED_INTERNAL = PRE + "-tooltip-events-occurred-internal"
var PV_FOOTER_CHART = PRE + "-footer-chart-stats"
var PV_FOOTER_TABLE_GRAPH = PRE + "-table-graph-footer"
var PV_FOOTER_CHART_EVENTS = PRE + "-footer-chart-stats-events"
var PV_TABLE_EVENTS_OCCURRENCE = PRE + "-table-evens-occurrence"
var PV_TABLE_EVENTS_PREDICTION = PRE + "-table-evens-prediction"
var PV_CELL_1 = PRE +"-td-1"
var PV_CELL_2 = PRE +"-td-2"



var PV_PREFIX_CLASS_EVENTS = PRE + "-event-class-prefix-"
var PV_PREFIX_CLASS_PREDICTION = PRE + "-prediction-class-prefix-"
/*Other constants*/
var PV_LINE_BOLD = 3;
var PV_LINE_NORMAL = 1
var PV_TIMEOUT = 1000
var PV_MAX_LG_COL = 12;
var PV_CHARTS_DEFAULT_TIME = 10*60*1000;
var PV_SVG_FOOTER_LINE_FONT_SIZE = 10;
var PV_SVG_FOOTER_LINE_HEIGHT = 10 + PV_SVG_FOOTER_LINE_FONT_SIZE;
var PV_SVG_FOOTER_LINE_SEPARATION = 60000 // in milliseconds
var PV_SVG_FOOTER_SUB_LINE_HEIGHT = 3
var PV_SVG_FOOTER_STROKE_VERTICAL_LINE = 1
var PV_SVG_FOOTER_FONT_FAMILY = "monospace"
var PV_HEIGHT_STEP = 10;
var PV_EVENT_CIRCLE_RADIUS = 2;
var PV_EVENT_CIRCLE_RADIUS_HOVER = 4;
var PV_EVENT_LINE_WIDTH = 1;
var PV_EVENT_LINE_WIDTH_HOVER = 2;
if (GLOBAL_DEBUG){


}
/*WS constant messages*/
var PV_WS_SPLIT = "::"
var PV_WS_EVENT = "event"
var PV_WS_PREDICTION = "prediction"

var PV_SECOND = 1000;
var PV_MINUTE = 60 * PV_SECOND
var PV_HOUR = 60 * PV_MINUTE ;



/*DEBUG vars*/
if (GLOBAL_DEBUG){
    PV_CHARTS_DEFAULT_TIME = 120*1000;
    PV_SVG_FOOTER_LINE_SEPARATION = 20000
    var TEST_EVENT_NAME = "ev_"
    var debugWSS = []
    var debugEvents =  []
    var num = 0;
    debugEvents.push(TEST_EVENT_NAME+num++)
    debugEvents.push(TEST_EVENT_NAME+num++)
    debugEvents.push(TEST_EVENT_NAME+num++)
    debugEvents.push(TEST_EVENT_NAME+num++)
    debugEvents.push(TEST_EVENT_NAME+num++)
    debugEvents.push(TEST_EVENT_NAME+num++)
    var timeRange = [1500,5000]
    var PV_STOP = false
    var pv_pause = false;
}



var PV_SMOOTHIE_DEFAULT_OPTIONS= {
    millisPerPixel: 20,
    grid: {
        sharpLines: true,
        verticalSections: 5,
//        strokeStyle: 'rgba(119,119,119,0.45)',
        strokeStyle: 'rgba(0,0,0,0.5)',
        fillStyle: 'rgba(0,0,0,0.1)',
        millisPerLine: PV_SVG_FOOTER_LINE_SEPARATION

    },
//    minValue: 0,
    labels: {
//        disabled: false,
        fillStyle:'rgba(255,0,0,1)'
    },
    interpolation:'line',
    maxValue:100,
    minValue:0
};

/*view vars*/
var pvCharts = []
var actualHeight = 200;
var activeSmoothie = undefined;

var PV_BORDER_SIZE = 20;

var pvResizeFunction = function (){
    var cssWidth = (100 / PV_COLS) - 2;
    var colNum =Math.floor(PV_MAX_LG_COL / PV_COLS);
//    $('#'+PV_CHARTS).find('.'+PV_CHART).removeClassPrefix('col-').addClass('col-lg-'+colNum);
    $('#'+PV_CHARTS).find('.'+PV_CHART).css('width',cssWidth+"%")
//    $("#"+PV_CHARTS).css('max-height','calc(100vh - '+($("#"+PV_CHARTS).offset().top + PV_BORDER_SIZE)+'px');
    resizingCanvasChart();
    resizingCanvasChart();
}

var pv_clear = function (){
    if (GLOBAL_DEBUG){
        PV_STOP = true;

    }
}

var pvSetThreshold = function (value) {
    // TODO copiar del anterios
}

var pvInitLeftColumnAndFooter = function (){
    var toolBar = $("#"+PV_TOOL_BAR)
    toolBar.detach();
    toolBar.appendTo($("#"+LEFT_COLUMN_CONTENT));
    var footerContent = $("."+PV_FOOTER_TABLE_GRAPH).clone()

    $("#"+FOOTER_CONTENT_ID).append(footerContent)

//    $(LEFT_COLUMN_CONTENT).append
}
var pvStartRoutines = function (){
    pvInitLeftColumnAndFooter();
}


var graph = 0;
var pvAddGraph = function () {
//    var colClass = "col-lg-"+parseInt(12/PV_COLS);
    var section = $('.'+DASHBOARD_TEMPLATES).find('.'+PV_CHART).clone()

    section.find('.template').removeClass('section')
    section.removeAttr('class').addClass(PV_CHART)//.addClass("col-lg-1");
    section.appendTo('#'+PV_CHARTS);
    var smoothie = new SmoothieChart(PV_SMOOTHIE_DEFAULT_OPTIONS);
    smoothie.timelines = {}
    smoothie.graphTime = PV_CHARTS_DEFAULT_TIME;
    smoothie.verticalLineTime =PV_SVG_FOOTER_LINE_SEPARATION;
    smoothie.footerVerticalLine = PV_SVG_FOOTER_LINE_SEPARATION;
    smoothie.eventsHappend = [];
    smoothie.events = {}
    smoothie.actualColor = 0;
    var canvas = $(section.find('canvas')[0])
    canvas[0].smoothie = smoothie;
    canvas[0].smoothie.paintName = true;

    pvCharts.push(smoothie)
    smoothie.streamTo(section.find('canvas').get(0), PV_TIMEOUT);
    smoothie.extraActionsInAnimation = drawOnCanvasEvents.bind(canvas[0])//.bind(this.smoothie);
    if (GLOBAL_DEBUG){
//        pvAddEventToSmoothie(smoothie,TEST_EVENT_NAME);
        var ev = 0;
//        setTimeout(pvAddEventOccurrenceToCanvas.bind(this,canvas[0],TEST_EVENT_NAME+ev++),0)
//        setTimeout(pvAddEventOccurrenceToCanvas.bind(this,canvas[0],TEST_EVENT_NAME+ev++),1000);
//        setTimeout(pvAddEventOccurrenceToCanvas.bind(this,canvas[0],TEST_EVENT_NAME+ev++),10000);
//        setTimeout(pvAddEventOccurrenceToCanvas.bind(this,canvas[0],TEST_EVENT_NAME+ev++),15000);
//        setTimeout(pvAddEventOccurrenceToCanvas.bind(this,canvas[0],TEST_EVENT_NAME+ev++),23100);
    }
    pvResizeFunction()
}

var pvActiveNames = function (event) {
    var canvas = getCanvas(event.target)
    canvas[0].smoothie.paintName = !(canvas[0].smoothie.paintName);
}

var pvAddEventToSmoothie = function (canvas,eventName){
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
        smoothie.addTimeSeries(smoothie.events[eventName].timeSeries,{
            strokeStyle: web_colors[color],
            lineWidth: PV_LINE_NORMAL,
            "shape-rendering": "crispEdges",
            fillStyle: chroma(web_colors[color]).darken().alpha(0).css()

        })
        smoothie.events[eventName].timeSeries.lineOptions = smoothie.seriesSet[smoothie.seriesSet.length-1].options;
    }
    return smoothie.events[eventName];

}
var pvAddEventOccurrenceToCanvas = function (canvas,eventId){
    var jQCanvas = $(canvas)
    var event = pvAddEventToSmoothie(canvas,eventId)
    canvas.smoothie.eventsHappend.push({event:event,time: Date.now()})
    paintEvents(jQCanvas)
}


var resizingCanvasChart = function (charts){
    var canvas;
    if (canvas === undefined){
        canvas = $('#'+PV_CHARTS).find('canvas');
    } else {
        canvas = charts.find('canvas')
    }
    canvas.attr('height',actualHeight)
    $(function (){

        var width = canvas.parent().width();
//    width = canvas.width();
//    width = canvas.parent().outerWidth()
        canvas.attr('width', width)
        $.each(canvas,function(){
            if (this.smoothie !== undefined) {
                var timePerPixel = this.smoothie.graphTime / width;
//                if (timePerPixel  != this.smoothie.graphTime) {
//                    timePerPixel++;
//                    this.smoothie.graphTime = timePerPixel * width;
//                }
                this.smoothie.zero = 0.5
                this.smoothie.options.millisPerPixel = timePerPixel;
                var svg =  $(this).parent().find('svg.'+PV_SVG_FOOTER_CLASS);

                drawFooter(svg,width,timePerPixel,this.smoothie.footerVerticalLine);
                drawOnCanvasBase(this)
//            this.
            }
            var divChart = getCharDiv(canvas);
            divChart.find("."+PV_EVENTS_COUNT_PARENT).css('height',canvas.parent().height())
        })
    })



}

var first = true;
var drawOnCanvasEvents = function () {
    if (!first || pv_pause ){
        return;
    }
//    first = false;
    var canvas = this;
    var jQCanvas = $(this)
    var jQSvg = jQCanvas.parent().find("."+PV_SVG_UP_CANVAS)
    jQSvg.find("."+PV_SVG_EVENTS_IN_UP_CANVAS).remove();
    var d3Svg = d3.select(jQSvg[0]);
    var thisDate = Date.now()
    var cy = jQSvg.height()-2
    var toDelete = []
    var count = 1;
    // TODO particularizar eliminar este tipo de tooltip
    jQSvg.find("."+PV_TOOLTIP_EVENTS_OCCURRED).remove();
    $.each(this.smoothie.eventsHappend,function (key) {

        var difference = thisDate - this.time;

        if (difference > PV_CHARTS_DEFAULT_TIME *  canvas.smoothie.zero){
            toDelete.push(key)
        }else {
            var cx = jQSvg.width()*canvas.smoothie.zero;
            var pixelDifference = parseInt(difference / canvas.smoothie.options.millisPerPixel)
            var lineWidth;
            var radius;
            var fontWeight;
            cx -= pixelDifference;
            if (this.isHover || this.isClicked){
                if (this.isClicked){
                    radius = radius
                }
                lineWidth = PV_EVENT_LINE_WIDTH_HOVER
                radius = PV_EVENT_CIRCLE_RADIUS_HOVER
                fontWeight = 'bold'
                var content = $('<div/>', {
                    class: PV_TOOLTIP_EVENTS_OCCURRED_INTERNAL
                }).append('<div>Event ID: '+this.event.id+'</div><div style="white-space: nowrap">Time: '+printDate(this.time)+'</div>');
                content.css('border-color',this.event.color)
                content.css('color',this.event.color)
                if (this.event.color.charAt(0) == "#"){
                    content.css('background','rgba('+$c.hex2hsv(this.event.color).a.toString()+', 0.2)')
                } else {
                    content.css('background','rgba('+$c.name2rgb(this.event.color).a.toString()+', 0.2)')

                }
//                content.css()
                var tooltip = createTooltip(d3Svg,content ,PV_TOOLTIP_EVENTS_OCCURRED,MY_ALIGNMENT_TOP_LEFT,cx,0)
                // TODO el problma es en el repintado, si esta parado se quita
                tooltip.style('z-index',"20");
//                d3plus.color.text,,,
                tooltip[0][0].onclick = function () {
                    this.isClicked = false;paint
                }.bind(this)



            } else {
                lineWidth = PV_EVENT_LINE_WIDTH
                radius = PV_EVENT_CIRCLE_RADIUS
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
                .attr("class", PV_SVG_EVENTS_IN_UP_CANVAS)

            var circle = d3Svg.append('circle')
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', radius)
                .attr("class", PV_SVG_EVENTS_IN_UP_CANVAS)
                .style("fill", this.event.color)
            circle.append('title')
                .text(this.event.id)
                .style("fill", this.event.color);

            if (canvas.smoothie.paintName) {
                var text = d3Svg.append('text')
                    .attr("class", PV_SVG_EVENTS_IN_UP_CANVAS)
                    .attr('fill', this.event.color)
                    .attr('font-family', PV_SVG_FOOTER_FONT_FAMILY)
                    .attr('font-size', (PV_SVG_FOOTER_LINE_FONT_SIZE+5) + "px")
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
    if (toDelete.length > 0){
        for (var i = toDelete.length-1;i >=0;i-- ) {
            canvas.smoothie.eventsHappend.splice(toDelete[i],1);
        }
        paintEvents(jQCanvas)
        paintLegendPredictions(jQCanvas)

    }

}

var paintLegendPredictions = function (jQCanvas) {
    var legend = $(getCharDiv(jQCanvas)).find('.'+PV_EVENTS_LEGEND).empty();
    var first = true;
    // TODO

    var tbody =$("#"+FOOTER_CONTENT_ID).find("."+PV_TABLE_EVENTS_PREDICTION ).find('tbody');
    var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
    tbody.empty()
    tbody.append(genericLine)
    $.each(jQCanvas[0].smoothie.events,function (key) {
        if (this.timeSeries.data.length == 0) {
            return;
        }
        var line = genericLine.clone().removeAttr('class')
//        line.find('.'+PV_CELL_1).removeAttr('class').text(this.id)
//        line.find('.'+PV_CELL_2).removeAttr('class').text(this.timeSeries.data[this.timeSeries.data.length-1][1])
        var className = PV_PREFIX_CLASS_PREDICTION+this.id
        var spanEvent =$('<span>'+this.id+'</span>').css('color',this.color)
        var spanPrediction =$('<span>'+this.timeSeries.data[this.timeSeries.data.length-1][1]+'</span>').css('color',this.color)
        line.find('.'+PV_CELL_1).removeAttr('class').addClass(className).append(spanEvent);
        line.find('.'+PV_CELL_2).removeAttr('class').addClass(className).append(spanPrediction);
        tbody.append(line)
        line.hover(
            function (){
                setLineWidth(this,true)
//                $("."+classId).css('font-weight','bold')
//                this.timeSeries.lineOptions.lineWidth = PV_LINE_BOLD
            }.bind(this),
            function (){
                setLineWidth(this,this.isClicked)
            }.bind(this)
        )
        line.click(function() {
            this.isClicked = !this.isClicked;
            setLineWidth(this,this.isClicked)
        }.bind(this))

    })
}

var setLineWidth = function(event,bold) {
    var className = PV_PREFIX_CLASS_PREDICTION+event.id;
    if (bold) {
        $("."+className).css('font-weight','bold')
        event.timeSeries.lineOptions.lineWidth = PV_LINE_BOLD
    } else {
        $("."+className).css('font-weight','normal')
        event.timeSeries.lineOptions.lineWidth = PV_LINE_NORMAL
    }
}

var paintEvents = function (jQCanvas){
    var eventsCount = $(getCharDiv(jQCanvas)).find('.'+PV_EVENTS_COUNT).empty();
    var size = jQCanvas[0].smoothie.eventsHappend.length
    /*Paint in the left*/
    paintEventsInADiv(eventsCount,jQCanvas[0].smoothie.eventsHappend, function (events,pos) {
        return (events.length -1 - pos)+") " ;
    })
    if (isActiveGraph(getCharDiv(jQCanvas))) {
        // PONER EL TITULO

        var tbody =$("#"+FOOTER_CONTENT_ID).find("."+PV_TABLE_EVENTS_OCCURRENCE ).find('tbody');
        var genericLine = tbody.find("tr."+DASHBOARD_TEMPLATES)
        tbody.empty()
        tbody.append(genericLine)
        for (var i = jQCanvas[0].smoothie.eventsHappend.length -1; i >= 0;i--){
            var event = jQCanvas[0].smoothie.eventsHappend[i];
            var line = genericLine.clone().removeAttr('class')
            var className = PV_PREFIX_CLASS_EVENTS+event.event.id+"-"+event.time
            var spanEvent =$('<span>'+event.event.id+'</span>').css('color',event.event.color)
            var spanTime =$('<span>'+printDate(event.time)+'</span>').css('color',event.event.color)
            line.find('.'+PV_CELL_1).removeAttr('class').addClass(className).append(spanEvent);
            line.find('.'+PV_CELL_2).removeAttr('class').addClass(className).append(spanTime);
            tbody.append(line);
//            var divs = line.find('td')
            line.hover(
                function (classId){
                    $("."+classId).css('font-weight','bold')
                    this.isHover = true;
                }.bind(event,className),
                function (classId){
                    if (this.isClicked) {
                        $("."+classId).css('font-weight','bold')
                    } else {
                        $("."+classId).css('font-weight','normal')
                    }
                    this.isHover = false;
                }.bind(event,className)
            )
            line.click(function(classId) {
                this.isClicked = !this.isClicked;
                if (this.isClicked){
                    $("."+classId).css('font-weight','bolt')
                } else{
                    $("."+classId).css('font-weight','normal')
                }
            }.bind(event,className))
        }
//        $.each(jQCanvas[0].smoothie.eventsHappend,function() {
//
//        })
//        paintEventsInADiv($("#"+PV_FOOTER_CHART_EVENTS),jQCanvas[0].smoothie.eventsHappend,function (events,pos) {
//            return ""
//        })

    }
}

var paintFooter = function (){

}
var paintEventsInADiv = function (container, eventsHappened,prefix) {
    var size = eventsHappened.length
    $.each(eventsHappened,function (key) {
        var div = $('<div title="ID:'+this.event.id+'\nDate:'+printDate(this.time)+'"/>')
        var span1=$('<span>'+this.event.id+'</span>').css('color',this.event.color)//.css('font-weight','bold')
        var className = PV_PREFIX_CLASS_EVENTS+this.event.id+"-"+this.time
        if (prefix !== undefined) {
            var span0=$('<span>'+prefix(eventsHappened,key)+'</span>').appendTo(div)
        }
        span1.addClass(className);
        if (this.isClicked || this.isHover){
            span1.css('font-weight','bold')
        } else{
            span1.css('font-weight','normal')
        }
        div.append(span1)
        div.hover(
            function (classId){
                $("."+classId).css('font-weight','bold')
                this.isHover = true;
            }.bind(this,className),
            function (classId){
                if (this.isClicked) {
                    $("."+classId).css('font-weight','bold')
                } else {
                    $("."+classId).css('font-weight','normal')
                }
                this.isHover = false;
            }.bind(this,className)
        )
        div.click(function(classId) {
            this.isClicked = !this.isClicked;
            if (this.isClicked){
                $("."+classId).css('font-weight','bolt')
            } else{
                $("."+classId).css('font-weight','normal')
            }
        }.bind(this,className))
        container.prepend(div)
    })
}

var drawOnCanvasBase = function (canvas){
    var jQCanvas = $(canvas)
    jQCanvas.parent().find('svg.'+PV_SVG_UP_CANVAS).remove();
    /*No funciona correctamente si se pone directamente ¿Porque?*/
    var width = parseInt(jQCanvas.width());
    var height = parseInt(jQCanvas.height());
    var d3Canvas = d3.selectAll(jQCanvas.parent());
    var svg = d3Canvas.append('svg')
        .attr('class', PV_SVG_UP_CANVAS)
        .style('width',width +"px")
        .style('height',(height+2)+"px")
        .style('left',jQCanvas.position().left)
        .style('top',jQCanvas.position().top)
        .append('line')
        .attr('x1',jQCanvas.width()*canvas.smoothie.zero)
        .attr('x2',jQCanvas.width()*canvas.smoothie.zero)
        .attr('y1',0)
        .attr('y2',jQCanvas.height())
        .attr('stroke-width', PV_SVG_FOOTER_STROKE_VERTICAL_LINE)
        .attr('stroke', 'black')
        .attr('shape-rendering',"crispEdges")


}

var drawFooter = function (svg,width,timePerPixel,lineSeparation,zero){
    var zeroPos;
    if (zero === undefined){
        zeroPos = width * 0.5;
    } else {
        zeroPos = width * zero;
    }
    svg.empty();
    svg.attr('height',PV_SVG_FOOTER_LINE_HEIGHT);
    svg.attr('width',width);
    var v_x1 = 0
    var v_x2 = width
    var v_y = PV_SVG_FOOTER_SUB_LINE_HEIGHT
    var d3Svg = d3.selectAll(svg.toArray())
    d3Svg.append('line')
        .attr('x1',v_x1)
        .attr('x2',v_x2)
        .attr('y1',v_y)
        .attr('y2',v_y)
        .attr('stroke-width', PV_SVG_FOOTER_STROKE_VERTICAL_LINE)
        .attr('stroke', 'black')
        .attr('shape-rendering',"crispEdges")
    //

    var widthStep = lineSeparation / timePerPixel ;
    /*Zero */
    var h_y1 = 0
    var h_y2 = PV_SVG_FOOTER_SUB_LINE_HEIGHT;
    var h_x = zeroPos;
    d3Svg.append('line')
        .attr('x1',h_x)
        .attr('x2',h_x)
        .attr('y1',h_y1)
        .attr('y2',h_y2)
        .attr('stroke-width', PV_SVG_FOOTER_STROKE_VERTICAL_LINE)
        .attr('stroke', 'black')
        .attr('shape-rendering',"crispEdges")
    d3Svg.append('text')
        .attr('fill','black')
        .attr('font-family',PV_SVG_FOOTER_FONT_FAMILY)
        .attr('font-size',PV_SVG_FOOTER_LINE_FONT_SIZE + "px")
        .attr('text-anchor',"middle")
        .attr('x',h_x)
        .attr('y',PV_SVG_FOOTER_LINE_FONT_SIZE + PV_SVG_FOOTER_SUB_LINE_HEIGHT)
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
            .attr('stroke-width', PV_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', 'black')
            .attr('shape-rendering',"crispEdges")
        d3Svg.append('text')
            .attr('fill','black')
            .attr('font-family',PV_SVG_FOOTER_FONT_FAMILY)
            .attr('font-size',PV_SVG_FOOTER_LINE_FONT_SIZE + "px")
            .attr('text-anchor',"middle")
            .attr('x',i)
            .attr('y',PV_SVG_FOOTER_LINE_FONT_SIZE + PV_SVG_FOOTER_SUB_LINE_HEIGHT)
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
            .attr('stroke-width', PV_SVG_FOOTER_STROKE_VERTICAL_LINE)
            .attr('stroke', 'black')
            .attr('shape-rendering',"crispEdges")
        d3Svg.append('text')
            .attr('fill','black')
            .attr('font-family',PV_SVG_FOOTER_FONT_FAMILY)
            .attr('font-size',PV_SVG_FOOTER_LINE_FONT_SIZE + "px")
            .attr('text-anchor',"middle")
            .attr('x',i)
            .attr('y',PV_SVG_FOOTER_LINE_FONT_SIZE + PV_SVG_FOOTER_SUB_LINE_HEIGHT)
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
    if (actualTime >= PV_HOUR){
        var thisTime = parseInt(actualTime/PV_HOUR)
        actualTime -= thisTime * PV_HOUR;
        cad += thisTime+"h";
        actualPrecision++;

        if (actualPrecision >= precission)
            return cad;
    }
    if (actualTime >= PV_MINUTE){
        var thisTime = parseInt(actualTime/PV_MINUTE)
        actualTime -= thisTime * PV_MINUTE;
        cad += thisTime+"m";
        actualPrecision++;

        if (actualPrecision >= precission)
            return cad;
    }
    if (actualTime >= PV_SECOND){
        var thisTime = parseInt(actualTime/PV_SECOND)
        actualTime -= thisTime * PV_SECOND;
        cad += thisTime+"s";
        actualPrecision++;

        if (actualPrecision >= precission)
            return cad;
    }
    return cad;


}

var PVSelectChart = function (event) {
    $("."+PV_SELECT_CHART_BUTTON).removeClass('active')//.removeClass('btn-primary').addClass('btn-default')
//    $(event.target).removeClass('btn-default').addClass('btn-primary').addClass('active')
//    $(event.target).removeClass('btn-default').addClass('btn-primary')
    $(event.target).addClass('active')
    $("#"+PV_FOOTER_CHART_EVENTS).empty()
    paintEvents(getCanvas(event.target))
//    paintEventsInADiv($("#"+PV_FOOTER_CHART_EVENTS),getActiveGraph()[0].smoothie.eventsHappend,function (events,pos) {
//        return "Fecha: "
//    })


}
var pvResizingCols = function () {

    // De esta forma se ejecuta al cargar ejecutar todas las cosas, se hace asi porque antes no se
    // sabe cuanto vale el ancho

    pvResizeFunction()


}



var addResource = function (url) {

}

function pvColumnsClick(event){
    $("#"+PV_COLUMNS_CLICK).find('.btn.btn-primary').removeClass('btn-primary').addClass('btn-default');
    var button = event.target;
    while (!$(button).hasClass('btn')){
        button = button.parentNode;
    }
    $(button).removeClass('btn-default').addClass('btn-primary');
    var newCols = parseInt($(button).find('input').attr('value'))
    if (newCols != PV_COLS) {
        PV_COLS = newCols
        pvResizingCols();
    }

//    $("#"+ORV_COLUMNS_CLICKS).find('.active').removeClass('btn-default').addClass('btn-primary');
}



var pvLoadSource = function (event) {
    if (event.keyCode == 13){
        console.log("Changing the source");
        onlineResourceView_postLoad_click();


    }
//    console.log("keyCode="+event.keyCode+", indentifier"+ event.keyIdentifier);
}

var pvLoadSource_click = function (){
//    onlineResourceView_postLoad($("#odv-input-url").val());
    _pvLoadSource($("#"+PV_INPUT_URL).val());
}

var _pvLoadSource = function (url) {
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
        var cadSplit = e.data.split(PV_WS_SPLIT)
        switch (cadSplit[0]) {
            case PV_WS_EVENT:
                if (cadSplit.length == 2 ){
                    pvAddEventOccurrenceToCanvas(ws.canvas,cadSplit[1])
                }
                break;
            case PV_WS_PREDICTION:
                if (cadSplit.length == 3 ){
//                    var prediction =  cadSplit[2]
//                    var event = pvAddEventToSmoothie(ws.canvas,cadSplit[1])
                    pvAddPrediction(ws.canvas,cadSplit[1],cadSplit[2])



                }
                break;
            default:
                pv_print("Incorrect message")

        }
//        console.log(e)


    }
    if (canvas.wss === undefined){
        canvas.wss = []
    }
    ws.canvas = canvas;
    canvas.wss.push(ws);


}

var pvAddPrediction = function (canvas, eventName, prediction) {
    /*The step not work corretly in the librery, this code fix it because put 0 if not exist value or put
     * the last value*/
    var event = pvAddEventToSmoothie(canvas,eventName)
    var now = Date.now();
     if (event.timeSeries.data.length == 0) {
        event.timeSeries.append(now-1,0);

     } else if (event.timeSeries.data[event.timeSeries.data.length-1][0] < (now-canvas.smoothie.graphTime)) {
         event.timeSeries.append(event.timeSeries.data[event.timeSeries.data.length-1][0]+1,-1);
         event.timeSeries.append(now-1,0);
     } else {
        event.timeSeries.append(now-1,event.timeSeries.data[event.timeSeries.data.length-1][1]);
    }
    event.timeSeries.append(now,prediction);
    paintLegendPredictions($(canvas))
    setTimeout(refreshPredictions.bind(undefined,canvas),canvas.smoothie.graphTime + PV_TIMEOUT)
}
var refreshPredictions = function (canvas) {
    var now = Date.now()
    var isDelete = false;
    $.each(canvas.smoothie.seriesSet,function () {
        if (this.timeSeries.data.length > 0){
            if (this.timeSeries.data[this.timeSeries.data.length-1][0] < (now - canvas.smoothie.graphTime - PV_TIMEOUT)){
                isDelete = true
                while(this.timeSeries.data.length > 0) {
                    this.timeSeries.data.pop();
                }
            }
        }
    })
    if (isDelete){
        paintLegendPredictions($(canvas))
    }
}
var getActiveGraph = function (){
    var dom = $("button.active."+PV_SELECT_CHART_BUTTON)
    return getCanvas(dom);



}

var isActiveGraph= function (divGraph) {
    return divGraph.find("button.active."+PV_SELECT_CHART_BUTTON).length != 0
}

var getCanvas = function (actualDom){
    return $(getCharDiv(actualDom)).find('canvas')
}

var getCharDiv = function (actualDom) {
    if (!(actualDom instanceof jQuery)){
        actualDom = $(actualDom)
    }
    while (!actualDom.hasClass(PV_CHART) && actualDom.length != 0){
        actualDom = actualDom.parent();

    }
    return actualDom;

}

var pv_print = function (string){
    if (GLOBAL_DEBUG){
        console.log(string)
    }
}

if (GLOBAL_DEBUG){
    setTimeout(function() {
        $($("."+PV_SELECT_CHART_BUTTON)[1]).trigger("click")
        _pvLoadSource("localhost:10082")
    },100);
//    $()
    var generateEvent = function (){
        if (PV_STOP){
            return;
        }
        if (!pv_pause) {
            var nChart = parseInt(Math.random() * ($("canvas").length - 1)) + 1
            var canvas = $("canvas")[nChart];
            var nEvent = parseInt((Math.random() * (debugEvents.length + 2))) - 2
            if (nEvent < 0) {
                var prediction = parseInt(Math.random() * 100)
                var event = pvAddEventToSmoothie(canvas, debugEvents[0] + "_" + nChart)

                /*The step not work corretly in the librery, this code fix it because put 0 if not exist value or put
                 * the last value*/
//                if (event.timeSeries.data.length == 0) {
//                    event.timeSeries.append(Date.now() - 1, 0);
//
//                } else {
//                    event.timeSeries.append(Date.now() - 1, event.timeSeries.data[event.timeSeries.data.length - 1][1]);
//                }
//                event.timeSeries.append(Date.now(), prediction);
            } else {
                var sEvent = debugEvents[nEvent] + "_" + nChart;
                pvAddEventOccurrenceToCanvas(canvas, sEvent)

            }
        }


        var next = parseInt(Math.random() * timeRange[1] + timeRange[0])
        setTimeout(generateEvent,next )
    }
    var next = parseInt(Math.random() * timeRange[1] + timeRange[0])
    setTimeout(generateEvent,next )

}


function pvIncrementChartsHeight(){
    actualHeight += PV_HEIGHT_STEP;
    pvResizeFunction()
}
function pvDecrementChartsHeight(){
    if (actualHeight <= PV_HEIGHT_STEP*2){
        return
    }
    actualHeight -= PV_HEIGHT_STEP;
    pvResizeFunction()
}

