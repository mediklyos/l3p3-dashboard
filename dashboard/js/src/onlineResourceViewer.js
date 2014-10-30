/**
 * This code is based on https://github.com/joewalnes/web-vmstats
 * It has been modified to show values from a .csv file instead of computer system stats.
 * Creates graphs on the go depending on the .csv file
 */

var LINE_HEADERS = 0
var LINE_NORMAL = 1

var ODV_MAX_COLS = 2;
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

var ODV_TIMEOUT = 1000;

var ODV_THRESHOLD_TIME_BETWEEN_CAPTURES = 10000;

var ODV_CHARTS = PRE + "-charts"

var ODV_HEIGHT_STEP = 20;
var ODV_FONT_STEP = 0;
var allTimeSeries = {};
var allValueLabels = {};
var descriptions = {};
var lastEntries = {}

var debug = GLOBAL_DEBUG;

var wss = [];
var charts = [];
var entriesStored = []




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

function columnsClick(event){
    $("#"+ORV_COLUMNS_CLICKS).find('.btn.btn-primary').removeClass('btn-primary').addClass('btn-default');
    var button = event.target;
    while (!$(button).hasClass('btn')){
        button = button.parentNode;
    }
    $(button).removeClass('btn-default').addClass('btn-primary');
    ODV_MAX_COLS = parseInt($(button).find('input').attr('value'));
    resizingCols();

//    $("#"+ORV_COLUMNS_CLICKS).find('.active').removeClass('btn-default').addClass('btn-primary');
}



function odv_clear (full) {
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
    odv_clear(true);

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
            odv_clear (false);
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
    var colNum =Math.floor(TOTAL_COL_WIDTH / ODV_MAX_COLS);
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
        smoothie.streamTo(section.find('canvas').get(0), ODV_TIMEOUT);
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
        colors[0] = 'blue'
        colors[1] = 'green'
        colors[2] = 'red'
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
            if (index >= colors.length){
                index = 0;
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
                var min = timeSeries.smoothie.options.minStored;
                var max = timeSeries.smoothie.options.maxStored;
                var normalizedValue = (value - min) / (max - min) * 100;
                timeSeries.append(Date.now(), value);
                allValueLabels[col.nodeName][col.colName].empty();
                allValueLabels[col.nodeName][col.colName].text(value);
                if (ODV_THRESHOLD < normalizedValue) {
                    allValueLabels[col.nodeName][col.colName].append('<img src="icons/alert.png" height="20">');
                    if (lastEntries[col.nodeName] === undefined || ((lastEntries[col.nodeName] + ODV_THRESHOLD_TIME_BETWEEN_CAPTURES) < Date.now())) {
                        lastEntries[col.nodeName] = Date.now();
                        setTimeout(function () {
                            save(allValueLabels[col.nodeName][col.colName][0]);
                        }.bind(timeSeries.smoothie), ODV_TIMEOUT * 2);
                    }
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

function save(target){

    var saveEntry = {};
    saveEntry.date = new Date();
    saveEntry.canvas = findCanvas(target);
    // id and smoothie is inside canvas
    saveEntry.data = saveEntry.canvas.smoothie.exportTimeSeriesData();
    entriesStored.push(saveEntry);
    var buttons = $('.'+ODV_BUTTON_ENTRY+'.template').clone().removeClass('template').addClass(ODV_PREFIX_CANVAS+saveEntry.canvas.id).appendTo('#'+ODV_EVENTS_LIST);
    buttons.find("."+ODV_ENTRY_DESCRIPTION).text(saveEntry.date.toLocaleString()+": " + saveEntry.canvas.id)
//    (saveEntry.date.toLocaleString()+": " + saveEntry.canvas.id);
    buttons.find("."+ODV_ENTRY_DESCRIPTION)[0].onclick = restore.bind(saveEntry)
    buttons.find("."+ODV_ENTRY_DELETE)[0].onclick = function (event) {
        $(event.target.parentNode).remove();
    }

}


function restore (event) {
    $("." + ODV_PREFIX_CANVAS+this.canvas.id+" ."+ODV_ENTRY_DESCRIPTION).removeClass("active btn-primary")
    this.canvas.smoothie.start();
    this.canvas.smoothie.restoreTimeSeriesData(this.data);
    this.canvas.smoothie.stopAtLastStep();
    $(event.target).addClass("active btn-primary")
    var id = this.canvas.id;
    $.each(allValueLabels[this.canvas.id], function (key,value){
        value.empty();
        value.text(allTimeSeries[id][key].data[allTimeSeries[id][key].data.length-1][1]);
        var min = allTimeSeries[id][key].smoothie.options.minStored;
        var max = allTimeSeries[id][key].smoothie.options.maxStored;
        var normalizedValue = (allTimeSeries[id][key].data[allTimeSeries[id][key].data.length-1][1] - min) / (max - min) * 100;
        if (ODV_THRESHOLD < normalizedValue) {
            allValueLabels[id][key].append('<img src="icons/alert.png" height="20">');

        }
    })
//    var lastPos = this.data.length -1;
//    if (ODV_THRESHOLD < normalizedValue){
//        allValueLabels[col.nodeName][col.colName].append('<img src="icons/alert.png" height="15">');
//        setTimeout(function () {
//            save(allValueLabels[col.nodeName][col.colName][0]);
//        }.bind(timeSeries.smoothie),ODV_TIMEOUT*2);
//    }
//    timeSeries.append(Date.now(), value);
//    allValueLabels[col.nodeName][col.colName].empty();
//    allValueLabels[col.nodeName][col.colName].text(value);
}
function pause(target){
    var canvas = findCanvas(target);
    canvas.smoothie.stop();
}

function resume(target){
    var canvas = findCanvas(target);
    $("." + ODV_PREFIX_CANVAS+canvas.id+" ."+ODV_ENTRY_DESCRIPTION).removeClass("active btn-primary")

        canvas.smoothie.start();
}


var odvResizeFunction  = function (){
    $("#"+ODV_CHARTS).css('max-height','calc(100vh - '+($("#"+ODV_CHARTS).offset().top + BORDER_SIZE)+'px');
}