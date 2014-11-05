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


/*Other constants*/
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
if (GLOBAL_DEBUG){


}
/*WS constant messages*/
var PV_WS_SPLIT = "::"
var PV_WS_EVENT = "event"
var PV_WS_PREDICTION = "prediction"

var PV_SECOND = 1000;
var PV_MINUTE = 60 * PV_SECOND
var PV_HOUR = 60 * PV_MINUTE ;

var COLORS = chroma.brewer['Dark2'];
COLORS[0] = 'blue'
COLORS[1] = 'green'
COLORS[2] = 'orange'

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

//    $("#"+PV_CHARTS).css('max-height','calc(100vh - '+($("#"+PV_CHARTS).offset().top + PV_BORDER_SIZE)+'px');
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

var pvInitLeftColumn = function (){
    var toolBar = $("#"+PV_TOOL_BAR)
    toolBar.detach();
    toolBar.appendTo($("#"+LEFT_COLUMN_CONTENT));
//    $(LEFT_COLUMN_CONTENT).append
}
var pvStartRoutines = function (){
    pvInitLeftColumn();
}

var pvAddGraph = function () {
    var colClass = "col-lg-"+parseInt(12/PV_COLS);
    var section = $('.'+DASHBOARD_TEMPLATES).find('.'+PV_CHART).clone()
    section.find('.template').removeClass('section')
    section.removeAttr('class').addClass(PV_CHART).addClass(colClass);
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

    charts.push(smoothie)
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
        if (smoothie.actualColor >= COLORS.length){
            smoothie.actualColor = 0;
        }
        smoothie.events[eventName] = {}
        smoothie.events[eventName].color = COLORS[color];
        smoothie.events[eventName].id = eventName
        smoothie.events[eventName].timeSeries = new TimeSeries();
        smoothie.addTimeSeries(smoothie.events[eventName].timeSeries,{
            strokeStyle: COLORS[color],
            fillStyle: chroma(COLORS[color]).darken().alpha(0.2).css(),
            lineWidth: 2

        })
    }
    paintLegendEvents($(canvas))
    return smoothie.events[eventName];

}
var pvAddEventOccurrenceToCanvas = function (canvas,eventId){
    var jQCanvas = $(canvas)
    var event = pvAddEventToSmoothie(canvas,eventId)
    canvas.smoothie.eventsHappend.push({event:event,time: (new Date()).getTime()})
    paintLeftEvents(jQCanvas)

//    var eventsCount = $(getCharDiv(jQCanvas)).find('.'+PV_EVENTS_COUNT).empty();
//    $.each(smoothie.eventsHappend,function (key) {
//        var div = $('<div/>')
//        var span0 = $('<span>.</span>')
//        var span1=$('<span title="ID:'+this.event.id+'\nDate:'+(new Date(this.event.time)).toUTCString()+'">'+this.event.id+'</span>').css('color',this.event.color)
//        var span2=$('<span>'+(key++)+') </span>')
//        div.append(span2).append(span1)
//        eventsCount.append(div)
//    })

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
                var timePerPixel = parseInt(this.smoothie.graphTime / width);
                this.smoothie.graphTime = timePerPixel * width;
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
    if (!first){
        return;
    }
//    first = false;
    var canvas = this;
    var jQCanvas = $(this)
    var jQSvg = jQCanvas.parent().find("."+PV_SVG_UP_CANVAS)
    jQSvg.find("."+PV_SVG_EVENTS_IN_UP_CANVAS).remove();
    var d3Svg = d3.select(jQSvg[0]);
    var thisDate = (new Date()).getTime()
    var cy = jQSvg.height()-2
    var toDelete = []
    var count = 1;
    $.each(this.smoothie.eventsHappend,function (key) {

        var difference = thisDate - this.time;

        if (difference > PV_CHARTS_DEFAULT_TIME *  canvas.smoothie.zero){
            toDelete.push(key)
        }else {
            var cx = jQSvg.width()*canvas.smoothie.zero;
            var pixelDifference = parseInt(difference / canvas.smoothie.options.millisPerPixel)
            cx -= pixelDifference;
            d3Svg.append('line')
                .attr('x1',cx)
                .attr('x2',cx)
                .attr('y1',0)
                .attr('y2',cy)
                .attr('stroke-width', PV_SVG_FOOTER_STROKE_VERTICAL_LINE)
                .attr('stroke', this.event.color)
                .attr('shape-rendering',"crispEdges")
                .attr("class", PV_SVG_EVENTS_IN_UP_CANVAS)

            var circle = d3Svg.append('circle')
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', 2)
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
        paintLeftEvents(jQCanvas)
        paintLegendEvents(jQCanvas)

    }

}

var paintLegendEvents = function (jQCanvas) {
    var legend = $(getCharDiv(jQCanvas)).find('.'+PV_EVENTS_LEGEND).empty();
    var first = true;
    // TODO
    $.each(jQCanvas[0].smoothie.events,function (key) {
        if (this.timeSeries.data.length == 0) {
            return;
        }
        if (first){
            first = false
            legend.append('<span>Predictions: </span>')
        }else {
            legend.append("<span> | </span>")
        }
        var cad = this.id
        if (this.timeSeries.data.length > 0) {
            cad += "="+this.timeSeries.data[this.timeSeries.data.length -1][1];
        }
        var span1=$('<span>'+cad+'</span>').css('color',this.color)
        legend.append(span1)
    })
}

var paintLeftEvents = function (jQCanvas){
    var eventsCount = $(getCharDiv(jQCanvas)).find('.'+PV_EVENTS_COUNT).empty();
    $.each(jQCanvas[0].smoothie.eventsHappend,function (key) {
        var div = $('<div title="ID:'+this.event.id+'\nDate:'+(new Date(this.time)).toUTCString()+'"/>')
        var span1=$('<span>'+this.event.id+'</span>').css('color',this.event.color)
        var span0=$('<span>'+(key)+') </span>')
        div.append(span0).append(span1)
        eventsCount.append(div)
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

}
var pvResizingCols = function () {
    var colNum =Math.floor(PV_MAX_LG_COL / PV_COLS);
    $('#'+PV_CHARTS).find('.'+PV_CHART).removeClassPrefix('col-').addClass('col-lg-'+colNum);
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
    PV_COLS = parseInt($(button).find('input').attr('value'));
    pvResizingCols();

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
                    var prediction =  cadSplit[2]
                    var event = pvAddEventToSmoothie(ws.canvas,cadSplit[1])

                    /*The step not work corretly in the librery, this code fix it because put 0 if not exist value or put
                    * the last value*/
                    if (event.timeSeries.data.length == 0){
                        event.timeSeries.append(Date.now()-1,0);

                    } else {
                        event.timeSeries.append(Date.now()-1,event.timeSeries.data[event.timeSeries.data.length-1][1]);
                    }
                    event.timeSeries.append(Date.now(),prediction);
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

var getActiveGraph = function (){
    var dom = $("button.active."+PV_SELECT_CHART_BUTTON)
    return getCanvas(dom);



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
    var generateEvent = function (){
        if (PV_STOP){
            return;
        }
        var nChart = parseInt(Math.random()*($("canvas").length-1)) + 1
        var canvas= $("canvas")[nChart];
        var nEvent = parseInt((Math.random()*(debugEvents.length+2)))-2
        if (nEvent < 0) {
            var prediction =  parseInt(Math.random()*100)
            var event = pvAddEventToSmoothie(canvas,debugEvents[0]+"_"+nChart)

            /*The step not work corretly in the librery, this code fix it because put 0 if not exist value or put
             * the last value*/
            if (event.timeSeries.data.length == 0){
                event.timeSeries.append(Date.now()-1,0);

            } else {
                event.timeSeries.append(Date.now()-1,event.timeSeries.data[event.timeSeries.data.length-1][1]);
            }
            event.timeSeries.append(Date.now(),prediction);
        } else {
            var sEvent = debugEvents[nEvent]+"_"+nChart;
            pvAddEventOccurrenceToCanvas(canvas,sEvent)

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
//    var newValue = parseInt($('.'+PV_CHART).find('canvas').attr('height'))+ODV_HEIGHT_STEP;
//    $('.'+ODV_CHART).find('canvas').attr('height',newValue);
//    $.each(charts,function (key, value){
//        value.options.labels.fontSize = value.options.labels.fontSize + ODV_FONT_STEP;
//    })
}
function pvDecrementChartsHeight(){
    if (actualHeight <= PV_HEIGHT_STEP*2){
        return
    }
    actualHeight -= PV_HEIGHT_STEP;
    pvResizeFunction()
//    var newValue = parseInt($('.'+ODV_CHART).find('canvas').attr('height'))-ODV_HEIGHT_STEP;
//    if (newValue > 0)
//        $('.odv-chart').find('canvas').attr('height',newValue);
//
//    $.each(charts, function (key, value) {
//        newValue =  value.options.labels.fontSize - ODV_FONT_STEP
//        // Para guardar la relaccion de steps
//        if (newValue > 2) {
//            value.options.labels.fontSize = newValue
//        }
//    })

}
