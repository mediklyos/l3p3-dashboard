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
        if(number>=0 && number<=100){
            color_chosen = colors[number/10];
        }
        else{
            color_chosen = 'rgb(0,0,0)';
        }
        $('rect[class="colorable"]').attr("fill",color_chosen);
    });
    $('#reset_image').bind("click", function(event) {
        $('rect[class="colorable"]').attr("fill", "white");
    });
}