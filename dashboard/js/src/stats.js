var allTimeSeries = {};
var allValueLabels = {};
var descriptions = {};

function streamStats() {

    var ws = new ReconnectingWebSocket('ws://' + location.hostname + ':8080');
    console.log(location.host);
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
                var num_node ;
                var ultima_cuenta=0;
                var length = e.data.trim().split(/ +/).length;
                var last_node=colHeadings[length-1].toString().replace(/[^\d]/g, '');
                console.log("el ultimo nodo es:"+last_node);
                for(num_node=1;num_node<=last_node;num_node++){
                    var cuenta_variables=0;
                    for(var i=0;i<length;i++){
                       if(colHeadings[i].replace(/[^\d]/g, '')==num_node){
                           cuenta_variables++;
                       }
                    }

                    var nomb_node="Node"+num_node;
                    descriptions[nomb_node] = {};

                    for(var j=0;j<cuenta_variables;j++) {
                        var columna=ultima_cuenta+j;
                        descriptions[nomb_node][colHeadings[columna]]=colHeadings[columna];

                    }
                    ultima_cuenta+=cuenta_variables;
                }
                initCharts();

                break;

            default: // subsequent lines
                var colValues = e.data.trim().split(/ +/);
                var stats = {};
                for (var i = 0; i < colHeadings.length; i++) {
                    stats[colHeadings[i]] = parseInt(colValues[i]);
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
            allValueLabels[name] = statLine.find('.stat-value');
        });
    });
}

function receiveStats(stats) {
    Object.each(stats, function(name, value) {
        var timeSeries = allTimeSeries[name];
        if (timeSeries) {
            timeSeries.append(Date.now(), value);
            allValueLabels[name].text(value);
        }
    });
}

$(function() {
    streamStats();
});
