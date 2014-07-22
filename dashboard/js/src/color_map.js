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


        switch (lineCount++) {
        case 0:
        break;

        case 1: // column headings
        colHeadings = message.data.trim().split(/ +/);


        break;

        case 2://Recurso de Color Map

                recurso=message;

        break;

        default: // subsequent lines
        var colValues = message.data.trim().split(/ +/);
            var stats = {};
            console.log(recurso.data);
        for (var i = 0; i < colHeadings.length; i++) {

            if(colHeadings[i].toString()==recurso.data){
            //stats[colHeadings[i]] = parseInt(colValues[i]);
                stats=colValues[i];
        }}
        console.log(stats);
    }

    };
}
    stream();


window.addEventListener('load', eventWindowLoaded(), false);
function eventWindowLoaded() {
    add_coloring_book_events();
}

function add_coloring_book_events() {
    $('#submit').bind("click",function(event){
        var colors = ["#F9AFAD","#F99EA3","#F9827F","#F9848E","#FC6675",
            "#F95E59","#FC4F59","#F43F4F","#EF2B2D","#D62100",
            "#E23D28","#D62100","#D62828","#CC2D30","#C13828",
            "#AF2626","#A03033","#7C2D23","#7C211E","#5B2D28"];
        var number = $('#number_choice').val();
        if(number>=0 && number<100){
            color_chosen = colors[Math.floor(number/5)];
        }
        else{
            number==100 ? color_chosen=colors[colors.length] : color_chosen = 'rgb(0,0,0)';
        }
        $('rect[class="colorable"]').attr("fill",color_chosen);
    });
    $('#reset_image').bind("click", function(event) {
        $('rect[class="colorable"]').attr("fill", "white");
    });
}

function fill(stats) {
    var colors = ["#F9AFAD","#F99EA3","#F9827F","#F9848E","#FC6675",
        "#F95E59","#FC4F59","#F43F4F","#EF2B2D","#D62100",
        "#E23D28","#D62100","#D62828","#CC2D30","#C13828",
        "#AF2626","#A03033","#7C2D23","#7C211E","#5B2D28"];
    if(stats>=0 && stats<100){
        color_chosen = colors[Math.floor(number/5)];
    }
    else{
        stats==100 ? color_chosen=colors[colors.length] : color_chosen = 'rgb(0,0,0)';
    }
    $('rect[class="colorable"]').attr("fill",color_chosen);
    $('#reset_image').bind("click", function(event) {
        $('rect[class="colorable"]').attr("fill", "white");
    });
}
