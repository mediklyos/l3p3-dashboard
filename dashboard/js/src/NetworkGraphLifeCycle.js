/**
 * Created by paco on 22/09/14.
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

/* Constants */
var PRE = views[0][2].constantsPrefix;

/*HTML id constants*/

var NGLC_TEXT_EXPORT_BUTTON = "Export nodes";
var NGLC_TEXT_LOAD_NODES = "Load Nodes";
var NGLC_TEXT_LOAD_TIMELINE = "Load Timeline";
var NGLC_GRAPH_CONTAINER = PRE + "-graph";
var NGLC_SLIDER_PANEL = PRE +"-temporal-bar";
var NGLC_GRAPH_PANEL = PRE + "-graph-panel";
var NGLC_SLIDER_SUBPANEL = PRE + "-slider-subpanel";
var NGLC_INTERNAL_SLIDER = PRE + "-internal-slider";
var NGLC_DIV_START_DATE = PRE + "-start-date";
var NGLC_DIV_END_DATE = PRE + "-end-date";
var NGLC_ID_FILE_INPUT_NODES = PRE + "-input-nodes";
var NGLC_ID_TIME_SLIDER = PRE + "-time-slider";
var NGLC_FILTER_PANEL = PRE + "-filter-panel";
var NGLC_FILTER_COLUMNS_BUTTONS_PREFIX_ID = PRE + "-buttons-columns-filter-";
var NGLC_FILTER_COLUMNS_BUTTONS_CLASS = PRE + "-buttons-columns-class";
var NGLC_FOOTER_ID = PRE + "-footer-id";
var NGLC_FOOTER_NODE_TABLE = PRE + "-footer-node-table";
var NGLC_LEFT_MAIN= PRE + "-left-main";
var NGLC_FILTER_BOX= PRE + "-filter-box";
var NGLC_FILTER_PANEL_BY_ATTR_BOX = PRE + "-filter-panel-by-attr-box";
var NGLC_START_TIME_RADIO_BUTTONS_BOX = PRE + "-start-time-radio-button-box";
var NGLC_FILTER_PANEL_BY_ATTR = PRE + "-filter-panel-by-attr";
var NGLC_FILTER_COLUMNS_PANELS_PREFIX_ID = PRE + "-panel-filter-";
var NGLC_FILTER_COLUMNS_PANEL_CLASS = PRE + "-panel-filter-class";
var NGLC_TIMELINEPROGRESSBAR = PRE + "-timelineprogressbar";
var NGLC_PROGRESSBAR_ID = PRE + "-progress-bar-id-";
/*Textos localizacion*/
var NGLC_FILTERS_COLS_INFO= "Columns ";
var NGLC_FILTERS_INPUTS_INFO = "Filters";
var NGLC_STARTING_TIME_INFO = "Start position";
var NGLC_STARTING_TIME_RADIOBUTTON_START_TEXT = "First RFC";
var NGLC_STARTING_TIME_RADIOBUTTON_END_TEXT = "Last RFC";

/*Configurable constants*/
var NGLC_ORIGIN_COLUMN_NAME = "origin";
var NGLC_DESTINATION_COLUMN_NAME = "destination";
var NGLC_TIME_COLUMN_NAME = "time";
var NGLC_MEANTIME_COLUMN_NAME = "meantime";
var NGLC_ID_COLUMN_NAME = "id";
var NGLC_PRIORITY_COLUMN_NAME = "priority";
var NGLC_ZONE_COLUMN_NAME = "bank";
var NGLC_CAUSE_COLUMN_NAME = "type";

var NGLC_START_NODE_NAME = "Start";

var NGLC_FILTER_PREFIX = "filter-";

var NGLC_STATS_GLOBAL_COLUMN_NAME = "global";
var NGLC_BUTTON_APPLY_FILTERS_VALUE = "Apply filters";

/*View attributes*/
var nodes;
var stats;
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
var columnsIgnored = {time:true,origin:true,destination:true};
var extraColumnsActive = {};
var selectedNodes = {};
var timerFirst = 1000;
var timerRest = 200;
var currentEdgePosition = 0;

/*Footer table titles*/
var NGLC_FILTER_TABLE_COLUMN_NAME = "Filter";
var NGLC_DURATION_MEAN_TABLE_COLUMN_NAME = "Duration #";
var NGLC_ARRIVAL_TIME_TABLE_COLUMN_NAME = "Arrival Time";
var NGLC_TOTAL_DURATION_TIME_TABLE_COLUMN_NAME = "Total duration";


var NGLC_STARTPOSITIONCOOKIE_FIRST = "firstrfc";
var NGLC_STARTPOSITIONCOOKIE_LAST = "lastrfc";
var NGLC_STARTPOSITIONCOOKIE_TEXT = "startposition";
var cookiestartposition = "";

/* Control variable that is used to know when all the items are closed */
var reachedEnd = false;
/*
itemsFiltered is an object of arrays that contains the items which have been filtered by the user.
 */
var itemsFiltered = {};
$.each(extraColumnsShown, function(index, value) {
    itemsFiltered[NGLC_FILTER_PREFIX+value] = []
});

var filterDropdown = [NGLC_PRIORITY_COLUMN_NAME, NGLC_CAUSE_COLUMN_NAME];
var dropdownSelectFilter = {};
$.each(filterDropdown, function(index, value) {
    dropdownSelectFilter[NGLC_FILTER_PREFIX+value] = []
});

var appliedDropdownList = false;
/*
    Custom styles. There's no need to modify the jQuery CSS file, so I create it here.
 */
var arrayOfProgressBarColors = ["#5CB85C", "#16A085", "#2ECC71", "#27AE60", "#3498DB", "#2980B9", "#9B59B6", "#8E44AD", "#F1C40F", "#F39C12", "#E67E22", "#D35400", "#E74C3C", "#C0392B", "#7F8C8D"];
var progressBarColors = {};

$.each(filterDropdown, function(index, value) {
    dropdownSelectFilter[NGLC_FILTER_PREFIX+value] = []
});

var addCSStoHTML = function(css) {
    var styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
}

addCSStoHTML('.ui-widget-header {border: 1px solid #aaaaaa;background: #97C2FC; color: #222222} .customli { margin-left: 10px;}');
addCSStoHTML('.timeTable {width: 350px;position: fixed;top: 180px;right: 50px;}#rfcTimeTable td {border: 0px solid white;}');
addCSStoHTML('.squared {border: 2x solid red;}');

var nglc_startRoutine = function () {
    nglc_reset();
    lapseTime = 4000000;
    velocity = 4000000;
    if (GLOBAL_DEBUG){
//        setTimeLineFile("data/nglc-demo/rfc-data_2.csv")
//        setTimeLineFile("data/nglc-demo/rfc-data.csv")
//        setNetworkFile("data/nglc-demo/nodes.json")
//        setNetworkFile("data/nglc-demo/nodes2.json")
//        setNetworkFile("data/nglc-demo/nodes4.json")
        setNetworkFile("data/nglc-demo/nodesexp.json");
        setTimeLineFile("data/nglc-demo/outputvisual.csv");
        loadStatsFromFile("data/nglc-demo/stats.json");
        loadFromUrl(networkUrl,timeLineUrl)
    }
};

var resetEdges = function () {
    $("#"+NGLC_INTERNAL_SLIDER).slider("option","value",$("#"+NGLC_INTERNAL_SLIDER).slider("option","min"))
};

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

};

var dateFormats = [
    {id: "year", value: "numeric"},
    {id: "month", value: "numeric"},
    {id: "day", value: "numeric"},
    {id: "hour", value: "2-digit"},
    {id: "minute", value: "2-digit"},
    {id: "second", value: "2-digit"}
];

var nglcResizeFunction = function (){
    $("#"+NGLC_GRAPH_CONTAINER).css('height',$("#content").outerHeight() + $("#content").offset().top - $("#"+NGLC_GRAPH_CONTAINER).offset().top)
    resizingSlider();
    if (networkGraph !== undefined) {
        networkGraph.redraw();
    }
};

var nglcCleanFunction  = function (){
    $(window).unbind('resize', nglcResizeFunction)
};

var loadNodesClick = function() {
    $("#"+NGLC_ID_FILE_INPUT_NODES).click();
    $("#"+NGLC_ID_FILE_INPUT_NODES).fileupload({
        add: function (event,data){
            var file = data.files[0];
            loadNodesFromFile(file);
        }
    })
};

var exportButtonClick  = function () {
    var nodes = {};
    $.each(networkGraph.nodes,function (key,value){
        nodes[key] = {};
        nodes[key].x = value.x
        nodes[key].y = value.y
    });
    var string = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nodes));
    $(this)
        .attr({
            'download': "nodes.json",
            'href': string,
            'target': '_blank'
        });
};

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
    var nodes = {};

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
    }));

};

var resetFilterPanel = function (){
    var main = $("#"+NGLC_LEFT_MAIN);
    $("#"+NGLC_FILTER_BOX).remove();
    var filterPanel = jQuery('<div />',{class:'nglc-box-margins',id: NGLC_FILTER_BOX}).appendTo(main);
    filterPanel.append($('<div/>',{
        class: "hr"
    }));
    filterPanel.append($('<div/>', {
        class: 'nglc-box-margins-vertical',
        text: NGLC_FILTERS_COLS_INFO
    }));
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

    /*
    Radio buttons to select the starting time (first or last RFC).
     */
    var startTimeRadioButtons = jQuery('<div />',{class:'nglc-box-margins',id: NGLC_START_TIME_RADIO_BUTTONS_BOX}).appendTo(main);
    startTimeRadioButtons.append($('<div/>',{
        class: "hr"
    }));
    startTimeRadioButtons.append($('<div/>', {
        class: 'nglc-box-margins-vertical',
        text: NGLC_STARTING_TIME_INFO
    }));
    var divStartTimeRadioButtons = $('<div />', {
        class: "nglc-box-margins-vertical btn-group"
    });
    var formRadioButtons = $('<form />');
    var radioButtonFirst = $('<input />', {
        class: "btn btn-default nglc-buttons-columns-class",
        type: "radio"
    });
    $('<label/>', {
        style: "display:block"
    }).html(NGLC_STARTING_TIME_RADIOBUTTON_START_TEXT+"   ").append(radioButtonFirst).appendTo(formRadioButtons);

    var radioButtonLast = $('<input />', {
        class: "btn btn-default nglc-buttons-columns-class",
        type: "radio"
    });
    $('<label/>', {
        style: "display:block"
    }).html(NGLC_STARTING_TIME_RADIOBUTTON_END_TEXT+"   ").append(radioButtonLast).appendTo(formRadioButtons);
    divStartTimeRadioButtons.append(formRadioButtons);
    startTimeRadioButtons.append(divStartTimeRadioButtons);

    /*
     Apply filters button
      */
    var filterPanelsByAttributeValue = jQuery('<div />',{class:'nglc-box-margins',id: NGLC_FILTER_PANEL_BY_ATTR_BOX}).appendTo(main);
    filterPanelsByAttributeValue.append($('<div/>',{
        class: "hr"
    }));
    filterPanelsByAttributeValue.append($('<div/>', {
        class: 'nglc-box-margins-vertical',
        text: NGLC_FILTERS_INPUTS_INFO
    }));
    var divApplyFilterButton = $('<div />', {
        class: "nglc-box-margins-vertical btn-group"
    });
    $('<input />', {
        class: "btn btn-default nglc-buttons-columns-class",
        value: NGLC_BUTTON_APPLY_FILTERS_VALUE,
        type: "button"
    }).click(function(){
        nglc_startRoutine();
    }).appendTo(divApplyFilterButton);
    filterPanelsByAttributeValue.append(divApplyFilterButton);


    // Creating collapsible panels
    var myPanels = createSetFilterPanelsByAttributeValue(NGLC_FILTER_PANEL_BY_ATTR, filterPanelsByAttributeValue, extraColumnsShown, NGLC_FILTER_COLUMNS_PANELS_PREFIX_ID, NGLC_FILTER_COLUMNS_PANEL_CLASS, function(result) {
        if (result.active){
            extraColumnsActive[result.key] = true;
        } else {
            delete extraColumnsActive[result.key]
        }
        paintFooter(selectedNodes, extraColumnsActive);
    });
    myPanels.addClass("nglc-box-margins-vertical");
};

/*
    METHODS FOR COOKIES (NEED TO CREATE ANOTHER FILE FOR THIS)
 */

function setCookie(cookiename, cookievalue, expirationdays) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cookiename + "=" + cookievalue + "; " + expires;
}

function getCookie(cookiename) {
    var name = cookiename + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookieStartPositionRadioButtons (cookiename) {
    var position = getCookie(cookiename);
    if (position == "" || position == NGLC_STARTPOSITIONCOOKIE_FIRST) {
        return NGLC_STARTPOSITIONCOOKIE_FIRST;
    } else {
        return NGLC_STARTPOSITIONCOOKIE_LAST;
    }
}

/*
    END OF METHODS FOR COOKIES
 */

var nglc_reset = function () {
    nodes = [];
    stats = [];
    edges = [];
    elements = {};
    start = 0;
    end = 0;
    current = 0;
    currentEdgePosition = 0;
    resetEdges();
    lastLoaded = 0;
    lastTime = 0;
    $("#"+NGLC_FOOTER_ID).empty();
    $("#"+NGLC_GRAPH_CONTAINER).empty();
    $("#"+NGLC_SLIDER_PANEL).empty();
    selectedNodes = {};
    resetProgressBar(1, "up");
    updateTableTimesProgressBar(0);
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
            paintGraphOnlyNodes(nodes);
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

/**
 * This method loads the stats of each node from JSON and parses it to an object.
 * @param file
 */
var loadStatsFromFile = function (file) {
    $.getJSON(file  , function (json) {
        stats = json;
        createArrayToDropdownSelectFilters();
        if(!appliedDropdownList) {
            applyDropdownSelectFilters();
        }
    })

};

/**
 * Create <li /> for the dropdown menu in filters.
 */
var applyDropdownSelectFilters = function () {
    var lista;
    $.each(filterDropdown, function(index, value) {
        var currValue = value;
        lista = $("#lista-"+NGLC_FILTER_PREFIX + value);
        $.each(dropdownSelectFilter[NGLC_FILTER_PREFIX + value], function (index, val) {
            $('<li />', {
                class: 'customli'
            }).append(
                $('<label />').append(
                    $('<input />', {
                        type: 'checkbox',
                        value: val,
                        checked: checkLiActiveByDefault()
                    }).click(function () {
                        handleClickToFilter(this, currValue);
                    })
                ).append(
                    $('<label />', {class: 'customli', text: val})
                )).appendTo(lista);
        })
    });
    appliedDropdownList = true;
}
var createArrayToDropdownSelectFilters = function () {
    var currValue;
    $.each(filterDropdown, function(index, value) {
        currValue = value;
        $.each(stats[value], function(name, val) {
            dropdownSelectFilter[NGLC_FILTER_PREFIX+currValue].push(name);
        })
    })
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
        //console.log("EJECUTO HACIA ATRAS")
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

    if(pos < edges.length && (edges[pos][NGLC_TIME_COLUMN_NAME] <= time + lapseTime)) {
        while (pos < edges.length && (edges[pos][NGLC_TIME_COLUMN_NAME] <= time + lapseTime)){
            console.log("ENTRA PARA PINTAR")
            // Cojo la línea actual del csv
            if(itemsFiltered[NGLC_FILTER_PREFIX+NGLC_ID_COLUMN_NAME].length == 1) {
                var newPos = 0;
                while (newPos < pos) {
                    // Cojo la línea actual del csv
                    var edge = edges[newPos];
                    if (edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]] === undefined) {
                        edge["color"] = "red";
                        edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]] = {edge: edge, count: 1};
                    } else {
                        edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]].edge["color"] = "blue";
                        edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]].count++;
                    }
                    newPos++;
                }
            }
            var edge = edges[pos];
            edge["color"] = "black";
            if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined)) {
                if (edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]] === undefined) {
                    // Si la línea de origen-destino no existe, la creo.
                    edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]] = {edge: edge, count: 1};
                } else {
                    // Si ya existe, le añado una unidad.
                    edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]].edge["color"] = "blue";
                    edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]].count++;
                }
            }
            pos++;
        }
        reachedEnd = false;
        console.log("REACHED END: "+reachedEnd)
    } else {
        if(itemsFiltered[NGLC_FILTER_PREFIX+NGLC_ID_COLUMN_NAME].length == 1) {
            var newPos = 0;
            while (newPos < pos) {
                // Cojo la línea actual del csv
                var edge = edges[newPos];
                if (edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]] === undefined) {
                    edge["color"] = "red";
                    edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]] = {edge: edge, count: 1};
                } else {
                    edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]].edge["color"] = "blue";
                    edgesToPaint[edge[NGLC_ORIGIN_COLUMN_NAME] + "-" + edge[NGLC_DESTINATION_COLUMN_NAME]].count++;
                }
                newPos++;
            }
            reachedEnd = true;
            console.log("REACHED END: "+reachedEnd)
        }
    }


    paintGraphUpdateEdges(nodes,edgesToPaint)
    paintFooter(selectedNodes, extraColumnsActive);
    if (repaint) {
        end = +edges[edges.length - 1][NGLC_TIME_COLUMN_NAME] + (lapseTime / 2)
        paintSlideBar(start, time, end)
    }
    //pos--;
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
            divFooter.append("<h5><strong>Node:</strong> "+node.id+"  -  <strong>Duration (mean)</strong>: "+msToTime(stats[NGLC_STATS_GLOBAL_COLUMN_NAME][node.id])+"</h5>")
            $.each(activeColumns,function(key2){

                var colDiv = $('<div/>',{
                    class: columnClass
                })
                var innerColDiv = $('<div/>',{
                    class: NGLC_FOOTER_NODE_TABLE
                }).appendTo(colDiv);
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
    var columnToFilterCheckbox = columnName;
    // Añado columnas en todos para Stats excepto para el ID.
    if(columnName == NGLC_ID_COLUMN_NAME) {
        table.append('<thead><tr><td>'+columnName+'</td><td>'+NGLC_FILTER_TABLE_COLUMN_NAME+'</td><td>'+NGLC_ARRIVAL_TIME_TABLE_COLUMN_NAME+'</td><td>'+NGLC_DURATION_MEAN_TABLE_COLUMN_NAME+'</td><td>#</td></tr></thead>')
        table.append('<tbody></tbody>');
        $.each(node.extraCols[columnName],function (key,value){
            table.append("<tr><td>"+key+"</td><td><label><input type='checkbox' value = '"+key+"' onclick=\"handleClickToFilter(this, '"+columnToFilterCheckbox+"');\" "+checkActiveByDefault(key, columnToFilterCheckbox.toString())+"></label></td><td>"+formatTimeMillisToDate(calculateMean(value, 'time'))+"</td><td>"+msToTime(calculateMean(value, NGLC_MEANTIME_COLUMN_NAME))+"</td><td>"+value.length+"</td></tr>");
        })
    } else {
        table.append('<thead><tr><td>'+columnName+'</td><td>'+NGLC_FILTER_TABLE_COLUMN_NAME+'</td><td>'+NGLC_ARRIVAL_TIME_TABLE_COLUMN_NAME+'</td><td>'+NGLC_DURATION_MEAN_TABLE_COLUMN_NAME+'</td><td>#</td><td>'+NGLC_TOTAL_DURATION_TIME_TABLE_COLUMN_NAME+'</td></tr></thead>')
        table.append('<tbody></tbody>');
        $.each(node.extraCols[columnName],function (key,value){
            table.append("<tr><td>"+key+"</td><td><label><input type='checkbox' value = '"+key+"' onclick=\"handleClickToFilter(this, '"+columnToFilterCheckbox+"');\" "+checkActiveByDefault(key, columnToFilterCheckbox.toString())+"></label></td><td>"+formatTimeMillisToDate(calculateMean(value, 'time'))+"</td><td>"+msToTime(calculateMean(value, NGLC_MEANTIME_COLUMN_NAME))+"</td><td>"+value.length+"</td><td>"+msToTime(stats[columnToFilterCheckbox][key][node.id])+"</td></tr>");
        })
    }
    return table;
}

/**
 * This method handles the checkbox of every item in order to add or remove it from the filter.
 * @param cb
 * @param filter
 */
var handleClickToFilter = function (cb, filter) {
    if(cb.checked) {
        updateFilterContent(cb.value, NGLC_FILTER_PREFIX+filter)
    } else {
        deleteItem(cb.value, NGLC_FILTER_PREFIX+filter);
    }

}

var checkLiActiveByDefault = function (item, filter) {
    if($.inArray(item, itemsFiltered[NGLC_FILTER_PREFIX+filter])<0) {
        return false;
    } else {
        return true;
    }
}


/**
 * This method actives a checkbox if its value is filtered.
 * @param cb
 * @param filter
 * @returns {string}
 */
var checkActiveByDefault = function (item, filter) {
    if($.inArray(item, itemsFiltered[NGLC_FILTER_PREFIX+filter])<0) {
        return "";
    } else {
        return "checked";
    }
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
var slider;
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
    console.log(start)
    console.log(end)
    var tooltip = undefined;
    slider = jQuery('<div/>').slider({
        range: "min",
        min: parseInt(edges[0][NGLC_TIME_COLUMN_NAME]),
        max: parseInt(edges[edges.length-1][NGLC_TIME_COLUMN_NAME]),
        //step: (parseInt(end)-parseInt(start))/edges.length,
        value: parseInt(current),
        slide : function (event,ui){
            current = parseInt(ui.value)
            currentEdgePosition = updateGraph(edges,current,lapseTime,false)
            var div = $(ui.handle).parent().children(".tooltip")[0];
            if (div !== undefined) {
                var pos = $.extend({}, $(ui.handle).offset(), { width: $(ui.handle).get(0).offsetWidth,
                    height: $(ui.handle).get(0).offsetHeight
                });
                var actualWidth = div.offsetWidth;
                var tp = {left: pos.left + pos.width / 2 - actualWidth / 2}
                $(div).offset(tp);
                var currentDate = new Date(parseInt(ui.value));
                $(div).find(".tooltip-inner").text(new Intl.DateTimeFormat(myLocale, formatOptions).format(currentDate))
            }

        },
        stop : function (event,ui){
            var div = $(ui.handle).parent().children(".tooltip")[0];
            current =parseInt(ui.value);
            currentEdgePosition = updateGraph(edges,current ,lapseTime,false)

            var currentDate = new Date(current );
            destroyTooltip(slider.find(".ui-slider-handle"));
            createToolTip(slider.find(".ui-slider-handle"),new Intl.DateTimeFormat(myLocale, formatOptions).format(currentDate),'bottom')

        }
    }).css("background","#e0e0e0");
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
            id: key,
            label: key
        };
        this.node = node;
        this.elements = 0;
    });

    var paintNodes = $.map(nodes,function (value,key){
        var node = {};
        node.id = key;
        node.label = key+": " +value.elements;
        node.x = value.x;
        node.y = value.y;
        node.allowedToMoveX = true;
        node.allowedToMoveY = true;
        node.elements = value.elements;
        return node;
    });

    var data = {
        nodes: paintNodes
    };
    dataPainted = data;
    var container = document.getElementById(NGLC_GRAPH_CONTAINER);
    resetEdges();
    networkGraph = new vis.Network(container,data,getOptions());
//    nodesExtraInfo = {}
    var i = 0;
    var customCSS = "";
    $.each(networkGraph.nodes, function(index, value) {
        //console.log(index);
        progressBarColors[index] = arrayOfProgressBarColors[i++];
        customCSS += ".progress-bar-"+index.toLowerCase().replace(/ /g,'')+" {background-color: "+progressBarColors[index]+"}\n";
        /*$('<div />', {
            id: NGLC_PROGRESSBAR_ID + index.toLowerCase().replace(/ /g,''),
            class: "progress-bar progress-bar-" + index.toLowerCase().replace(/ /g,'')
        }).appendTo('#'+NGLC_TIMELINEPROGRESSBAR);*/
    });
    addCSStoHTML(customCSS);

    $.each(networkGraph.nodes,function (key,value) {
        var node = {};
        node.node = value;
        node.elements = 0;
        node.id = key;
//        nodesExtraInfo[key].node = node;
        value.elements = 0;
        value.progressbarcolor = progressBarColors[key];
    });
    resetShowedElements();
    networkGraph.on('select',function (properties){
        selectedNodes = {};
        $.each (properties.nodes, function (){
            selectedNodes[this] = networkGraph.nodes[this];
            //console.log(this)
        });
        paintFooter(selectedNodes, extraColumnsActive);
        //console.debug(properties.nodes)
    });
};

var paintGraphUpdateEdges = function (nodes,edges){
    /* Set up the edges for vis library*/
    var paintEdges = $.map (edges, function (value){
        var edge = {};
        edge.from = value.edge[NGLC_ORIGIN_COLUMN_NAME]
        edge.to = value.edge[NGLC_DESTINATION_COLUMN_NAME];
        edge.label = value.count;
        edge.style = "arrow";
        edge.color = value.edge["color"];
        return [edge]
    });

    $.map(nodes,function (value,key){
        value.label = key+": " +value.elements;
        return value;
    });
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
};

var getOptions = function() {

    var options = {
        physics: {
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
};

/*DEBUG*/
var upStart = function (event){
    event.target.isStoped = false;
    up();
    setTimeout(upStartTimer.bind(event.target),timerFirst);
};

var upStartTimer = function (){
    if (!this.isStoped){
        up();
        setTimeout(upStartTimer.bind(this),timerRest);
    }
};

var upStop = function (event) {
    event.target.isStoped = true;
};

/*DEBUG*/
var botStart = function (event){
    event.target.isStoped = false;
    bot();
    setTimeout(botStartTimer.bind(event.target),timerFirst);
};

var botStartTimer = function (){
    if (!this.isStoped){
        bot();
        setTimeout(botStartTimer.bind(this),timerRest);
    }
};

var botStop = function (event) {
    event.target.isStoped = true;
};

var getNextTime = function(currentPos, myEdges, currTime) {
    if(currentPos<=0) {
        return +(myEdges[0][NGLC_TIME_COLUMN_NAME]) - currTime;
    } else if(currentPos >= myEdges.length) {
        return lapseTime;
    } else {
        return +(myEdges[currentPos][NGLC_TIME_COLUMN_NAME]) - currTime;
    }
};

var getPreviousTime = function(currentPos, myEdges) {
    if(currentPos <= 0) {
        return lapseTime;
    } else {
        return +(myEdges[currentPos-1][NGLC_TIME_COLUMN_NAME]);
    }
};

/**
 * Pressed button to go forward.
 */
var up = function () {
    var nextTime = getNextTime(currentEdgePosition, edges, current);
    var i = 0;
    while (+(current) + nextTime <= +(current)) {
        nextTime = getNextTime(currentEdgePosition++, edges, current);
        i++;
    }
    $("#nglc-internal-slider").slider('value', current);
    current = +(current) + nextTime;
    var lapse = getNextTime(currentEdgePosition + 1, edges, current);
    if(itemsFiltered[NGLC_FILTER_PREFIX+NGLC_ID_COLUMN_NAME].length == 1) {
        updateProgressBar(currentEdgePosition, "up");
    }
    currentEdgePosition = updateGraph(edges, current - 1, lapse, false);
};

var arrayDurationData;
/**
 * This method repaints the progress bar depending on the position and direction.
 * @param currpos
 * @param direction
 */
var updateProgressBar = function (currpos, direction) {
    var localpos = currpos;
    var start = edges[0][NGLC_TIME_COLUMN_NAME];
    var end = edges[edges.length-1][NGLC_TIME_COLUMN_NAME];
    var total = +(end)-+(start);
    arrayDurationData = {};
    if(direction == "up") {
        for (var i = 0; i < localpos; i++) {
            if(arrayDurationData[edges[i][NGLC_DESTINATION_COLUMN_NAME]] === undefined) {
                arrayDurationData[edges[i][NGLC_DESTINATION_COLUMN_NAME]] = edges[i][NGLC_MEANTIME_COLUMN_NAME];
            } else {
                arrayDurationData[edges[i][NGLC_DESTINATION_COLUMN_NAME]] = +(arrayDurationData[edges[i][NGLC_DESTINATION_COLUMN_NAME]]) + +(edges[i][NGLC_MEANTIME_COLUMN_NAME]);
            }
            var progressbar = $('#'+NGLC_PROGRESSBAR_ID+edges[i][NGLC_DESTINATION_COLUMN_NAME].toLowerCase().replace(/ /g,''));
            if(progressbar.length == 0) {
                progressbar = $('<div />', {
                    id: NGLC_PROGRESSBAR_ID + edges[i][NGLC_DESTINATION_COLUMN_NAME].toLowerCase().replace(/ /g,''),
                    class: "progress-bar progress-bar-" + edges[i][NGLC_DESTINATION_COLUMN_NAME].toLowerCase().replace(/ /g,'')
                }).appendTo('#'+NGLC_TIMELINEPROGRESSBAR);
            }
            var percentage = +(arrayDurationData[edges[i][NGLC_DESTINATION_COLUMN_NAME]])*100 /+(total);
            progressbar.css('width', percentage+'%');
            updateTableTimesProgressBar(localpos);
        }
    } else if(direction == "bot") {
        resetProgressBar();
        updateProgressBar(localpos-2, "up");
        updateTableTimesProgressBar(localpos-2);
    }
    
};

/**
 * This method resets the progress bar to its original state. Used when the timeline is going backwards.
 */
var resetProgressBar = function () {
    if(networkGraph != undefined) {
        $.each(networkGraph.nodes, function(name, value) {
            var progressbar = $('#'+NGLC_PROGRESSBAR_ID+name.toLowerCase().replace(/ /g,''));
            progressbar.css('width', '0%');
        });
    }
};

var updateTableTimesProgressBar = function (currpos) {
    var localpos = currpos;
    var mytable = $('#rfcTimeTable');
    $('#rfcTimeTable > tbody').remove();
    //mytable.remove();
    for (var i = 0; i < localpos; i++) {
        var row = $('<tr />');
        row.append("<td><span style='font-size:12px; padding-left:15px;' class='progress-bar-"+edges[i][NGLC_DESTINATION_COLUMN_NAME].toLowerCase().replace(/ /g,'')+"'>&nbsp;</span></td>");
        $('<td />', {
            style: "width: 180px; font-weight: bold; font-size: 12px;",
            text: edges[i][NGLC_DESTINATION_COLUMN_NAME]
        }).appendTo(row);
        $('<td />', {
            style: "font-size: 12px;",
            text: msToTime(arrayDurationData[edges[i][NGLC_DESTINATION_COLUMN_NAME]])
        }).appendTo(row);
        row.appendTo(mytable);
    }
}

/**
 * Pressed button to go backwards.
 */
var bot = function () {
    if(itemsFiltered[NGLC_FILTER_PREFIX+NGLC_ID_COLUMN_NAME].length == 1) {
        updateProgressBar(currentEdgePosition, "bot");
    }
    if(reachedEnd) {
        current = edges[edges.length - 2][NGLC_TIME_COLUMN_NAME];
        reachedEnd = false;
        $("#nglc-internal-slider").slider('value', current);
        currentEdgePosition = updateGraph(edges,current, edges[edges.length - 2][NGLC_MEANTIME_COLUMN_NAME], false);
        up();
    } else {
        currentEdgePosition-=2;
        while(getPreviousTime(currentEdgePosition, edges) > current) {
            currentEdgePosition--;
        }
        current = getPreviousTime(currentEdgePosition, edges);
        $("#nglc-internal-slider").slider('value', current);
        currentEdgePosition = updateGraph(edges,current, getNextTime(currentEdgePosition, edges, current), false);
    }

};

var re = function () {
    current = +1388655879000-lapseTime/2;
    currentEdgePosition = updateGraph(edges,current,lapseTime,false);
};