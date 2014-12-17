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
var resetEdges = function () {
    $("#"+NGLC_INTERNAL_SLIDER).slider("option","value",$("#"+NGLC_INTERNAL_SLIDER).slider("option","min"))

}

// Es aquí donde se crean las extraCols
var resetShowedElements = function () {
    $.map(networkGraph.nodes,function (value,key){
        value.elements = 0;
        value.extraCols = {}
//        nodesExtraInfo[key].elements =
        // Mario - Puede que esto vaya fuera
        $.each(extraColumnsShown,function (key2,value2) {
            value.extraCols[value2] = {};
        })
        // Mario - Puede que esto se cambie por el each anterior
        ////////value.extraCols["zone"] = {};
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
    var panel = createSetButtons(NGLC_FILTER_PANEL, filterPanel,extraColumnsShown,NGLC_FILTER_COLUMNS_BUTTONS_PREFIX_ID,NGLC_FILTER_COLUMNS_BUTTONS_CLASS,function(result){
        if (result.active){
            extraColumnsActive[result.key] = true;
        } else {
            delete extraColumnsActive[result.key]
        }
        paintFooter(selectedNodes, extraColumnsActive);

    })
    panel.addClass("nglc-box-margins-vertical");
}

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
            current = + edges[0][NGLC_TIME_COLUMN_NAME] - (lapseTime / 2);
            paintGraphOnlyNodes(nodes)
            updateGraph(edges,current,lapseTime,true)
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
            updateGraph(edges, current, lapseTime, true)
        }
    }
    reader.readAsText(file);
}

var parseEdges = function(stringEdges){
    return d3.csv(stringEdges)
}

/* Devuelve la primera posicion de edge no cargada*/


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
    var nodesDebug = true;
    var nodes = networkGraph.nodes;
    //    var otherLastLoaded =lastLoaded;
    // La posición actual. Si no está definida, será 0.
    var pos = lastLoaded || 0;

//    var edgeSplit = edgesSplit[pos++].split(",");
    start = +edges[0][NGLC_TIME_COLUMN_NAME] - (lapseTime/2);
    // Estas aristas no son necesarias pero el track para el número de elementos si

    /*Tiempo hacia atras*/
    if (lastTime > time){
        //console.log(pos);
        // -- porque la posición donde apunta es el siguiente que hay que mirar en caso de ir a delante
        pos--;
        while (pos >= 0 && (edges[pos][NGLC_TIME_COLUMN_NAME] > time )) {
            // Creo una variable edge en la que guardo la línea actual del csv.
            var edge = edges[pos];
            /*Nodes update*/
            if ((nodes[edge[NGLC_ORIGIN_COLUMN_NAME]] !== undefined)) {
                nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].elements++;
            }
            if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined) && nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].elements){
                nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].elements--;
            }

            /*Columns updating*/
            $.each(extraColumnsShown,function(){
                if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined) && nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]] !== undefined){
                    if (nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]].length == 1){
                        delete nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]];
                    } else {
                        if(!nodesDebug) {
                            nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]]--;
                        } else {
                            // Aquí tendría que eliminar el primer nodo, en lugar de restar un número
                            //nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]]--;
                            findAndDeleteBackwards(nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]], edge['time'], edge['meantime'], "backwards")
                        }
                    }
                }
                if ((nodes[edge[NGLC_ORIGIN_COLUMN_NAME]] !== undefined)) {
                    if (nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]] === undefined) {
                        if(!nodesDebug) {
                            nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]] = 1;
                        } else {
                            nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]] = [];
                            nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]].push(new Object({
                                "id": edge["id"],
                                "time": edge["time"],
                                "meantime": edge["meantime"]}))
                        }
                    } else {
                        if(!nodesDebug) {
                            nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]]++
                        } else {
                            nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]].push(new Object({
                                "id": edge["id"],
                                "time": edge["time"],
                                "meantime": edge["meantime"]}))
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
            //console.log(pos);
            //////////////// Esta parte no se toca porque el número de elementos no influye en la estructura buscada - Edit
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

            /////////////// Hasta aquí no se toca - Edit
            $.each(extraColumnsShown,function(){
                if ((nodes[edge[NGLC_DESTINATION_COLUMN_NAME]] !== undefined)) {
                    if (nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]] === undefined) {
                        if(!nodesDebug) {
                            nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]] = 1;
                        } else {
                            nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]] = [];
                            nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]].push(new Object({
                                "id": edge["id"],
                                "time": edge["time"],
                                "meantime": edge["meantime"]
                            }));
                        }
                    } else {
                        if(!nodesDebug) {
                            nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]]++;
                        } else {
                            nodes[edge[NGLC_DESTINATION_COLUMN_NAME]].extraCols[this][edge[this]].push(new Object({
                                "id": edge["id"],
                                "time": edge["time"],
                                "meantime": edge["meantime"]
                            }));
                        }
                    }
                }
                if ((nodes[edge[NGLC_ORIGIN_COLUMN_NAME]] !== undefined) && nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]] !== undefined){
                    if (nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]].length == 1){
                        delete nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]];
                    } else {
                        if(!nodesDebug) {
                            nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]]--;
                        } else {
                            // Aquí tendría que eliminar el nodo que haya salido del anterior
                            //console.log(nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]])
                            findAndDelete(nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]], parseInt(edge["time"]), "forward")
                            //nodes[edge[NGLC_ORIGIN_COLUMN_NAME]].extraCols[this][edge[this]]--;
                        }
                    }
                }
            })
            pos++;
            /*El delta negativo se tiene que calcular dentro de este while*/
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
        end = +edges[edges.length - 1][NGLC_TIME_COLUMN_NAME] + (lapseTime / 2);
        paintSlideBar(start, time, end)
    }
    console.log(pos)
    return pos;
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
            timeSum = parseInt(value['time']) + parseInt(value['meantime']);
            if(timeSum == time) {
                myArrayOrigin.splice(key, 1);
                // Break
                return false;
            }
        })
    } else if(direction == "backwards") {
        $.each(myArrayOrigin, function(key, value) {
            timeSum = parseInt(value['time']) + parseInt(value['meantime']);
            if(timeSum == time) {
                myArrayOrigin.splice(key, 1);
                // Break
                return false;
            }
        })
    }
}

var findAndDeleteBackwards = function(myArrayOrigin, time, meantime, direction) {
    var timeSum = 0;
    var found = false;
    if (direction == "forward") {
        $.each(myArrayOrigin, function(key, value) {
            timeSum = parseInt(value['time']) + parseInt(value['meantime']);
            if(timeSum == time) {
                myArrayOrigin.splice(key, 1);
                // Break
                return false;
            }
        })
    } else if(direction == "backwards") {
        $.each(myArrayOrigin, function(key, value) {
            found = (value['time'] == time) && (meantime == value['meantime']);
            if(found) {
                myArrayOrigin.splice(key, 1);
                // Break
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
    table.append('<thead><tr><td>'+columnName+'</td><td>Arrival Time</td><td>Duration</td><td>#</td></tr></thead>')
    table.append('<tbody></tbody>');
    $.each(node.extraCols[columnName],function (key,value){
        table.append("<tr><td>"+key+"</td><td>"+calculateMean(value, 'time')+"</td><td>"+calculateMean(value, 'meantime')+"</td><td>"+value.length+"</td></tr>");
    })
    return table;
}

/**
 * This method calculates the mean value of a certain attribute of an array.
 * @param myArray
 * @param attr
 * @returns {number}
 */
var calculateMean = function(myArray, attr) {
    var mean = 0;
    var count = 0
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
            updateGraph(edges,current ,lapseTime,false)

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
            updateGraph(edges,current ,lapseTime,false)

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

var up = function (){
    current = +(current) + lapseTime;
    //console.log(current)
    updateGraph(edges,current,lapseTime,false)
}
var bot = function () {
    current = +(current) - lapseTime;
   // console.log(current)
    updateGraph(edges,current,lapseTime,false)
}

var re = function () {
    current = +1388655879000-lapseTime/2;
    updateGraph(edges,current,lapseTime,false)
}
