/**
 * This scripts contains the initial routines of the editor
 *
 * Created by paco on 27/06/14.
 */

// Esta rutina permite cambiar dinamicamente el contenido del centro al hacer link. Los links que son de la clase
// CONTENT_LINK_CLASS_NAME se le activa y desactiva la clase active para
$(document).ready(function(){
    $("."+CONTENT_LINK_CLASS_NAME).click(function(){
        var contentLinks = $(".contentLink");
        // This is similar to for of all elements with contentLink
        $("."+ACTIVE_CLASS).parents().removeClass("active");
        $("."+CONTENT_LINK_CLASS_NAME).removeClass("active");
        $(this).addClass("active");
        $(this).parents().addClass("active");
        $("#content").load($(this).attr("ref"));
    });
});


