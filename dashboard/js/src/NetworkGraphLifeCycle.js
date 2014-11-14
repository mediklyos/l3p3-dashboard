/**
 * Created by paco on 22/09/14.
 */


/* Constants */
var PRE = views[0][2].constantsPrefix;

/*HTML id constants*/

var NGLC_TEXT_EXPORT_BUTTON = "Export nodes";
var NGLC_TEXT_LOAD_NODES = "Load Nodes"
var NGLC_TEXT_LOAD_TIMELINE = "Load Timeline"
var NGLC_GRAPH_CONTAINER = PRE + "-graph"
var NGLC_SLIDER_PANEL = PRE +"-temporal-bar"
var NGLC_GRAPH_PANEL = PRE + "-graph-panel"
var NGLC_SLIDER_SUBPANEL = PRE + "-slider-subpanel"
var NGLC_INTERNAL_SLIDER = PRE + "-internal-slider"
var NGLC_DIV_START_DATE = PRE + "-start-date"
var NGLC_DIV_END_DATE = PRE + "-end-date"
var NGLC_ID_FILE_INPUT_NODES = PRE + "-input-nodes";
var NGLC_ID_TIME_SLIDER = PRE + "-time-slider";
var NGLC_FILTER_PANEL = PRE + "-filter-panel";
var NGLC_FILTER_COLUMNS_BUTTONS_PREFIX_ID = PRE + "-buttons-columns-filter-"
var NGLC_FILTER_COLUMNS_BUTTONS_CLASS = PRE + "-buttons-columns-class"
var NGLC_FOOTER_ID = PRE + "-footer-id"
var NGLC_FOOTER_NODE_TABLE = PRE + "-footer-node-table"
var NGLC_LEFT_MAIN= PRE + "-left-main"
var NGLC_FILTER_BOX= PRE + "-filter-box"
var NGLC_FILTER_PANEL_BY_ATTR_BOX = PRE + "-filter-panel-by-attr-box";
var NGLC_FILTER_PANEL_BY_ATTR = PRE + "-filter-panel-by-attr";
var NGLC_FILTER_COLUMNS_PANELS_PREFIX_ID = PRE + "-panel-filter-"
var NGLC_FILTER_COLUMNS_PANEL_CLASS = PRE + "-panel-filter-class"
/*Textos localizacion*/
var NGLC_FILTERS_COLS_INFO= "Columns ";
var NGLC_FILTERS_INPUTS_INFO = "Filters";

/*Configurable constants*/
var NGLC_ORIGIN_COLUMN_NAME = "origin";
var NGLC_DESTINATION_COLUMN_NAME = "destination";
var NGLC_TIME_COLUMN_NAME = "time"
var NGLC_MEANTIME_COLUMN_NAME = "meantime";
var NGLC_ID_COLUMN_NAME = "id"
var NGLC_PRIORITY_COLUMN_NAME = "priority"
var NGLC_ZONE_COLUMN_NAME = "zone"
var NGLC_CAUSE_COLUMN_NAME = "cause"

var NGLC_START_NODE_NAME = "Start"

var NGLC_FILTER_PREFIX = "filter-";

var NGLC_BUTTON_APPLY_FILTERS_VALUE = "Apply filters";

/*View attributes*/
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
var displayTimePrecision = 5;
var lastLoaded = 0;
var lastTime = 0;
var extraColumnsShown = [NGLC_ID_COLUMN_NAME, NGLC_PRIORITY_COLUMN_NAME, NGLC_ZONE_COLUMN_NAME, NGLC_CAUSE_COLUMN_NAME];
var columnsIgnored = {time:true,origin:true,destination:true}
var extraColumnsActive = {};
var selectedNodes = {};
var timerFirst = 1000;
var timerRest = 200;
var currentEdgePosition = 0;
var itemsFiltered = {};
$.each(extraColumnsShown, function(index, value) {
    itemsFiltered[NGLC_FILTER_PREFIX+value] = []
})
//itemsFiltered[NGLC_FILTER_PREFIX+"id"].push("RFC000001034345")

var nglc_startRoutine = function (){
    nglc_reset();
    lapseTime = 4000000;
    velocity = 4000000;
    if (GLOBAL_DEBUG){
//        setTimeLineFile("data/nglc-demo/rfc-data_2.csv")
//        setTimeLineFile("data/nglc-demo/rfc-data.csv")
//        setNetworkFile("data/nglc-demo/nodes.json")
//        setNetworkFile("data/nglc-demo/nodes2.json")
//        setNetworkFile("data/nglc-demo/nodes4.json")
        setNetworkFile("data/nglc-demo/nodesexp.json")
        setTimeLineFile("data/nglc-demo/outputvisual.csv")
        loadFromUrl(networkUrl,timeLineUrl)
    }
}
var resetEdges = function () {
    $("#"+NGLC_INTERNAL_SLIDER).slider("option","value",$("#"+NGLC_INTERNAL_SLIDER).slider("option","min"))
}

// Es aquí donde se crean las extraCols
var resetShowedElements = function () {
    $.map(networkGraph.nodes,function (value,key){
        value.elements = 0;
        value.extraCols = {};
//        nodesExtraInfo[key].elements =
        $.each(extraColumnsShown,function (key2,value2) {
            value.extraCols[value2] = {};
        })
    })

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
    $("#"+NGLC_GRAPH_CONTAINER).css('height',$("#content").outerHeight() + $("#content").offset().top - $("#"+NGLC_GRAPH_CONTAINER).offset().top)
    resizingSlider();
    if (networkGraph !== undefined) {
        networkGraph.redraw();
    }
}

var nglcCleanFunction  = function (){
    $(window).unbind('resize', nglcResizeFunction)
}
var loadNodesClick = function() {
    $("#"+NGLC_ID_FILE_INPUT_NODES).click();
    $("#"+NGLC_ID_FILE_INPUT_NODES).fileupload({
        add: function (event,data){
            var file = data.files[0];
            loadNodesFromFile(file);
        }
    })
}

var exportButtonClick  = function () {
    var nodes = {}
    $.each(networkGraph.nodes,function (key,value){
        nodes[key] = {};
        nodes[key].x = value.x
        nodes[key].y = value.y
    })
    var string = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nodes));
    $(this)
        .attr({
            'download': "nodes.json",
            'href': string,
            'target': '_blank'
        });
}

var loadTimeLineClick = function () {
    $("#"+NGLC_ID_FILE_INPUT_NODES).click();
    $("#"+NGLC_ID_FILE_INPUT_NODES).fileupload({
        add: function (event,data){
            var file = data.files[0];
            loadTimeLineFromFile(file);

        }
    })

}

var initLeftColumnAndFooter = function () {
    var leftDiv = $("#"+LEFT_COLUMN_CONTENT);
    var main = $('<div/>',{
        class: LEFT_MAIN_CLASS,
        id : NGLC_LEFT_MAIN
    })
    var buttonsBox = $('<div/>',{class: "nglc-box-margins"}).appendTo(main)
    leftDiv.append(main);

    var loadNodesInput = $("<input/>", {
        id: NGLC_ID_FILE_INPUT_NODES,
        type: "file",
        name: "nodeFile",
        style: "display: none;"
    }).appendTo(buttonsBox);
    /*var loadNodes =*/
    $("<a/>", {
        class: "btn btn-default nglc-box-margins",
        text: NGLC_TEXT_LOAD_NODES
    }).appendTo(buttonsBox).click(loadNodesClick);
    /*var loadTimeLine= */
    $("<a/>", {
        class: "btn btn-default nglc-box-margins",
        text: NGLC_TEXT_LOAD_TIMELINE
    }).appendTo(buttonsBox).click(loadTimeLineClick);
    /*var exportButton = */
    $("<a/>", {
        class: "btn btn-default nglc-box-margins",
        text: NGLC_TEXT_EXPORT_BUTTON
    }).appendTo(buttonsBox).click(exportButtonClick)
    ;
    var nodes = {}

//    createPanelButtons("Columns",NGLC_FILTER_PANEL,main,extraColumnsShown,"",PRE,function(){})
    // IN a new div because I want to be in a new line



    /*Filter panel*/
    resetFilterPanel()
//    var filterPanel = jQuery('<div />',{class:'nglc-box-margins'}).appendTo(main);
//    filterPanel.append($('<div/>',{
//        class: "hr"
//    }))//.css("border-top-width","3px"))
//    filterPanel.append($('<div/>', {
//        class: 'nglc-box-margins-vertical',
//        text: NGLC_FILTERS_COLS_INFO
//    }))
////    filterPanel.append($('<div/>',{
////        class: "hr"
////    }))
//    var panel = createSetButtons(NGLC_FILTER_PANEL, filterPanel,extraColumnsShown,NGLC_FILTER_COLUMNS_BUTTONS_PREFIX_ID,NGLC_FILTER_COLUMNS_BUTTONS_CLASS,function(result){
//        if (result.active){
//            extraColumnsActive[result.key] = true;
//        } else {
//            delete extraColumnsActive[result.key]
//        }
//        paintFooter(selectedNodes, extraColumnsActive);
//
//    })
//    panel.addClass("nglc-box-margins-vertical");


    /*Footer Init*/

    $("#"+FOOTER_CONTENT_ID).append($('<div/>',{
        id: NGLC_FOOTER_ID
    }))

}

var resetFilterPanel = function (){
    var main = $("#"+NGLC_LEFT_MAIN);
    $("#"+NGLC_FILTER_BOX).remove();
    var filterPanel = jQuery('<div />',{class:'nglc-box-margins',id: NGLC_FILTER_BOX}).appendTo(main);
    filterPanel.append($('<div/>',{
        class: "hr"
    }))//.css("border-top-width","3px"))
    filterPanel.append($('<div/>', {
        class: 'nglc-box-margins-vertical',
        text: NGLC_FILTERS_COLS_INFO
    }))
//    filterPanel.append($('<div/>',{
//        class: "hr"
//    }))

    ////////////

    var panel = createSetButtons(NGLC_FILTER_PANEL, filterPanel,extraColumnsShown,NGLC_FILTER_COLUMNS_BUTTONS_PREFIX_ID,NGLC_FILTER_COLUMNS_BUTTONS_CLASS, function(result) {
        if (result.active){
            extraColumnsActive[result.key] = true;
        } else {
            delete extraColumnsActive[result.key]
        }
        paintFooter(selectedNodes, extraColumnsActive);
    })
    panel.addClass("nglc-box-margins-vertical");

    var filterPanelsByAttributeValue = jQuery('<div />',{class:'nglc-box-margins',id: NGLC_FILTER_PANEL_BY_ATTR_BOX}).appendTo(main);
    filterPanelsByAttributeValue.append($('<div/>',{
        class: "hr"
    }))
    filterPanelsByAttributeValue.append($('<div/>', {
        class: 'nglc-box-margins-vertical',
        text: NGLC_FILTERS_INPUTS_INFO
    }))
    var divApplyFilterButton = $('<div />', {
        class: "nglc-box-margins-vertical btn-group"
    })
    $('<input />', {
        class: "btn btn-default nglc-buttons-columns-class",
        value: NGLC_BUTTON_APPLY_FILTERS_VALUE,
        type: "button"
    }).click(function(){
        nglc_startRoutine();
    }).appendTo(divApplyFilterButton)
    filterPanelsByAttributeValue.append(divApplyFilterButton)

    var myPanels = createSetFilterPanelsByAttributeValue(NGLC_FILTER_PANEL_BY_ATTR, filterPanelsByAttributeValue, extraColumnsShown, NGLC_FILTER_COLUMNS_PANELS_PREFIX_ID, NGLC_FILTER_COLUMNS_PANEL_CLASS, function(result) {
        if (result.active){
            extraColumnsActive[result.key] = true;
        } else {
            delete extraColumnsActive[result.key]
        }
        paintFooter(selectedNodes, extraColumnsActive);
    })
    myPanels.addClass("nglc-box-margins-vertical");
}
/*
 <div class="panel panel-default">
 <div class="panel-heading">Filter by ID</div>
 <div class="panel-body">
 <div class="row">
 <div class="col-lg-12">
 <form method="POST" action="">
 <div class="form-group">

 <input name="hastags" class="form-control">

 </div>

 <button type="submit" class="btn btn-default">Update</button>
 <button type="reset" class="btn btn-default">Reset</button>
 </form>
 </div>
 </div>
 <div class="row">
 <!-- /.col-lg-6 (nested) -->
 <div class="col-lg-12">
 <div class="btn-group" id="button107" style="margin: 5px"><a class="btn btn-success disabled" href="#"><i class="icon-user icon-white"></i>RFC01234</a><a class="btn btn-success dropdown-toggle" data-toggle="dropdown" href="#" style="padding-bottom: 14;padding-top: 14"><span class="caret"></span></a><ul class="dropdown-menu"><li><a onclick="deleteHastag(107);" href="#"><i class="icon-trash"></i> Delete</a></li> </ul> </div><div class="btn-group" id="button117" style="margin: 5px"><a class="btn btn-success disabled" href="#"><i class="icon-user icon-white"></i>RFC789456</a><a class="btn btn-success dropdown-toggle" data-toggle="dropdown" href="#" style="padding-bottom: 14;padding-top: 14"><span class="caret"></span></a><ul class="dropdown-menu"><li><a onclick="deleteHastag(117);" href="#"><i class="icon-trash"></i> Delete</a></li> </ul> </div>

 </div>
 <!-- /.col-lg-6 (nested) -->


 </div>
 <!-- /.row (nested) -->
 </div>
 <!-- /.panel-body -->
 </div>
 */


var nglc_reset = function () {
    nodes = [];
    edges = [];
    elements = {};
    start = 0;
    end = 0;
    current = 0;
    resetEdges();
    lastLoaded = 0;
    lastTime = 0;
    $("#"+NGLC_FOOTER_ID).empty();
    $("#"+NGLC_GRAPH_CONTAINER).empty();
    $("#"+NGLC_SLIDER_PANEL).empty();
    selectedNodes = {};
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
            if(!filterIsEmpty()) {
                edges = removeUselessEdges(edges);
            }
            current = + edges[0][NGLC_TIME_COLUMN_NAME]/*- (lapseTime / 2)*/;
            paintGraphOnlyNodes(nodes)
            currentEdgePosition = updateGraph(edges,current -1, getNextTime(currentEdgePosition+1, edges, current), true)
        })

    })
}

/**
 * This method removes the edges that are filtered (the ones that the user doesn't want to check).
 * @param myEdges
 * @returns {*}
 */
var removeUselessEdges = function (myEdges) {
    for(var i = 0; i < myEdges.length; i++) {
        if(isFiltered(myEdges[i])) {
            myEdges.splice(i, 1);
            i--;
        }
    }
    return myEdges;
}

var loadNodesFromFile = function (file){
    var reader = new FileReader();
    reader.onload = function(event) {
        nglc_reset();

        nodes = $.parseJSON(event.target.result);
        extraColumnsShown = [];

        paintGraphOnlyNodes(nodes)

    }
    reader.readAsText(file);

}

var loadTimeLineFromFile = function (file) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var parsed = d3.csv.parse(event.target.result)
        edges = parsed;
        current = + edges[0][NGLC_TIME_COLUMN_NAME] - (lapseTime / 2);
        if (nodes !== undefined) {
            extraColumnsShown = [];
            $.each (edges[0], function (key){
                if (!columnsIgnored[key])
                    extraColumnsShown.add(key);
            })
            resetFilterPanel();

            paintGraphOnlyNodes(nodes)
            currentEdgePosition = updateGraph(edges, current, lapseTime, true)
        }
    }
    reader.readAsText(file);
}

var parseEdges = function(stringEdges){
    return d3.csv(stringEdges)
}

/**
 * Check if an edge has been filtered by user.
 * @param someEdge
 * @returns {boolean}
 */
var isFiltered = function (someEdge) {
    var isFiltered = true;
    var filterByCol = [];
    $.each(extraColumnsShown, function () {
        if (itemsFiltered[NGLC_FILTER_PREFIX + this].length > 0) {
            var found = $.inArray(someEdge[this], itemsFiltered[NGLC_FILTER_PREFIX + this]);
            if (found >= 0) {
                filterByCol.push(true)
            } else {
                filterByCol.push(false)
            }
        } else {
            filterByCol.push(true)
        }
    })
    for (var i = 0; i < filterByCol.length; i++) {
        isFiltered = isFiltered && filterByCol[i];
    }
    return !isFiltered;
}

var filterIsEmpty = function() {
    var isEmpty = true;
    $.each(extraColumnsShown, function () {
        if(itemsFiltered[NGLC_FILTER_PREFIX + this].length >0) {
            isEmpty = false;
            return 0;
        }
    })
    return isEmpty;
}

/**
 * Carga los nodos y las aristas desde el principio. Devuelve el primero que no se pinta por si se quiere recalcular
 * el grafo desde ese punto sin tener que calcular todos los puntos de nuevo. Esta es la función clave del proceso y
 * la que más recursos consume
 *
 * @param edges
 * @param time
 * @param lapseTime
 * @param repaint
 * @returns {number} La primera posición no cargada
 */
var updateGraph = function (edges,time,lapseTime,repaint) {
    if (repaint === undefined)
        repaint = true;
    var edgesToPaint = {}
    var nodes = networkGraph.nodes;
    //    var otherLastLoaded =lastLoaded;
    // La posición actual. Si no está definida, será 0.
    var pos = lastLoaded || 0;

//    var edgeSplit = edgesSplit[pos++].split(",");
    start = +edges[0][NGLC_TIME_COLUMN_NAME] - (lapseTime/2);
    // Estas aristas no son necesarias pero el track para el número de elementos si

    /*Tiempo hacia atras*/
    if (lastTime > time){
        console.log("EJECUTO HACIA ATRAS")
        // -- porque la posición donde apunta es el siguiente que hay que mirar en caso de ir a delante
        pos--;
        while (pos >= 0 && (edges[pos][NGLC_TIME_COLUMN_NAME] > time )) {
            // Creo una variable edge en la que guardo la línea actual del csv.
            var edge = edges[pos];
                /*Nodes update*/
                if ((nodes[edge[NGLC_ORIGIN_COLUMN_NAME]] !== undefined)) {
                    nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].elements++;
                }
                if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined) && nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].elements) {
                    nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].elements--;
                }
                /*Columns updating*/
                $.each(extraColumnsShown, function () {
                    if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined) && nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]] !== undefined) {
                        if (nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]].length == 1) {
                            delete nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]];
                        } else {
                            findAndDelete(nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]], edge['id'], "backwards")
                        }
                    }
                    if ((nodes[edge[NGLC_ORIGIN_COLUMN_NAME]] !== undefined)) {
                        var newPos = findPreviousEdge(edge, pos)
                        if (newPos > 0) {
                            if (nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]] === undefined) {
                                nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]] = [];
                                var objeto = {};
                                objeto[NGLC_ID_COLUMN_NAME] = edges[newPos][NGLC_ID_COLUMN_NAME];
                                objeto[NGLC_TIME_COLUMN_NAME] = edges[newPos][NGLC_TIME_COLUMN_NAME];
                                objeto[NGLC_MEANTIME_COLUMN_NAME] = edges[newPos][NGLC_MEANTIME_COLUMN_NAME];
                                nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]].push(objeto)
                            } else {
                                var objeto = {};
                                objeto[NGLC_ID_COLUMN_NAME] = edges[newPos][NGLC_ID_COLUMN_NAME];
                                objeto[NGLC_TIME_COLUMN_NAME] = edges[newPos][NGLC_TIME_COLUMN_NAME];
                                objeto[NGLC_MEANTIME_COLUMN_NAME] = edges[newPos][NGLC_MEANTIME_COLUMN_NAME];
                                nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]].push(objeto);
                            }
                        }
                    }
                })
            pos--;
        }
        pos++;
        lastLoaded = pos;
        lastTime = time;
    } else if (edges[pos][NGLC_TIME_COLUMN_NAME] <= time) {
        while (pos < edges.length && (edges[pos][NGLC_TIME_COLUMN_NAME] <= time )) {
            var edge = edges[pos];
            /*Nodes update*/
                // Si el nodo actual es uno de los que puedo usar (por ejemplo no puedo usar Start) y tiene > 0 elementos, resto un elemento
                if ((nodes[edge[NGLC_ORIGIN_COLUMN_NAME]] !== undefined) && nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].elements) {
                    nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].elements--;
                }
                // Si el nodo destino está definido, sumo un elemento
                if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined)){
                    nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].elements++;
                }
                $.each(extraColumnsShown,function(){
                    if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined)) {
                        if (nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]] === undefined) {
                            nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]] = [];
                            var objeto = {};
                            objeto[NGLC_ID_COLUMN_NAME] = edge[NGLC_ID_COLUMN_NAME];
                            objeto[NGLC_TIME_COLUMN_NAME] = edge[NGLC_TIME_COLUMN_NAME];
                            objeto[NGLC_MEANTIME_COLUMN_NAME] = edge[NGLC_MEANTIME_COLUMN_NAME];
                                nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]].push(objeto);

                        } else {
                            var objeto = {};
                            objeto[NGLC_ID_COLUMN_NAME] = edge[NGLC_ID_COLUMN_NAME];
                            objeto[NGLC_TIME_COLUMN_NAME] = edge[NGLC_TIME_COLUMN_NAME];
                            objeto[NGLC_MEANTIME_COLUMN_NAME] = edge[NGLC_MEANTIME_COLUMN_NAME];
                                nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]].push(objeto);
                            }
                        }

                    if ((nodes[edge[NGLC_ORIGIN_COLUMN_NAME]] !== undefined) && nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]] !== undefined){
                        if (nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]].length == 1){
                            delete nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]];
                        } else {
                                findAndDelete(nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]], parseInt(edge[NGLC_TIME_COLUMN_NAME]), "forward")
                            }
                        }

                })
                pos++;
        }
        lastLoaded = pos;
        lastTime = time;
    }
    /*Edges de delta positivo se calcula aqui*/
    // Dibujo la líneas entre nodos.
    while (pos < edges.length && (edges[pos][NGLC_TIME_COLUMN_NAME] <= time + lapseTime)){
        // Cojo la línea actual del csv
        var edge = edges[pos];
            if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined)) {
                if (edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]] === undefined) {
                    // Si la línea de origen-destino no existe, la creo.
                    edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]] = {edge: edge, count: 1};
                } else {
                    // Si ya existe, le añado una unidad.
                    edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]].count++;
                }
            }
        pos++;
    }
    paintGraphUpdateEdges(nodes,edgesToPaint)
    paintFooter(selectedNodes, extraColumnsActive);
    if (repaint) {
        end = +edges[edges.length - 1][NGLC_TIME_COLUMN_NAME] + (lapseTime / 2)
        paintSlideBar(start, time, end)
    }
    console.log("Current pos: "+pos)
    return pos;
}

var searchForLastEdgeTimeByFilter = function (myEdges) {
    var lastPos = 0;
    for(var i = 0; i < myEdges.length; i++) {
        if(!isFiltered(myEdges[i])) {
            lastPos = i;
        }
    }
    return myEdges[lastPos][NGLC_TIME_COLUMN_NAME]/* + (lapseTime / 2)*/;
}

var findPreviousEdge = function (edge, pos) {
    var myPos = pos-1;
    while(myPos > 0) {
        if((edges[myPos][NGLC_ID_COLUMN_NAME] == edge[NGLC_ID_COLUMN_NAME]) && (edges[myPos][NGLC_ORIGIN_COLUMN_NAME] != NGLC_START_NODE_NAME)) {
            return myPos;
        }
        myPos--;
    }
    return -1;
}

/**
 * Le paso un array (A) y el tiempo que tiene que sumar time+meantime de (B) para identificarlo.
 * @param myArrayOrigin
 * @param time
 */
var findAndDelete = function(myArrayOrigin, time, direction) {
    var timeSum = 0;
    if (direction == "forward") {
        $.each(myArrayOrigin, function(key, value) {
            timeSum = parseInt(value['time']) + parseInt(value[NGLC_MEANTIME_COLUMN_NAME]);
            if(timeSum == time) {
                myArrayOrigin.splice(key, 1);
                // Break
                return false;
            }
        })
    } else if(direction == "backwards") {
        $.each(myArrayOrigin, function(key, value) {
            timeSum = value['id'];
            if(timeSum == time) {
                myArrayOrigin.splice(key, 1);
                return false;
            }
        })
    }
}

var paintFooter = function (nodes,activeColumns){
    var columnsToShow = Object.getOwnPropertyNames(activeColumns);
    var divFooter = $("#"+NGLC_FOOTER_ID);
    divFooter.empty();
    // TODO Alert this to the user
    if (columnsToShow.length > 4) {
        return;
    }else {
        var columnClass = "col-lg-"+(parseInt(12 / columnsToShow.length))
        var first = true;
        $.each(nodes,function(){
            var node = this;
            if (first) {
                first = false;
            } else {
                divFooter.append('<div class="hr"/>')
            }
            divFooter.append('<h5>Node: '+node.id+'</h5>')
            $.each(activeColumns,function(key2){

                var colDiv = $('<div/>',{
                    class: columnClass
                })
                var innerColDiv = $('<div/>',{
                    class: NGLC_FOOTER_NODE_TABLE
                }).appendTo(colDiv);
                // Poner titulo
                innerColDiv.append(bootstapTableFooter(extraColumnsShown[key2],node));
                divFooter.append(colDiv);
            })
        })
//        divFooter.text(columnsToShow.length)
    }
}


/**
 * Show tables.
 * @param columnName
 * @param node
 * @returns {*|jQuery|HTMLElement}
 */
var bootstapTableFooter = function (columnName, node){
    var table = $('<table/>',{
        class: "table table-condensed"
    })
    // header
    table.append('<thead><tr><td>'+columnName+'</td><td>Arrival Time</td><td>Duration (mean)</td><td>#</td></tr></thead>')
    table.append('<tbody></tbody>');
    $.each(node.extraCols[columnName],function (key,value){
        table.append("<tr><td>"+key+"</td><td>"+formatTimeMillisToDate(calculateMean(value, 'time'))+"</td><td>"+msToTime(calculateMean(value, NGLC_MEANTIME_COLUMN_NAME))+"</td><td>"+value.length+"</td></tr>");
    })
    return table;
}

/**
 * Milliseconds to DD:MM:YYYY hh:mm:ss
 * @param millis
 * @returns {string}
 */
var formatTimeMillisToDate = function(millis) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(millis);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/') + " "+ [pad(d.getHours()), pad(d.getMinutes()), d.getSeconds()].join(':');
}

/**
 * Milliseconds to hh:mm:ss
 * @param duration
 * @returns {string}
 */
function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24),
        days = duration / 8.64e7 | 0;

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return days+" days, "+hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
/**
 * This method calculates the mean value of a certain attribute of an array.
 * @param myArray
 * @param attr
 * @returns {number}
 */
var calculateMean = function(myArray, attr) {
    var mean = 0;
    var count = 0;
    $.each(myArray, function(key, value) {
        mean += parseInt(value[attr]);
        count++;
    });
    return Math.round(mean/count);
}

var paintSlideBar = function (start,currentTime,end){
    var sliderPanel = $("#"+NGLC_SLIDER_PANEL);
    sliderPanel.empty();
    var internalDiv = $('<div/>',{
        class : "div-border",
        id: NGLC_SLIDER_SUBPANEL
    }).appendTo(sliderPanel)
    var startDate = new Date(parseInt(start));
    var currentDate = new Date(parseInt(currentTime))
    var endDate = new Date(parseInt(end));

    var formatOptions = getFormatOptions(startDate,endDate,displayTimePrecision);
    var myLocale = dashboard_locale;



    internalDiv.append($('<div id="nglc-prev-step-img" class="nglc-box-margins-horizontal"/>').mousedown(botStart).mouseup(botStop))
    internalDiv.append($('<div id="nglc-next-step-img" class="nglc-box-margins-horizontal"/>').mousedown(upStart).mouseup(upStop))
    var divStartDate = $('<div/>',{
        id: NGLC_DIV_START_DATE,
        text: new Intl.DateTimeFormat(myLocale, formatOptions).format(startDate)
    }).appendTo(internalDiv)
    var tooltip = undefined;
    var slider = jQuery('<div/>').slider({
        min: parseInt(start),
        max: parseInt(end),
        step: velocity,
        value: parseInt(currentTime),
        slide : function (event,ui){
            current =parseInt(ui.value)
            currentEdgePosition = updateGraph(edges,current,lapseTime,false)
            console.log("EJECUTO SLIDER")
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
            currentEdgePosition = updateGraph(edges,current ,lapseTime,false)

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
    if ($('#'+NGLC_SLIDER_SUBPANEL).length){
        var restWith = 100;
        $.each($('#'+NGLC_SLIDER_SUBPANEL).children(),function (){
            if (this.id != NGLC_INTERNAL_SLIDER){
                restWith += $(this).outerWidth();
            }
        })
//        var width = $('#'+NGLC_SLIDER_PANEL).width() - $('#'+NGLC_DIV_START_DATE).outerWidth() - $('#'+NGLC_DIV_END_DATE).outerWidth() -100 // Margin
//        width = $('#'+NGLC_SLIDER_PANEL).width() - $('#'+NGLC_DIV_START_DATE).position().left - $('#'+NGLC_DIV_START_DATE).outerWidth() - $('#'+NGLC_DIV_END_DATE).outerWidth() -100 // Margin
        $('#'+NGLC_INTERNAL_SLIDER).width($('#'+NGLC_SLIDER_PANEL).outerWidth() - restWith);
    }
//    var width = 0;
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

// Dibujar los nodos en función de nodes.json
var paintGraphOnlyNodes = function (nodes) {
    lastLoaded = 0;
    $.each(nodes,function(key){
        var node = {
//            x: this.x,
//            y: this.y,
            id: key,
            label: key
        }
        this.node = node;
        this.elements = 0;
    });
    var paintNodes = $.map(nodes,function (value,key){
        var node = {}
        node.id = key;
        node.label = key+": " +value.elements;
        node.x = value.x;
        node.y = value.y;
        node.allowedToMoveX = true
        node.allowedToMoveY = true
        node.elements = value.elements;
        return node;
    })

    var data = {
        nodes: paintNodes
    }
    dataPainted = data;
    var container = document.getElementById(NGLC_GRAPH_CONTAINER);
    resetEdges();
    networkGraph = new vis.Network(container,data,getOptions());
//    nodesExtraInfo = {}
    $.each(networkGraph.nodes,function (key,value){
        var node = {}
        node.node = value;
        node.elements = 0;
        node.id = key;
//        nodesExtraInfo[key].node = node;
        value.elements = 0;
    })
    resetShowedElements();
    networkGraph.on('select',function (properties){
        selectedNodes = {};
        $.each (properties.nodes, function (){
            selectedNodes[this] = networkGraph.nodes[this];
        })
        paintFooter(selectedNodes, extraColumnsActive);
        //console.debug(properties.nodes)
    })
    return;

}

var paintGraphUpdateEdges = function (nodes,edges){


    /* Set up the edges for vis library*/
    var paintEdges = $.map (edges, function (value){
        var edge = {}
        edge.from = value.edge[NGLC_ORIGIN_COLUMN_NAME]
        edge.to = value.edge[NGLC_DESTINATION_COLUMN_NAME];
        edge.label = value.count;
        edge.style = "arrow"
        return [edge]
    })

    $.map(nodes,function (value,key){
        value.label = key+": " +value.elements;
        return value;
    })
    /* Set up the nodes for vis library*/
    /*This code is not needed because this function only update the edges
    var paintNodes = $.map(nodes,function (value,key){
        var node = {}
        node.id = key;
        node.label = key+": " +value.elements;
        node.x = value.x;
        node.y = value.y;
        node.allowedToMoveX = true
        node.allowedToMoveY = true
        return node;map
    })

*/
    networkGraph.edgesData.clear();
    networkGraph.edgesData.add(paintEdges);

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

/*DEBUG*/
var upStart = function (event){
    event.target.isStoped = false;
    up();
    setTimeout(upStartTimer.bind(event.target),timerFirst);
}
var upStartTimer = function (){
    if (!this.isStoped){
        up()
        setTimeout(upStartTimer.bind(this),timerRest);
    }
}
var upStop = function (event) {
    event.target.isStoped = true;
}



/*DEBUG*/
var botStart = function (event){
    event.target.isStoped = false;
    bot();
    setTimeout(botStartTimer.bind(event.target),timerFirst);
}
var botStartTimer = function (){
    if (!this.isStoped){
        bot()
        setTimeout(botStartTimer.bind(this),timerRest);
    }
}
var botStop = function (event) {
    event.target.isStoped = true;
}

var getNextTime = function(currentPos, myEdges, currTime) {
    if(currentPos<=0) {
        return +(myEdges[0][NGLC_TIME_COLUMN_NAME]) - currTime;
    } else if(currentPos >= myEdges.length) {
        return lapseTime;
    } else {
        //console.log(myEdges[currentPos][NGLC_TIME_COLUMN_NAME]);
        return +(myEdges[currentPos][NGLC_TIME_COLUMN_NAME]) - currTime;
    }
}

var getPreviousTime = function(currentPos, myEdges) {
    if(currentPos <= 0) {
        return lapseTime;
    } else {
        return +(myEdges[currentPos-1][NGLC_TIME_COLUMN_NAME]);
    }
}

var up = function () {
    var nextTime = getNextTime(currentEdgePosition, edges, current)
    current = +(current) + nextTime;
    var lapse = getNextTime(currentEdgePosition+1, edges, current);
    currentEdgePosition = updateGraph(edges,current -1, lapse, false);
}
var bot = function () {
    currentEdgePosition-=2;
    current = getPreviousTime(currentEdgePosition, edges);
    currentEdgePosition = updateGraph(edges,current, getNextTime(currentEdgePosition, edges, current), false);
}

var re = function () {
    current = +1388655879000-lapseTime/2;
    currentEdgePosition = updateGraph(edges,current,lapseTime,false)
}