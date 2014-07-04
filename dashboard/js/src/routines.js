/**
 * This scripts contains the initial routines of the editor
 *
 * Created by paco on 27/06/14.
 */

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

/*Load at the start*/
$("#section_dynamicDistribution").addClass("active");
$("#section_dynamicDistribution").parents().addClass("active");
$("#content").html(new EJS ({url: "js/templates/template_dynamicDistribution.ejs"}).render());





/*dynamicDistribution*/
//dynamicDistributionLoadData(DISTRIBUTION_SOURCE_FILE);
/*
    dynamicDistributionObject
        | csv (CSVContainer)
        | category (String)
        | primary (String)
        | Secondary (Array(String))

 */

var dynamicDistributionObject = new CSVContainer(DISTRIBUTION_SOURCE_FILE);

dynamicDistributionObject.watch("loaded",function (id,oldValue,newValue) {
    console.log("ID: " + id + ". Old value: " + oldValue + ", new value: " + newValue);
    if (newValue){
        console.log("The data has been loaded")
        dynamicDistributionObject.categorizedBy("Survived");
        dynamicDistributionObject.setPrimary("Pclass");

        discreteGraphicProcess(dynamicDistributionObject);
        discreteGraphicPaint(dynamicDistributionObject)
    }
    return newValue;
});

