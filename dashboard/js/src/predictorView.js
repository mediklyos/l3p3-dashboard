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
if (GLOBAL_DEBUG){
    PV_CHARTS_DEFAULT_TIME = 60*1000;
    PV_SVG_FOOTER_LINE_SEPARATION = 10000

}
/*WS constant messages*/
var PV_WS_SPLIT = ":"
var PV_WS_EVENT = "event"

var PV_SECOND = 1000;
var PV_MINUTE = 60 * PV_SECOND
var PV_HOUR = 60 * PV_MINUTE ;

var COLORS = chroma.brewer['Dark2'];
COLORS[0] = 'blue'
COLORS[1] = 'green'
COLORS[2] = 'red'




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
    }
};

/*view vars*/
var pvCharts = []
var actualHeight = 80;
var activeSmoothie = undefined;

var PV_BORDER_SIZE = 20;

var pvResizeFunction = function (){

    $("#"+PV_CHARTS).css('max-height','calc(100vh - '+($("#"+PV_CHARTS).offset().top + PV_BORDER_SIZE)+'px');
    resizingCanvasChart();
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
    smoothie.graphTime = PV_CHARTS_DEFAULT_TIME;
    smoothie.verticalLineTime =PV_SVG_FOOTER_LINE_SEPARATION;
    smoothie.footerVerticalLine = PV_SVG_FOOTER_LINE_SEPARATION;
    smoothie.eventsHappend = [];
    smoothie.events = {}
    smoothie.actualColor = 0;
    var canvas = $(section.find('canvas')[0])
    canvas[0].smoothie = smoothie;
    canvas[0].smoothie.paintName = false;

//    $('<svg/>',{
//
//    }).appendTo(section);
    charts.push(smoothie)
    smoothie.streamTo(section.find('canvas').get(0), PV_TIMEOUT);
    smoothie.extraActionsInAnimation = drawOnCanvasEvents.bind(canvas[0])//.bind(this.smoothie);
    if (GLOBAL_DEBUG){
        pvAddEventToSmoothie(smoothie,'event');
        pvAddEventOccurrenceToSmoothie(smoothie,'event')
    }
    resizingCanvasChart (section)
//    section.find('canvas')[0].id = predictor;
}

var pvActiveNames = function (event) {
    var canvas = getCanvas(event.target)
    canvas.smoothie.paintName = !canvas.smoothie.paintName;
}

var pvAddEventToSmoothie = function (smoothie,eventName){
    if (smoothie.events[eventName] === undefined){
        var color = smoothie.actualColor;
        smoothie.actualColor++;
        if (smoothie.actualColor >= COLORS.length){
            smoothie.actualColor = 0;
        }
        smoothie.events[eventName] = {}
        smoothie.events[eventName].color = COLORS[color];
        smoothie.events[eventName].id = eventName
    }
    return smoothie.events[eventName];

}
var pvAddEventOccurrenceToSmoothie = function (smoothie,eventId){
    var event = pvAddEventToSmoothie(smoothie,eventId)
    smoothie.eventsHappend.push({event:event,time: (new Date()).getTime()})

}


var resizingCanvasChart = function (charts){
    var canvas;
    if (canvas === undefined){
        canvas = $('#'+PV_CHARTS).find('canvas');
    } else {
        canvas = charts.find('canvas')
    }
    var width = canvas.parent().width();
    canvas.attr('width',width)
    canvas.attr('height',actualHeight)
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
    })


}

var first = true;
var drawOnCanvasEvents = function () {
//    if (!first){
//        return;
//    }
//    first = false;
    var canvas = this;
    var jQCanvas = $(this)
    var jQSvg = jQCanvas.parent().find("."+PV_SVG_UP_CANVAS)
    jQSvg.find("."+PV_SVG_EVENTS_IN_UP_CANVAS).remove();
    var d3Svg = d3.select(jQSvg[0]);
    var thisDate = (new Date()).getTime()
    var cy = jQSvg.height()-2
    var eventsCount = jQCanvas.parent().find('.'+PV_EVENTS_COUNT).empty();
    var toDelete = []
    var count = 1;
    $.each(this.smoothie.eventsHappend,function (key) {

        var difference = thisDate - this.time;

        var cx = jQSvg.width()*canvas.smoothie.zero;
        if (difference > PV_CHARTS_DEFAULT_TIME *  canvas.smoothie.zero){
            toDelete.push(key)
        }else {
            var pixelDifference = parseInt(difference / canvas.smoothie.options.millisPerPixel)
            cx -= pixelDifference;
            if (this.event === undefined){
                console.log("algo masa")
            }

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
                    .attr('font-size', PV_SVG_FOOTER_LINE_FONT_SIZE + "px")
                    .attr('text-anchor', "end")
//            .attr('transform',"rotate(270 "+cx+","+cy+")")
                    .attr('transform', "rotate(270)")
                    .text(this.event.id)
                text
                    .attr('x', -cy + $(text[0]).width() + 1)
                    .attr('y', cx)
            }
            var span0 = $('<span>.</span>')
            var span1=$('<span title="ID:'+this.event.id+'\nDate:'+(new Date(this.time)).toUTCString()+'">'+this.event.id+'</span>').css('color',this.event.color)
            var span2=$('<span>'+(count++)+') </span>')
            eventsCount.prepend(span2)
            eventsCount.prepend(span1)
            eventsCount.prepend(span0)

        }
    })
    $.each(toDelete,function () {
        canvas.smoothie.eventsHappend.splice(this,1);
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
        .attr('text-anchor',"end")
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
            .attr('text-anchor',"end")
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
            .attr('text-anchor',"end")
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
        cad += thisTime+"H";
        actualPrecision++;

        if (actualPrecision >= precission)
            return cad;
    }
    if (actualTime >= PV_MINUTE){
        var thisTime = parseInt(actualTime/PV_MINUTE)
        actualTime -= thisTime * PV_MINUTE;
        cad += thisTime+"M";
        actualPrecision++;

        if (actualPrecision >= precission)
            return cad;
    }
    if (actualTime >= PV_SECOND){
        var thisTime = parseInt(actualTime/PV_SECOND)
        actualTime -= thisTime * PV_SECOND;
        cad += thisTime+"S";
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
        resizingCanvasChart();
//        $(function () {
//            $('#'+ODV_CHARTS).find('canvas').attr('width', $('#'+ODV_CHARTS).find('canvas').width());
//        })

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
    var canvas =  getActiveGraph();
    if (canvas === undefined){
        return;
    }

    if (url === undefined || url == ""){
        return;
    }
    // TODO
//    odv_clear(true);

    var ws = new ReconnectingWebSocket('ws://' + url);
    ws.onopen = function(e) {
        console.log('Connection Open: '+ e.url);
        lineCount = 0;
    };

    ws.onclose = function() {
        console.log('Connection closed');
    };
    ws.onmessage = function(e) {
        var cadSplit = e.data.split(PV_WS_SPLIT)
        switch (cadSplit[0]) {
            case PV_WS_EVENT:
                pvAddEventOccurrenceToSmoothie(ws.canvas.smoothie,cadSplit[1])
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
    if (!(actualDom instanceof jQuery)){
        actualDom = $(actualDom)
    }
    while (!actualDom.hasClass(PV_CHART)){
        actualDom = actualDom.parent();
    }
    return actualDom.find('canvas')[0]
}

var pv_print = function (string){
    if (GLOBAL_DEBUG){
        console.log(string)
    }
}