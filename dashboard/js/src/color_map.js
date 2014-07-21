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
