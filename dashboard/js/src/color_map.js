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
        number = $('#number_choice').val();
        if(number>50){
            color_chosen = 'rgb(234,86,86)';
        }
        else{
            color_chosen = 'rgb(206,52,52)';
        }
        $('rect[class="colorable"]').attr("fill",color_chosen);
    });
    $('#reset_image').bind("click", function(event) {
        $('rect[class="colorable"]').attr("fill", "white");
    });
}

