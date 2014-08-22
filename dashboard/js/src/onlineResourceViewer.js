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

var ORV_TOOL_BAR_ID = PRE+"-tool-bar";
var ORV_INPUT_URL = PRE+"-input-url"
var ORV_COLUMNS_CLICKS = PRE + "-columns-clicks"
var ODV_CHARTS = PRE + "-charts"
var ODV_VELOCITY_SLIDER_PANEL = PRE + "-velocity-slider-panel"
var allTimeSeries = {};
var allValueLabels = {};
var descriptions = {};

var wss = [];
var charts = [];

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

function clear () {

    $.each(wss,function (key,value){
        value.close();
    })
    $.each(charts,function (key,value){
        value.stop();
    })
    wss = [];
    charts = [];
    $('#'+ODV_CHARTS).empty();

}
function onlineResourceView_postLoad(url) {
    if (url === undefined || url == ""){
        return;
    }
    clear();

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
            nextLine = LINE_NORMAL;
            colHeadings = e.data.trim().split(/ +/);
            var last_count=0;
            var last_node = colHeadings[colHeadings.length-1].toString().replace(/[^\d]/g, '');//takes last char to get the number of nodes
            for (var i = 0; i < colHeadings.length;i++){
                var col = extractNames(colHeadings[i]);
                if (descriptions[col.nodeName] === undefined){
                    descriptions[col.nodeName] = {};
                }
                descriptions[col.nodeName][col.colName] = col.colName;
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
    $('#'+ODV_CHARTS).find('.chart').removeClassPrefix('col-').addClass('col-lg-'+colNum);
    // De esta forma se ejecuta al cargar ejecutar todas las cosas, se hace asi porque antes no se
    // sabe cuanto vale el ancho
    $(function () {
        $('#'+ODV_CHARTS).find('canvas').attr('width', $('#'+ODV_CHARTS).find('canvas').width());
    })

}

function initCharts() {
    Object.each(descriptions, function(sectionName, values) {

        var section = $('.chart.template').clone().removeClass('template').addClass('chart').appendTo('#'+ODV_CHARTS);
        section.find('.title').text(sectionName);


        var smoothie = new SmoothieChart({
            grid: {
                sharpLines: true,
                verticalSections: 5,
                strokeStyle: 'rgba(119,119,119,0.45)',
                millisPerLine: 1000
            },
            minValue: 0,
            labels: {
                disabled: true
            }
        });
        charts.push(smoothie)
        smoothie.streamTo(section.find('canvas').get(0), 1000);

        var colors = chroma.brewer['Pastel2'];
        var index = 0;
        allTimeSeries[sectionName] = {}
        allValueLabels[sectionName] = {}
        Object.each(values, function(name, valueDescription) {
            var color = colors[index++];

            var timeSeries = new TimeSeries();
            smoothie.addTimeSeries(timeSeries, {
                strokeStyle: color,
                fillStyle: chroma(color).darken().alpha(0.5).css(),
                lineWidth: 3
            });
            allTimeSeries[sectionName][name] = timeSeries;

            var statLine = section.find('.stat.template').clone().removeClass('template').appendTo(section.find('.stats'));
            statLine.attr('title', valueDescription).css('color', color);
            statLine.find('.stat-name').text(name);
            statLine.find('.stat-name').attr('id',name);
            statLine.find('.stat-button').attr('onclick','sendToServer(document.getElementById("'+name+'").innerHTML)');//add ColorMap request button
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
            if (timeSeries) {
                timeSeries.append(Date.now(), value);
                allValueLabels[col.nodeName][col.colName].text(value + '%');
            }
        }
    });
}
function extractNames (col){
    var elem = col.split('.');
    var nodeName;
    var colName;
    nodeName = elem[0];
    if (elem.length == 1){
        colName = elem[0];

    }else {
        colName = elem[1];
    }
    return {nodeName : nodeName, colName: colName}
}
