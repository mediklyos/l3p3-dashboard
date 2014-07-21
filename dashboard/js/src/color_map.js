window.addEventListener('load', eventWindowLoaded(), false);
function eventWindowLoaded() {
    add_coloring_book_events();
}
function add_coloring_book_events() {
    $('rect[class="colorable"]').bind("click", function(event) {
        event.preventDefault();
        color_chosen = $("#color_chosen").html();
        $(this).attr("fill", color_chosen);
    });
    $('.color_choice').bind("click", function(event) {
        color_chosen = $(this).attr("id");
        $("#color_chosen").html(color_chosen);
    });
    $('#reset_image').bind("click", function(event) {
        $('rect[class="colorable"]').attr("fill", "white");
    });
}
