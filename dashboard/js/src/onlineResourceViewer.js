/**
 * This code is based on https://github.com/joewalnes/web-vmstats
 * It has been modified to show values from a .csv file instead of computer system stats.
 * Creates graphs on the go depending on the .csv file
 */

var LINE_HEADERS = 0
var LINE_NORMAL = 1

var MAX_COLS = 2;
var TOTAL_COL_WIDTH = 12;

var PRE = views[0][1].constantsPrefix; // odv

var ODV_THRESHOLD = 100;

var ORV_TOOL_BAR_ID = PRE+"-tool-bar";
var ORV_INPUT_URL = PRE+"-input-url"
var ORV_COLUMNS_CLICKS = PRE + "-columns-clicks"
var ODV_CHARTS = PRE + "-charts"
var ODV_CHART = PRE + "-chart"
var ODV_VELOCITY_SLIDER_PANEL = PRE + "-velocity-slider-panel"
var ODV_CHART_SLIDER = PRE + "-chart-slider";
var ODV_CHART_SLIDER_LABEL = PRE + "-chart-slider-label"
var ODV_DYNAMIC_HEIGHT = "-dynamic-height"
var ODV_EVENTS_COL = PRE + "-events-col"
var ODV_EVENTS_LIST = PRE + "-events-list"
var ODV_THRESHOLD_SLIDER_PANEL = PRE + "-threshold-slider-panel";
var ODV_SPAN_THRESHOLD_VALUE = PRE + "-threshold-value";
var ODV_BUTTON_ENTRY = PRE +"-button-entry";
var ODV_ENTRY_DESCRIPTION = PRE +"-entry-description";
var ODV_ENTRY_DELETE = PRE +"-entry-delete";

var ODV_PREFIX_CANVAS = PRE + "-canvas-"



var ODV_HEIGHT_STEP = 20;
var ODV_FONT_STEP = 0;
var allTimeSeries = {};
var allValueLabels = {};
var descriptions = {};

var debug = true;

var wss = [];
var charts = [];
var entriesStored = []

$(function (){
    if (debug){
        $("#"+ORV_COLUMNS_CLICKS).find('.btn').removeClass('btn-primary').addClass('btn-default');
        MAX_COLS = 4;
        resizingCols();
        document.getElementsByClassName('odv-canvas')[0].setAttribute('height',600)
//        ($('.'+ODV_CHART).find('canvas'))[0].setAttribute('height',600);
//        function
//        $(function(){
//
//        })
        onlineResourceView_postLoad("localhost:8080")
    }
})


var smoothie_default_values = {
    millisPerPixel: 20,
    grid: {
        sharpLines: true,
        verticalSections: 5,
//        strokeStyle: 'rgba(119,119,119,0.45)',
        strokeStyle: 'rgba(0,0,0,0.5)',
        fillStyle: 'rgba(0,0,0,0.1)',
        millisPerLine: 1000
    },
//    minValue: 0,
    labels: {
//        disabled: false,
        fillStyle:'rgba(255,0,0,1)'
    }
};


function onlineResourceView_postLoad_enter(event) {
    if (event.keyCode == 13){
        console.log("Changing the source");
        onlineResourceView_postLoad_click();


    }
//    console.log("keyCode="+event.keyCode+", indentifier"+ event.keyIdentifier);
}
function onlineResourceView_postLoad_click(){
    onlineResourceView_postLoad($("#odv-input-url").val());
}

function columnsClick(){
    $("#"+ORV_COLUMNS_CLICKS).find('.btn').removeClass('btn-primary').addClass('btn-default');
    $(event.target).removeClass('btn-default').addClass('btn-primary');
    MAX_COLS = $(event.target).find('input').val();
    resizingCols();

//    $("#"+ORV_COLUMNS_CLICKS).find('.active').removeClass('btn-default').addClass('btn-primary');
}



function clear (full) {
    if (full) {
        $.each(wss, function (key, value) {
            value.close();
        })
    }
    $.each(charts,function (key,value){
        value.stop();
    })
    $("."+ODV_BUTTON_ENTRY).not(".template").remove()
    wsss = [];
    charts = [];
    entriesStored = []
    $('#'+ODV_CHARTS).empty();

}
function onlineResourceView_postLoad(url) {
    if (url === undefined || url == ""){
        return;
    }
    clear(true);

    var ws = new ReconnectingWebSocket('ws://' + url);

    wss.push(ws);
    allTimeSeries = {};
    allValueLabels = {};
    descriptions = {}

    var lineCount;
    var colHeadings;

    ws.onopen = function(e) {
        console.log('connect');
        lineCount = 0;
    };

    ws.onclose = function() {
        console.log('disconnect');
    };
    var nextLine = LINE_NORMAL
    ws.onmessage = function(e) {
        var currentLine = e.data.trim();
        if (currentLine == ""){
            nextLine = LINE_HEADERS;
        }else if (nextLine == LINE_HEADERS){
            // No es necesario resetear las conexiones porque lo que ha pasado es que se han enviado nuevas columnas
            clear (false);
            nextLine = LINE_NORMAL;
            colHeadings = e.data.trim().split(/ +/);
            var last_count=0;
            var last_node = colHeadings[colHeadings.length-1].toString().replace(/[^\d]/g, '');//takes last char to get the number of nodes
            for (var i = 0; i < colHeadings.length;i++){
                var col = extractNames(colHeadings[i]);
                if (descriptions[col.nodeName] === undefined){
                    descriptions[col.nodeName] = {};
                }
                descriptions[col.nodeName][col.colName] = [col.min, col.max];//col.colName;
            }
            initCharts();
        }else {
            var colValues = e.data.trim().split(/ +/);
            var stats = {};
            for (var i = 0; i < colHeadings.length; i++) {
                if(!(isNaN(colValues[i]))){//ignore NaN lines
                    stats[colHeadings[i]] = parseInt(colValues[i]);}
            }
            receiveStats(stats);
        }
    };
}

function resizingCols(){
    var colNum =Math.floor(TOTAL_COL_WIDTH / MAX_COLS);
//    $('#'+ODV_CHARTS).find('.chart').removeClassPrefix('col-').addClass('col-lg-'+colNum);
    $('#'+ODV_CHARTS).find('.'+ODV_CHART).removeClassPrefix('col-').addClass('col-lg-'+colNum);
    // De esta forma se ejecuta al cargar ejecutar todas las cosas, se hace asi porque antes no se
    // sabe cuanto vale el ancho
    $(function () {
        $('#'+ODV_CHARTS).find('canvas').attr('width', $('#'+ODV_CHARTS).find('canvas').width());
    })

}

function initCharts(min, max) {
    Object.each(descriptions, function(sectionName, values) {

//        var section = $('.chart.template').clone().removeClass('template').addClass('chart').appendTo('#'+ODV_CHARTS);
        var section = $('.'+ODV_CHART+'.template').clone().removeClass('template').addClass(ODV_CHART).appendTo('#'+ODV_CHARTS);
        section.find('.title').text(sectionName);

        var dynamicHeightButton = section.find("."+ODV_DYNAMIC_HEIGHT)


        var smoothie = new SmoothieChart(smoothie_default_values);
        charts.push(smoothie)
        smoothie.streamTo(section.find('canvas').get(0), 1000);
        section.find('canvas')[0].smoothie = smoothie;
        section.find('canvas')[0].id = sectionName;

        var sliderDiv = section.find('.'+ODV_CHART_SLIDER);

        sliderDiv.append('<div class="'+ODV_CHART_SLIDER_LABEL+'" style="padding-right: 15px" >velocity</div>')
        var slider = jQuery('<div/>').slider({
            range: 'min',
            min: 10,
            max: 100,
            value: 90,
            step: 1,
            stop : function (event, ui){
                var max = $(this).slider("option","max");
                var min = $(this).slider("option","min");
                smoothie.options.millisPerPixel = max - ui.value+min;
            }
        }).appendTo(sliderDiv);
        slider.width(100);

        var colors = chroma.brewer['Pastel2'];
        var index = 0;
        allTimeSeries[sectionName] = {}
        allValueLabels[sectionName] = {}
        var nStats = Object.keys(values).length;
        var statWeigh = parseInt(90/nStats);
        var statPadding = parseInt(statWeigh/3)*2;
        Object.each(values, function(name, valueDescription) {
            // lo hago asi para que el undefined sea reconocido como falso, reconociendo el maximo y el minimo
            if (!(valueDescription[0] >= smoothie.options.minValue )) {
                smoothie.options.minValue = valueDescription[0];
                smoothie.options.minStored = valueDescription[0];
            }
            if (!(valueDescription[1] <= smoothie.options.maxValue)){
                smoothie.options.maxValue = valueDescription[1];
                smoothie.options.maxStored = valueDescription[1];
            }
            var color = colors[index++];

            var timeSeries = new TimeSeries();
            smoothie.addTimeSeries(timeSeries, {
                strokeStyle: color,
                fillStyle: chroma(color).darken().alpha(0.5).css(),
                lineWidth: 3
            });
            timeSeries.smoothie = smoothie;
            allTimeSeries[sectionName][name] = timeSeries;

            var statLine = section.find('.stat.template').clone().removeClass('template').appendTo(section.find('.stats'));
            statLine.attr('title', name).css('color', color);
            statLine.find('.stat-name').text(name);
            statLine.find('.stat-name').attr('id',name);
            statLine.css('width',statWeigh+"%")
            section.find('.stats').css('padding-left',statPadding+"%")

//            statLine.find('.stat-button').attr('onclick','sendToServer(document.getElementById("'+name+'").innerHTML)');//add ColorMap request button
            allValueLabels[sectionName][name] = statLine.find('.stat-value');
        });
    });
    resizingCols();
}

function receiveStats(stats) {
    Object.each(stats, function(name, value) {
        var col = extractNames(name);
        // Se pueden recibir basuras, si se recibe basura se debe ignorar, cuando se recibe basura allTimeSeries no existe para ese valor
        if (allTimeSeries[col.nodeName] !== undefined ){
            var timeSeries = allTimeSeries[col.nodeName][col.colName];
            if (timeSeries && !timeSeries.smoothie.isStoped) {
                timeSeries.append(Date.now(), value);
                allValueLabels[col.nodeName][col.colName].empty();
                var intValue = parseInt(value);
                var min = timeSeries.smoothie.options.minStored;
                var max = timeSeries.smoothie.options.maxStored;
                var normalizedValue = (value - min) / (max - min) * 100;
                allValueLabels[col.nodeName][col.colName].text(value);
                if (ODV_THRESHOLD < normalizedValue){
                    allValueLabels[col.nodeName][col.colName].append('<img src="icons/alert.png" height="15">');
                }
            }
        }
    });
}
/**
 * Columns format = name[.nodeName][$min[@max]]
 * @param col
 * @returns {{nodeName: *, colName: *}}
 */
function extractNames (col){
    var min, max,nodeName,colName;
    var elem = col.split('$');
    /*There are min and max*/
    if (elem.length > 1){
        var ranges = elem[1].split('@');
        /*There are min and max*/
        if (ranges.length > 1) {
            min = parseInt(ranges[0]);
            max = parseInt(ranges[1]);
        } else {
            // there is only max, min is 0
            min = parseInt(ranges[0]);
            max = undefined;
        }
    } else {
        // There are no min and max min = 0; max = no value
        min = undefined;
        max = undefined;
    }

    var nodeDescription = elem[0].split('.');

    nodeName = nodeDescription[0];
    // is there node to agroup
    if (nodeDescription.length == 1){
        colName = nodeDescription[0];

    }else {
        colName = nodeDescription[1];
    }
    return {nodeName : nodeName, colName: colName, min : min, max: max}
}


function changeRefreshTime(newValue) {
    $.each(wss,function (key,value){
        value.send(newValue);
    })
}

function incrementChartsHeight(){
    var newValue = parseInt($('.'+ODV_CHART).find('canvas').attr('height'))+ODV_HEIGHT_STEP;
    $('.'+ODV_CHART).find('canvas').attr('height',newValue);
    $.each(charts,function (key, value){
        value.options.labels.fontSize = value.options.labels.fontSize + ODV_FONT_STEP;
    })
}
function decrementChartsHeight(){
    var newValue = parseInt($('.'+ODV_CHART).find('canvas').attr('height'))-ODV_HEIGHT_STEP;
    if (newValue > 0)
        $('.odv-chart').find('canvas').attr('height',newValue);

    $.each(charts, function (key, value) {
        newValue =  value.options.labels.fontSize - ODV_FONT_STEP
        // Para guardar la relaccion de steps
        if (newValue > 2) {
        value.options.labels.fontSize = newValue
        }
    })

}

function setDynamicHeight(event){

    var canvas = findCanvas(event.target);
    var smoothie = canvas.smoothie;
    if ($(event.target).hasClass('active')){
        smoothie.options.minValue = smoothie.options.minStored;
        smoothie.options.maxValue = smoothie.options.maxStored;
    } else {
        smoothie.options.minValue = undefined;
        smoothie.options.maxValue = undefined;
    }
    // find the canvas
}

function findCanvas (node) {
    var chartNode = undefined
    while (chartNode === undefined && node !== undefined && node != null){
        if ($(node).hasClass(ODV_CHART)){
            chartNode = node;
        } else {
            node = node.parentNode;
        }
    }
    if (chartNode === undefined) {
        return undefined;
    }

    var canvas = $(chartNode).find('canvas');
    return canvas[0];
}

function setThreshold(value) {
    ODV_THRESHOLD = value;
}

function save(event){

    var saveEntry = {};
    saveEntry.date = new Date();
    saveEntry.canvas = findCanvas(event.target);
    // id and smoothie is inside canvas
    saveEntry.data = saveEntry.canvas.smoothie.exportTimeSeriesData();
    entriesStored.push(saveEntry);
    var buttons = $('.'+ODV_BUTTON_ENTRY+'.template').clone().removeClass('template').addClass(ODV_PREFIX_CANVAS+saveEntry.canvas.id).appendTo('#'+ODV_EVENTS_LIST);
    buttons.find("."+ODV_ENTRY_DESCRIPTION).text(saveEntry.date.toLocaleString()+": " + saveEntry.canvas.id)
//    (saveEntry.date.toLocaleString()+": " + saveEntry.canvas.id);
    buttons.find("."+ODV_ENTRY_DESCRIPTION)[0].onclick = function (event) {
        $("." + ODV_PREFIX_CANVAS+this.canvas.id+" ."+ODV_ENTRY_DESCRIPTION).removeClass("active btn-primary")
        console.log("restaurando")
        this.canvas.smoothie.start();
        this.canvas.smoothie.restoreTimeSeriesData(this.data);
        this.canvas.smoothie.stopAtLastStep();
        $(event.target).addClass("active btn-primary")

    }.bind(saveEntry)
    buttons.find("."+ODV_ENTRY_DELETE)[0].onclick = function (event) {
        $(event.target.parentNode).remove();
    }

}

function pause(event){
    var canvas = findCanvas(event.target);
    canvas.smoothie.stop();
}

function resume(event){
    var canvas = findCanvas(event.target);
    $("." + ODV_PREFIX_CANVAS+canvas.id+" ."+ODV_ENTRY_DESCRIPTION).removeClass("active btn-primary")

        canvas.smoothie.start();
}

//var cloned = {}

//function mySave () {
//    console.log();
//    cloned = {}
//    $.each (allTimeSeries, function (key1,level1){
//        cloned[key1] = {}
//        $.each (level1, function (key2,level2) {
//            cloned[key1][key2] = {}
//            cloned[key1][key2].data = []
//            for (var i = 0; i < level2.data.length;i++){
//                cloned[key1][key2].data.push(level2.data[i].slice(0));
//            }
//        })
//    })
//    console.log();
//}
//function myRestore(){
//    restore(cloned)
//}

// Para restaurar hay que poner vaciar el buffer y poner los valores, como pinta el tiempo actual es necesario, al hacer
// el append, incrementar el tiempo en la diferencia entre el tiempo anterior  el actual
//function restore(data) {
//    $.each (data, function (key1,level1){
//        $.each (level1, function (key2,level2) {
//            var currentTime = Date.now();
//            var firstTime = level2.data[level2.data.length-1][0];
//            var increment = currentTime - firstTime;
//            allTimeSeries[key1][key2].data = []
//            for (var i = 0; i < level2.data.length ;i++){
//                allTimeSeries[key1][key2].append(level2.data[i][0]+increment,level2.data[i][1]);
//            }
//        })
//    })
//    console.log();
//}

//function restorePause() {
//    // Restaurar datos
//    myRestore()
//    // repintar
//
//    for (var i = 0; i < charts.length;i++){
//        $(function() {
//            charts[i].stopAtLastStep();
//        })
//    }
//    // Pausar cuando acabe de repintar
////    $(function(){
////        myPause()
////    })
//}
//function myResume () {
//    $.each(charts,function (key, value){
//        value.start();
//    })
//}
//function myPause() {
//    $.each(charts,function (key, value){
//
//        value.stop();
//    })
//}