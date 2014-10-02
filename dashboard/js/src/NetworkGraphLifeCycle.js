/**
 * Created by paco on 22/09/14.
 */


/* Constants */
var PRE = views[0][2].constantsPrefix;

/*HTML id constants*/
var NGLC_GRAPH_CONTAINER = PRE + "-graph"
var NGLC_SLIDER_PANEL = PRE +"-temporal-bar"
var NGLC_GRAPH_PANEL = PRE + "-graph-panel"
var NGLC_SLIDER_SUBPANEL = PRE + "-slider-subpanel"
var NGLC_INTERNAL_SLIDER = PRE + "-internal-slider"
var NGLC_DIV_START_DATE = PRE + "-start-date"
var NGLC_DIV_END_DATE = PRE + "-end-date"
var nodes;
var edges;
var elements;
var networkGraph = undefined;
var networkUrl;// = "data/nglc-demo/nodes.json";
var timeLineUrl;
var start;
var end;
var current;
var lapseTime;
var dataPainted = undefined;
var velocity;


var nglc_startRoutine = function (){
    nglc_reset();
    if (GLOBAL_DEBUG){
        lapseTime = 500
        velocity = 1;
        setTimeLineFile("data/nglc-demo/timeLine.csv")
        setNetworkFile("data/nglc-demo/nodes.json")
        loadFromUrl(networkUrl,timeLineUrl)
    }
}

var dateFormats = [
    {id: "year", value: "numeric"},
    {id: "month", value: "numeric"},
    {id: "day", value: "numeric"},
    {id: "hour", value: "2-digit"},
    {id: "minute", value: "2-digit"},
    {id: "second", value: "2-digit"}
]


var nglcResizeFunction = function (){
    $("#"+NGLC_GRAPH_CONTAINER).css('height',$(window).outerHeight() - $("#"+NGLC_GRAPH_CONTAINER).offset().top)
    resizingSlider();
    if (networkGraph !== undefined) {
        networkGraph.redraw();
    }
}

var nglcCleanFunction  = function (){
    $(window).unbind('resize',nglcResizeFunction)
}

var initLeftColumn = function () {
    var leftDiv = $("#"+LEFT_COLUMN_CONTENT);
    var main = $('<div/>',{
        class: "left-main"
    })
    leftDiv.append(main);
    var exportButton = $("<a/>", {
        class: "btn btn-default",
        text: "Export nodes"
    }).appendTo(main);
    var nodes = {}
//    exportButton[0].download = textContent
    exportButton.click(function (e) {
        console.log(networkGraph);
        var nodes = {}
        $.each(networkGraph.nodes,function (key,value){
            nodes[key] = {};
            nodes[key].x = value.x
            nodes[key].y = value.y
        })
        var string = csvData = 'data:application/json;charset=utf-8,' + JSON.stringify(nodes);
        $(this)
            .attr({
                'download': "nodes.json",
                'href': string,
                'target': '_blank'
            });
//        var url  = URL.createObjectURL(blob);
//        e.preventDefault();
//        window.location.href = url;
//        console.log(string);
    })


}

var nglc_reset = function () {
    nodes = [];
    edges = [];
    elements = {};
    start = 0;
    end = 0;
    current = 0;
}



var setNetworkFile = function (url){
    networkUrl = url;
}

var setTimeLineFile = function (url) {
    timeLineUrl = url;
}

var loadFromUrl = function (networkUrl,timeLineUrl){
    $.getJSON(networkUrl  , function (json) {
        d3.csv(timeLineUrl,function(csv){
            edges = csv;
            nodes = json;
            current = 1411468346896;
            loadGraph(nodes,edges,current,lapseTime)
        })

    })
}

var parseEdges = function(stringEdges){
    return d3.csv(stringEdges)
}

/* Devuelve la primera posicion de edge no cargada*/
/**
 * Carga los nodos y las aristas desde el principio. Devuelve el primero que no se pinta por si se quiere recalcular
 * el grafo desde ese punto sin tener que calcular todos los puntos de nuevo
 *
 * @param nodes
 * @param edges
 * @param time
 * @param lapseTime
 * @returns {number} La primera posición no cargada
 */
var loadGraph = function (nodes,edges,time,lapseTime,repaint) {
    if (repaint === undefined)
        repaint = true;
    var edgesToPaint = {}
    /*network representation*/
    $.each(nodes,function(key){
        var node = {
//            x: this.x,
//            y: this.y,
            id: key,
            label: key
        }
        this.node = node;
        this.elements = 0;
    })
    var pos = 0;
//    var edgeSplit = edgesSplit[pos++].split(",");
    start = edges[pos].time;
    var lastLoaded = undefined;
    // Estas aristas no son necesarias pero el track para el número de elementos si
    while (pos < edges.length && (time + lapseTime >= edges[pos].time)) {
        var edge = edges[pos];
        if (time >= edge.time) {
            if (nodes[edge.origin].elements) {
                nodes[edge.origin].elements--;
            }
            nodes[edge.destination].elements++;
            // If 0 is false

            elements[edge.id] = {};
            elements[edge.id].position = edge.destination;
        } else if (lastLoaded === undefined){
            lastLoaded = pos+1;
        }
//        pos++;
//    }
//    while (pos < edges.length && Math.abs(time - edges[pos].time) < lapseTime) {
//        var edge = edges[pos];
        var thisLapse = Math.abs(time - edge.time)
        if (thisLapse < lapseTime){//{ && thisLapse >= 0) {
            if (edgesToPaint[edge.origin + "-" + edge.destination] === undefined) {
                edgesToPaint[edge.origin + "-" + edge.destination] = {edge: edge, count: 1};
            } else {
                edgesToPaint[edge.origin + "-" + edge.destination].count++;

            }
        }
        pos++;

    }
    end= edges[edges.length-1].time;
    paintGraph(nodes,edgesToPaint)
    if (repaint)
        paintSlideBar(start,time,end)

    return pos;



}

var myf = function (inc){
    current = current + inc;
    loadGraph(nodes,edges,current,lapseTime)
}
var myf2 = function (pos){
    current = pos;
    loadGraph(nodes,edges,current,lapseTime)
}

var refreshGraph = function (nodes,edges,time,lapseTime){
    var edgesToPaint = {}
    /*network representation*/
    $.each(nodes,function(key){
        var node = {
//            x: this.x,
//            y: this.y,
            id: key,
            label: key
        }
        this.node = node;
        this.elements = 0;
    })
    var pos = 0;
//    var edgeSplit = edgesSplit[pos++].split(",");
    start = edges[pos].time;
    var lastLoaded = undefined;
    // Estas aristas no son necesarias pero el track para el número de elementos si
    while (pos < edges.length && (time + lapseTime >= edges[pos].time)) {
        var edge = edges[pos];
        if (time >= edge.time) {
            if (nodes[edge.origin].elements) {
                nodes[edge.origin].elements--;
            }
            nodes[edge.destination].elements++;
            // If 0 is false

            elements[edge.id] = {};
            elements[edge.id].position = edge.destination;
        } else if (lastLoaded === undefined){
            lastLoaded = pos+1;
        }
//        pos++;
//    }
//    while (pos < edges.length && Math.abs(time - edges[pos].time) < lapseTime) {
//        var edge = edges[pos];
        var thisLapse = Math.abs(time - edge.time)
        if (thisLapse < lapseTime){//{ && thisLapse >= 0) {
            if (edgesToPaint[edge.origin + "-" + edge.destination] === undefined) {
                edgesToPaint[edge.origin + "-" + edge.destination] = {edge: edge, count: 1};
            } else {
                edgesToPaint[edge.origin + "-" + edge.destination].count++;

            }
        }
        pos++;

    }
    end= edges[edges.length-1].time;
    paintGraph(nodes,edgesToPaint)
}

var paintSlideBar = function (start,current,end){
    var sliderPanel = $("#"+NGLC_SLIDER_PANEL);
    sliderPanel.empty();
    var internalDiv = $('<div/>',{
        class : "div-border",
        id: NGLC_SLIDER_SUBPANEL
    }).appendTo(sliderPanel)
    var startDate = new Date(parseInt(start));
    var currentDate = new Date(parseInt(current))
    var endDate = new Date(parseInt(end));
//    if (startDate == endDate){
//
//    }
    /*The format of the date*/
    var formatOptions = getFormatOptions(startDate,endDate,3);
    var myLocale = locale;




    var divStartDate = $('<div/>',{
        id: NGLC_DIV_START_DATE,
        text: new Intl.DateTimeFormat(myLocale, formatOptions).format(startDate)
    }).appendTo(internalDiv)
    var tooltip = undefined;
    var slider = jQuery('<div/>').slider({
        min: parseInt(start),
        max: parseInt(end),
        value: parseInt(current),
        slide : function (event,ui){
            current =parseInt(ui.value)
            loadGraph(nodes,edges,current ,lapseTime,false)

            var div = $(ui.handle).parent().children(".tooltip")[0];
            if (div !== undefined) {
                var pos = $.extend({}, $(ui.handle).offset(), { width: $(ui.handle).get(0).offsetWidth,
                    height: $(ui.handle).get(0).offsetHeight
                });
                var actualWidth = div.offsetWidth;
                var tp = {left: pos.left + pos.width / 2 - actualWidth / 2}
                $(div).offset(tp);
//
                var currentDate = new Date(parseInt(ui.value));
                $(div).find(".tooltip-inner").text(new Intl.DateTimeFormat(myLocale, formatOptions).format(currentDate))

            }

        },
        stop : function (event,ui){
            var div = $(ui.handle).parent().children(".tooltip")[0];
            current =parseInt(ui.value)
            loadGraph(nodes,edges,current ,lapseTime,false)

            var currentDate = new Date(current );
            destroyTooltip(slider.find(".ui-slider-handle"));
            createToolTip(slider.find(".ui-slider-handle"),new Intl.DateTimeFormat(myLocale, formatOptions).format(currentDate),'bottom')

        }
    });
    tooltip = createToolTip(slider.find(".ui-slider-handle"),new Intl.DateTimeFormat(myLocale, formatOptions).format(currentDate),'bottom')
    slider.appendTo(internalDiv);
    slider.attr('id',NGLC_INTERNAL_SLIDER);
    /* Creating the tooltip*/
    var divEndDate = $('<div/>',{
        id: NGLC_DIV_END_DATE,
        text: new Intl.DateTimeFormat(myLocale, formatOptions).format(endDate)
    }).appendTo(internalDiv)
    nglcResizeFunction();
}

var resizingSlider = function (){
    var width = $('#'+NGLC_SLIDER_PANEL).width() - $('#'+NGLC_DIV_START_DATE).outerWidth() - $('#'+NGLC_DIV_END_DATE).outerWidth() -100 // Margin
//    var width = 0;
    $('#'+NGLC_INTERNAL_SLIDER).width(width);
}
var getFormatOptions = function (start,end,precision){
    /*More efficiency*/
    var formatOptions = {}
    var start;
    var end;
    if (start.getFullYear() != end.getFullYear()){
        start = 0;
        end = start + precision
    } else if (start.getMonth() != end.getMonth()){
        start = 1;
        end = start + precision
    } else if (start.getDay() != end.getDay()){
        start = 2;
        end = start + precision
    } else if (start.getHours() != end.getHours()){
        start = 3;
        end = start + precision
    } else if (start.getMinutes() != end.getMinutes()){
        start = 4;
        end = start + precision
    } else {
        start = 5;
        end = start + precision
    }
    while (dateFormats[end-1] === undefined){
        start--;
        end--;
    }
    /*Undefined*/
    if (!(start >= 0)) {
        start = 0;
    }
    for (var i = 0; i < start; i++){
        formatOptions[dateFormats[i].id] = undefined;
    }
    for (i = start; i < end; i++){
        formatOptions[dateFormats[i].id] = dateFormats[i].value;
    }
    for (i = end; i < dateFormats.length; i++){
        formatOptions[dateFormats[i].id] = undefined;
    }
    return formatOptions;
}
var getStringDate = function (date,range){

}

var paintGraph = function (nodes,edges){


    /* Set up the edges for vis library*/
    var paintEdges = $.map (edges, function (value){
        var edge = {}
        edge.from = value.edge.origin
        edge.to = value.edge.destination;
        edge.label = value.count;
        edge.style = "arrow"
        return [edge]
    })

    /* Set up the nodes for vis library*/
    var paintNodes = $.map(nodes,function (value,key){
        var node = {}
        node.id = key;
        node.label = key+": " +value.elements;
        node.x = value.x;
        node.y = value.y;
        node.allowedToMoveX = true
        node.allowedToMoveY = true
        return node;
    })

    var data = {
        nodes: paintNodes,
        edges: paintEdges
    }
    dataPainted = data;
    var container = document.getElementById(NGLC_GRAPH_CONTAINER);
    networkGraph = new vis.Network(container,data,getOptions());
}

var getOptions = function() {

    var options = {
        physics: {
//            barnesHut: {
//                gravitationalConstant: 0,
//                centralGravity: 0,
//                springLength: 0,
//                springConstant: 0,
//                damping: 0}
            barnesHut: {gravitationalConstant: 0, centralGravity: 0, springConstant: 0}
        },
        smoothCurves : {
            dynamic : false,
            type : "diagonalCross",
            roundness : 0.2
        },
        stabilize: true

    };
    if (GLOBAL_DEBUG){
//        options.configurePhysics = true
    }
    return options
}

