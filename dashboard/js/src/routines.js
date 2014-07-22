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
$("#section_dynamicDistribution").addClass("active");
$("#section_dynamicDistribution").parents().addClass("active");
$("#content").html(new EJS ({url: "js/templates/template_dynamicDistribution.ejs"}).render());

//$("#content").html(new EJS ({url: "js/templates/template_overview.ejs"}).render());




/*dynamicDistribution*/
//dynamicDistributionLoadData(DISTRIBUTION_SOURCE_FILE);
/*
    dynamicDistributionObject
        | csv (CSVContainerForDistributions)
        | category (String)
        | primary (String)
        | Secondary (Array(String))

 */






loadDataSetFromUrl("data/titanic.csv",{
    PassengerId: CSVContainerForDistributions.TYPE_ID,
    Survived: CSVContainerForDistributions.TYPE_DISCRETE,
    Pclass: CSVContainerForDistributions.TYPE_DISCRETE,
    Name: CSVContainerForDistributions.TYPE_ID,
    Sex: CSVContainerForDistributions.TYPE_DISCRETE,
    Age: CSVContainerForDistributions.TYPE_CONTINUOUS,
    SibSp: CSVContainerForDistributions.TYPE_DISCRETE,
    Parch: CSVContainerForDistributions.TYPE_DISCRETE,
    Ticket: CSVContainerForDistributions.TYPE_ID,
    Fare: CSVContainerForDistributions.TYPE_CONTINUOUS,
    Cabin: CSVContainerForDistributions.TYPE_DISCRETE,
    Embarked: CSVContainerForDistributions.TYPE_DISCRETE
})
loadDataSetFromUrl("data/events.csv",{
    date: CSVContainerForDistributions.TYPE_DATE,
    node: CSVContainerForDistributions.TYPE_DISCRETE,
    type: CSVContainerForDistributions.TYPE_DISCRETE,
    variable: CSVContainerForDistributions.TYPE_DISCRETE,
    value: CSVContainerForDistributions.TYPE_CONTINUOUS
})


clearPanel();

function runDynamicDistribution(file){
    // hidden elements
    // Si son null es porque aun no se ha cargado el ejs
    if (document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV) != null){
        document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'; // block

    }
    if (document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV) != null) {
        document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'none'; // block
    }
    dynamicDistributionObject = new CSVContainerForDistributions(file);
    onLoadedCSV()
}


