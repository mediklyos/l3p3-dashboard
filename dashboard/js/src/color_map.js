function stream() {

    var ws = new ReconnectingWebSocket('ws://' + location.hostname + ':8080');
    var lineCount;
    var colHeadings;
    var recurso;
    var num_space=0;
    var flag_cabeceras=0;

    ws.onopen = function () {
        console.log('connect');
        ws.send("Color Map request");
        lineCount=0;
        flag_cabeceras=0;

    };

    ws.onclose = function () {
        console.log('disconnect');
    };
    ws.onmessage = function (message) {
        var whitespaces;
        var line = message.data.trim().toString();
        //Count whitespaces in message.data

        line.indexOf(' ')==-1 ? whitespaces=false : whitespaces = true;
        if(!isNaN(parseInt(line.charAt(0)))){
            //most typical case: numbers

            paint(recurso,colHeadings,line);
        }
        else if(!whitespaces && line.length!=0){
            //it is a resource
            recurso=line;
            $("#recurso").text(recurso);
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
    var colors = ["#F9AFAD","#F99EA3","#F9827F","#F9848E","#FC6675",
        "#F95E59","#FC4F59","#F43F4F","#EF2B2D","#D62100",
        "#E23D28","#D62100","#D62828","#CC2D30","#C13828",
        "#AF2626","#A03033","#7C2D23","#7C211E","#5B2D28"];
    for (var i = 0; i < colHeadings.length; i++) {
        if(colHeadings[i].toString()==recurso){
            stats=colValues[i];

            if(stats>0 && stats<100){
                color_chosen = colors[Math.floor(stats/5)];
            }
            else{
                stats==100 ? color_chosen=colors[colors.length] : color_chosen = 'rgb(0,0,0)';
            }
            $('rect[class="colorable"]').attr("fill",color_chosen);
        }}

}
    stream();


