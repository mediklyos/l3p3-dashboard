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
        console.log(location.host+" Ha recibido el mensaje");

        switch (lineCount++) {
        case 0: recurso=message;
        break;

        case 1: // column headings
        colHeadings = message.data.trim().split(/ +/);
        var length = e.data.trim().split(/ +/).length;
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

