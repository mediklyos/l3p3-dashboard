/**
 * This scripts contains the initial routines of the editor
 *
 * Created by paco on 27/06/14.
 */

var dynamicDistributionObject;

var filesInMemory= new Object

// Rutina del menu izquierdo que permite cambiar dinamicamente el contenido del centro al hacer link.
// Los links que son de la clase CONTENT_LINK_CLASS_NAME se le activa y desactiva la clase active para
$(document).ready(function(){
    $("."+CONTENT_LINK_CLASS_NAME).click(function(){
        var contentLinks = $(".contentLink");
        // This is similar to for of all elements with contentLink
        $("."+ACTIVE_CLASS).parents().removeClass("active");
        $("."+CONTENT_LINK_CLASS_NAME).removeClass("active");
        $(this).addClass("active");
        $(this).parents().addClass("active");
        var string_url = $(this).attr("ref");
        var html = new EJS ({url: string_url}).render()
        $("#content").html(html);
//        $("#content").load("section_singleNodeViewer.html")
    });

});

function generateInteractiveViewsMenu(){
    var list = $("#views-drop-down")
//    var request = new EJS.newRequest();
    var request = new XMLHttpRequest;
    var linesPainted = 0;
    $.each(views, function (pos, value){
        if (linesPainted != 0 && value.length != 0){
            $('<li class="divider"></li>').appendTo(list);
        }
        linesPainted = 0;
        $.each(value,function(pos,value) {
            var request = new XMLHttpRequest();
            request.open('GET', value.ref, false);  // `false` makes the request synchronous
            request.send(null)
            if (request.status === 200) {
                var li = $('<li/>')
                $('<a/>',{
                    ref: value.ref,
                    id: value.id,
                    href: "#",
                    class: "contentLink",
                    text: value.title
                }).appendTo(li);
                li.appendTo(list)
                linesPainted++;
            } else {
                console.log("Ignore the GET exception...")
            }

        })

    })
}
generateInteractiveViewsMenu();

// Toggle buttons color too
var toggleButtonsFunction = function(id,callback,event) {
    var div = $(document.getElementById(id));
    div.find('.btn').toggleClass('btn-default',true).toggleClass('btn-primary',false);
    $(window.event.target).toggleClass('btn-default',false).toggleClass('btn-primary',true);
    var name = $(window.event.target).find('input').attr('name');
    var value = $(window.event.target).find('input').attr('value');
    callback(name,value)
}



/*Load at the start*/
if (GLOBAL_DEBUG){
//    $("#"+views[0][1].id).addClass("active");
//    $("#"+views[0][1].id).parents().addClass("active");
//    $("#content").html(new EJS ({url: views[0][1].ref}).render());
    $("#"+views[0][2].id).addClass("active");
    $("#"+views[0][2].id).parents().addClass("active");
    $("#content").html(new EJS ({url: views[0][2].ref}).render());

} else {
    $("#content").html(new EJS ({url: "js/templates/template_overview.ejs"}).render());
}
//




/*dynamicDistribution*/
//dynamicDistributionLoadData(DISTRIBUTION_SOURCE_FILE);
/*
    dynamicDistributionObject
        | csv (CSVContainerForDistributions)
        | population (String)
        | primary (String)
        | Secondary (Array(String))

 */

clearPanel();

function runDynamicDistribution(file){
    // hidden elements
    // Si son null es porque aun no se ha cargado el ejs
    dynamicDistributionObject = new CSVContainerForDistributions(file);
    onLoadedCSV()
}


