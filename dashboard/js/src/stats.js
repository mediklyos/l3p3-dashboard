/**
 * This code is based on https://github.com/joewalnes/web-vmstats
 * It has been modified to show values from a .csv file instead of computer system stats.
 * Creates graphs on the go depending on the .csv file
 */
var allTimeSeries = {};
var allValueLabels = {};
var descriptions = {};

function streamStats() {
    var ws = new ReconnectingWebSocket('ws://' + location.hostname + ':8080');

    var lineCount;
    var colHeadings;

    ws.onopen = function() {
        console.log('connect');
        lineCount = 0;
    };

    ws.onclose = function() {
        console.log('disconnect');
    };

    ws.onmessage = function(e) {
        switch (lineCount++) {
            case 0: // ignore first line
                break;

            case 1: // column headings
                colHeadings = e.data.trim().split(/ +/);
                var last_count=0;
                var last_node = colHeadings[colHeadings.length-1].toString().replace(/[^\d]/g, '');//takes last char to get the number of nodes
                //counts variables in each node to be represented
                for(var num_node=1;num_node<=last_node;num_node++){
                    var variable_count=0;
                    for(var i=0;i<colHeadings.length;i++){
                       if(colHeadings[i].replace(/[^\d]/g, '')==num_node){
                           variable_count++;
                       }
                    }
                    var nomb_node="Node "+num_node;
                    descriptions[nomb_node] = {};
                    //save the variables inside each node
                    for(var j=0;j<variable_count;j++) {
                        var column=last_count+j;
                        descriptions[nomb_node][colHeadings[column]]=colHeadings[column];
                    }
                    last_count+=variable_count; //counts the number of items saved
                }
                initCharts();
                break;

            default: // subsequent lines: get number values
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

function initCharts() {
    Object.each(descriptions, function(sectionName, values) {

        var section = $('.chart.template').clone().removeClass('template').appendTo('#charts');

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
        smoothie.streamTo(section.find('canvas').get(0), 1000);

        var colors = chroma.brewer['Pastel2'];
        var index = 0;
        Object.each(values, function(name, valueDescription) {
            var color = colors[index++];

            var timeSeries = new TimeSeries();
            smoothie.addTimeSeries(timeSeries, {
                strokeStyle: color,
                fillStyle: chroma(color).darken().alpha(0.5).css(),
                lineWidth: 3
            });
            allTimeSeries[name] = timeSeries;

            var statLine = section.find('.stat.template').clone().removeClass('template').appendTo(section.find('.stats'));
            statLine.attr('title', valueDescription).css('color', color);
            statLine.find('.stat-name').text(name);
            statLine.find('.stat-name').attr('id',name);
            statLine.find('.stat-button').attr('onclick','sendToServer(document.getElementById("'+name+'").innerHTML)');//add ColorMap request button
            allValueLabels[name] = statLine.find('.stat-value');
        });
    });
}

function receiveStats(stats) {
    Object.each(stats, function(name, value) {
        var timeSeries = allTimeSeries[name];
        if (timeSeries) {
            timeSeries.append(Date.now(), value);
            allValueLabels[name].text(value + '%');
        }
    });
}

$(function() {
    streamStats();
});
