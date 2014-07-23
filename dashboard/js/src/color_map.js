function stream() {

    var ws = new ReconnectingWebSocket('ws://' + location.hostname + ':8080');
    var lineCount;
    var colHeadings;
    var recurso;

    ws.onopen = function () {
        console.log('connect');
        ws.send("Color Map request");
        lineCount = 0;
    };

    ws.onclose = function () {
        console.log('disconnect');
    };
    ws.onmessage = function (message) {
        var whitespaces;
        var line = message.data.trim().toString();
        //Count whitespaces in message.data

        line.indexOf(' ')==-1 ? whitespaces=false : whitespaces = true;

        console.log(line.charAt(0)+' '+isNaN(parseInt(line.charAt(0))));
        if(!isNaN(parseInt(line.charAt(0)))){
            //most typical case: numbers
            var colValues = line.split(/ +/);
            var stats = {};
            var colors = ["#F9AFAD","#F99EA3","#F9827F","#F9848E","#FC6675",
                "#F95E59","#FC4F59","#F43F4F","#EF2B2D","#D62100",
                "#E23D28","#D62100","#D62828","#CC2D30","#C13828",
                "#AF2626","#A03033","#7C2D23","#7C211E","#5B2D28"];
            console.log(recurso);
            for (var i = 0; i < colHeadings.length; i++) {
                if(colHeadings[i].toString()==recurso){
                    stats=colValues[i];
                    if(stats>=0 && stats<100){
                        color_chosen = colors[Math.floor(stats/5)];
                    }
                    else{
                        stats==100 ? color_chosen=colors[colors.length] : color_chosen = 'rgb(0,0,0)';
                    }
                    $('rect[class="colorable"]').attr("fill",color_chosen);
                }}
            console.log(stats);
        }
        else if(!whitespaces && line.length!=0){
            //it is a resource
            console.log("Esto debería ser el nombre del recurso: "+line);
            recurso=line;
        }
        else {
            //column headings
            colHeadings = line.split(/ +/);
        }
    };
}
    stream();


