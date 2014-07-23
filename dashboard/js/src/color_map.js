function stream() {

    var ws = new ReconnectingWebSocket('ws://' + location.hostname + ':8080');
    var lineCount, colHeadings, resource;

    ws.onopen = function () {
        console.log('connect');
        ws.send("Color Map request");
        lineCount=0;
    };

    ws.onclose = function () {
        console.log('disconnect');
    };
    ws.onmessage = function (message) {
        var whitespaces;
        var line = message.data.trim().toString();
        //Are there whitespaces in the received line?
        line.indexOf(' ')==-1 ? whitespaces=false : whitespaces = true;

        if(!isNaN(parseInt(line.charAt(0)))){
            //most typical case (number) first to perform faster: if the first character is a number
            paint(resource,colHeadings,line);
        }
        else if(!whitespaces && line.length!=0){
            //resource name (no whitespaces and no blank line)
            resource=line;
            $("#resource").text(resource);
        }
        else {
            //column headings
            colHeadings = line.split(/ +/);
        }
    };
}

function paint(recurso,colHeadings,line){

    var colValues = line.split(/ +/);
    var stats = {};
    //Range of 20 colors from light red to dark red
    var colors = ["#F9AFAD","#F99EA3","#F9827F","#F9848E","#FC6675",
        "#F95E59","#FC4F59","#F43F4F","#EF2B2D","#D62100",
        "#E23D28","#D62100","#D62828","#CC2D30","#C13828",
        "#AF2626","#A03033","#7C2D23","#7C211E","#5B2D28"];
    for (var i = 0; i < colHeadings.length; i++) {
        //take only the data of the source to be shown in the ColorMap
        if(colHeadings[i].toString()==recurso){
            stats=colValues[i];
            if(stats>0 && stats<100){
                color_chosen = colors[Math.floor(stats/5)];
            }
            else{
                //if 100, take last color, else take black
                stats==100 ? color_chosen=colors[colors.length] : color_chosen = 'rgb(0,0,0)';
            }
            $('rect[class="colorable"]').attr("fill",color_chosen);
        }
    }
}
    stream();


