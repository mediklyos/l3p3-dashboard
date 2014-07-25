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

    //Range of 20 colors
    var colors = ["#00FF00","#00FF33","#66FF00","#66FF33","#99FF00",
        "#99FF33","#CCFF00","#CCFF33","#FFFF00","#FFFF33",
        "#FFCC00","#FFCC33","#FF9900","#FF9933","#FF6600",
        "#FF6633","#FF3300","#FF3333","#FF0000","#FF0033"];
    for (var i = 0; i < colHeadings.length; i++) {
        //take only the data of the source to be shown in the ColorMap
        if(colHeadings[i].toString()==recurso){
            stats=colValues[i];
            if(stats>=0 && stats<100){
                color_chosen = colors[Math.floor(stats/5)];
                if(stats>50){//If the resource is higher than 50% we paint the caution signal
                    var caution = " <svg  id='caution' width='150pt' height='150pt' viewBox='0 0 48 48' xml:space='preserve' xmlns='http://www.w3.org/2000/svg'><g id='Layer_x0020_3' style='fill-rule:nonzero;clip-rule:nonzero;stroke:#D62828;stroke-miterlimit:4;'><g><path style='stroke:#FFFFFF;stroke-width:6.6112;;' d='M41.7,35.3L26.6,9.4c-0.6-1-1.7-1.7-2.9-1.6c-1.2,0-2.3,0.7-2.9,1.7L6.3,35.4c-0.6,1-0.6,2.3,0,3.3c0.6,1,1.7,1.6,2.9,1.6h29.6c1.2,0,2.3-0.6,2.9-1.7c0.6-1,0.6-2.3,0-3.3z'/><path style='fill:#FFFFFF;stroke-width:6.6112;stroke-linecap:round;stroke-linejoin:round;;' d='M23.7,11L9.2,37h29.6L23.7,11z'/><path style='fill:#FFFFFF;stroke:none;;' d='M23.7,11.9L10.3,36.1h27.5l-14-24.1z'/><g><path style='stroke:none;' d='M24.1,34c-1.1,0-1.8-0.8-1.8-1.8c0-1.1,0.7-1.8,1.8-1.8c1.1,0,1.8,0.7,1.8,1.8c0,1-0.7,1.8-1.8,1.8h0z M22.9,29.3l-0.4-9.1h3.2l-0.4,9.1h-2.3z'/></g></g></g><g id='crop_x0020_marks' style='fill-rule:nonzero;clip-rule:nonzero;stroke:#000000;stroke-miterlimit:4;'><path style='fill:none;stroke:none;' d='M48,48H0V0h48v48z'/></g></svg> ";
                    $(".flag").html(caution);
                }
                else{//else nothing
                    $(".flag").html("");
                }
            }
            else{
                //if 100, take last color, else take black
                stats==100 ? color_chosen=colors[colors.length] : color_chosen = 'rgb(0,0,0)';
            }
            $('rect[class="colorable"]').attr("fill",color_chosen);
            $('.percent').html(stats+"%");
        }
    }
}
    stream();


