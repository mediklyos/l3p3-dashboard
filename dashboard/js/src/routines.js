/**
 * This scripts contains the initial routines of the editor
 *
 * Created by paco on 27/06/14.
 */

var dynamicDistributionObject;

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
runDynamicDistribution(DISTRIBUTION_SOURCE_FILE);
function runDynamicDistribution(file){
    // hidden elements
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'; // block
    document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'none'; // block

    var rows1  =
    {
        PassengerId: CSVContainer.TYPE_ID,
        Survived: CSVContainer.TYPE_DISCRETE,
        Pclass: CSVContainer.TYPE_DISCRETE,
        Name: CSVContainer.TYPE_ID,
        Sex: CSVContainer.TYPE_DISCRETE,
        Age: CSVContainer.TYPE_CONTINUOUS,
        SibSp: CSVContainer.TYPE_DISCRETE,
        Parch: CSVContainer.TYPE_DISCRETE,
        Ticket: CSVContainer.TYPE_ID,
        Fare: CSVContainer.TYPE_CONTINUOUS,
        Cabin: CSVContainer.TYPE_DISCRETE,
        Embarked: CSVContainer.TYPE_DISCRETE
    };
    var rows2 = {
        date: CSVContainer.TYPE_DATE,
        node: CSVContainer.TYPE_DISCRETE,
        type: CSVContainer.TYPE_DISCRETE,
        variable: CSVContainer.TYPE_DISCRETE,
        value: CSVContainer.TYPE_CONTINUOUS
    }
    var rows = rows1;
    var file = DATA_URL + "titanic/titaniccomplete.csv";
    if (false){
        rows = rows2;
        file = DISTRIBUTION_SOURCE_FILE

    }
    dynamicDistributionObject = new CSVContainer(file,rows);
    dynamicDistributionObject.watch("loaded",function (id,oldValue,newValue) {
        console.log("ID: " + id + ". Old value: " + oldValue + ", new value: " + newValue);
        if (newValue){
            console.log("The data has been loaded")
//            dynamicDistributionObject.categorizedBy("Pclass");
//            dynamicDistributionObject.setPrimaryRow("Sex");
            setCategoryOptions(dynamicDistributionObject.getKeys());
            setPrimaryOptions(dynamicDistributionObject.getKeys());
//            document.getElementById("uno").selectedIndex = -1

            discreteGraphicProcess(dynamicDistributionObject);
//            discreteGraphicPaintF(dynamicDistributionObject)
        }
        return newValue;
    });

}


