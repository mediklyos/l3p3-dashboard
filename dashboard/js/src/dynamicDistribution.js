var DYNAMIC_DISTRIBUTION_CHART_DIV = "dynamic-distribution-chart-div";

var DYNAMIC_DISTRIBUTION_ATTRIBUTES_DIV = "dd-attributes-row";
var DYNAMIC_DISTRIBUTION_GRAPHICS_DIV = "dd-graphics-row";
var DYNAMIC_DISTRIBUTION_FILTERS_DIV = "dd-filters-row";





// *_COL_ID = Ids de los div donde se muestran los atributos
// *_FILTER = Ids de los div donde se muestran los filtros de los atributos
// *_PANEL_FILTER_ID = Id del panel de filtro
// *_ID_PREFIX = Prefijo para los botones que se usan para selecionar los atributos
// *_CLASS = Clase para los botones que se usan para selecionar los atributos
// *_ID_FILTER_ALL = Id del boton all/none en los filtros
// *_ID_PREFIX_FILTER = Prefijo para el id de los botones de los valores para los filtros de cada atributo
// *_ID_FILTER_CLASS = clase para los botones de los filtros
var DYNAMIC_DISTRIBUTION_POPULATION_SELECT_COL_ID = "dd-select-population";
var DYNAMIC_DISTRIBUTION_POPULATION_FILTER = "dd-filter-population";
var DYNAMIC_DISTRIBUTION_POPULATION_PANEL_FILTER = "dd-filter-population-panel-filter";
var BUTTON_POPULATION_ID_PREFIX = "dd-button-";
var BUTTON_POPULATION_CLASS = "dd-population-class";
var BUTTON_POPULATION_FILTER_CLASS = "dd-population-filter-class";
var BUTTON_POPULATION_ID_FILTER_ALL = "dd-population-filter-all";
var BUTTON_POPULATION_ID_PREFIX_FILTER = "dd-population-filter";
var BUTTON_POPULATION_CONT_REPRESENTATION_TYPE = "dd-cont-representation-type";

var DYNAMIC_DISTRIBUTION_FILTER_POPULATION_CLASS = "dd-filter-population-class";


var DYNAMIC_DISTRIBUTION_CATEGORY_SELECT_COL_ID = "dd-select-category-col";
var DYNAMIC_DISTRIBUTION_CATEGORY_FILTER = "dd-filter-category";
var DYNAMIC_DISTRIBUTION_CATEGORY_PANEL_FILTER = "dd-filter-category-panel-filter";
var BUTTON_CATEGORY_ID_PREFIX = "dd-category-";
var BUTTON_CATEGORY_CLASS = "dd-category-class";
var BUTTON_CATEGORY_ID_FILTER_ALL = "dd-category-filter-all";
var BUTTON_CATEGORY_ID_PREFIX_FILTER = "dd-category-filter";
var BUTTON_CATEGORY_FILTER_CLASS = "dd-category-filter-class";

var DYNAMIC_DISTRIBUTION_SECONDARY_SELECT_COL_ID = "dd-select-secondary-col";
var DYNAMIC_DISTRIBUTION_SECONDARY_FILTER = "dd-filter-secondary";
var DYNAMIC_DISTRIBUTION_SECONDARY_PANEL_FILTER_PREFIX = "dd-filter-secondary-panel-filter-";
var BUTTON_SECONDARY_ID_PREFIX = "dd-secondary-";
var BUTTON_SECONDARY_CLASS = "dd-secondary-class";
var BUTTON_SECONDARY_ID_FILTER_ALL_PREFIX = "dd-secondary-filter-all-";
var BUTTON_SECONDARY_ID_PREFIX_FILTER = "dd-secondary-filter-";
var BUTTON_SECONDARY_FILTER_CLASS_PREFIX = "dd-secondary-filter-class-";

var BUTTON_INPUT_FILE = "dd-input-button";
var UPLOAD_FORM = "dd-upload";
var BORDER_PROPORTION = 0.1;
var BUTTON_TYPE_DATA_SELECT = "dd-button-type-select";
var BUTTON_TYPE_DATA_TRASH = "dd-button-type-trash";
var BUTTON_ID_DATA_PREFIX = "dd-button-data-";
var DYNAMIC_DISTRIBUTION_DATABASE_ENTRY ="dd-database-entry";
var DYNAMIC_DISTRIBUTION_DATABASE_LIST ="dd-databases";

var DYNAMIC_DISTRIBUTION_COLUMNS_TYPES_PUP_UP_ID = "dd-cols-pup-up";
var DYNAMIC_DISTRIBUTION_BUTTONS_ATTR_TYPE_PREFIX = "dd-btns-attr-type-";

var DYNAMIC_DISTRIBUTION_CLASS_LIST_ATTRS = "dd-class-div-select-attr";

var DYNAMIC_DISTRIBUTION_CONTINUOUS_ACCUMULATED = "dd-accumulated"
var DYNAMIC_DISTRIBUTION_CONTINUOUS_DISTRIBUTION = "dd-distribution"

var populationFiltered = {}
var categoryFiltered = {};
var secondaryFilters = {};

var currentChart = null;

var continuousRepresentationType = null;

function graphicPaint (dynamicDistributionObject) {
    if (dynamicDistributionObject === undefined || dynamicDistributionObject.getPopulationColInfo() === undefined) {

        $("#"+DYNAMIC_DISTRIBUTION_CHART_DIV).empty();
//        $("#"+DYNAMIC_DISTRIBUTION_FILTERS_DIV).empty();
        return;
    }

    var populationInfo = dynamicDistributionObject.getPopulationColInfo();
    var populationType = populationInfo.type;
    if (populationType == CSVContainerForDistributions.TYPE_DISCRETE) {
        discreteGraphicPaint(dynamicDistributionObject)
    } else if (populationType == CSVContainerForDistributions.TYPE_CONTINUOUS) {
        continuousGraphicPaint (dynamicDistributionObject,continuousRepresentationType);
    }
}

function continuousGraphicPaint (dynamicDistributionObject,typeOfRepresentation){
    var populationInfo = dynamicDistributionObject.getPopulationColInfo();
    var populationCol = populationInfo.key;
    var dimension = populationInfo.dimension();
    var populationFiltered = getPopulationFiltered();
    var categoryCol = dynamicDistributionObject.getCategoryCol();

    // a veces salen desordenadas (cosas de los decimales)
    if ((populationFiltered[1] - populationFiltered[0]) < 0){
        var temp = populationFiltered[0];
        populationFiltered[0] = populationFiltered[1]
        populationFiltered[1] = temp;
    }
    var difference = populationFiltered[1] - populationFiltered[0]
    var min = (+populationFiltered[0]) - (difference * 0.05) ;
    var max = (+populationFiltered[1]) + (difference * 0.05);

    var compositeChart = dc.compositeChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);

    var charts = new Array;


    var color = 0;
    if (categoryCol === undefined || categoryCol == populationCol ||  categoryCol == ""){
        var lineChart = generateLinealChart(populationCol,typeOfRepresentation,color, compositeChart, populationFiltered[0],populationFiltered[1],undefined,undefined,secondaryFilters,dimension)
        charts.push(lineChart)
    } else {
        var categoryKeys = dynamicDistributionObject.getCategoryColInfo().keys;
        for (var key in categoryKeys) {
            if (categoryFiltered[categoryKeys[key]] === undefined) {
                var newChart = generateLinealChart(categoryKeys[key], typeOfRepresentation, color++, compositeChart, populationFiltered[0], populationFiltered[1], categoryKeys[key], categoryCol, secondaryFilters, dimension)
                charts.push(newChart)
            }
        }
    }
    var dim = calculateDimensions();

    compositeChart
        .width(dim.width)
        .height(dim.height)
        .x(d3.scale.linear().domain([min,max]))
        .yAxisLabel("Population")
        .renderHorizontalGridLines(true)
        .shareTitle(false)
        .compose(charts)
        .transitionDuration(0)
        .brushOn(false)
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))

    compositeChart.render();


}

function generateLinealChart (name,type,color,parent, start,end,categoryValue,categoryName,secondaryFilters,dimension){
    function reduceSumFunction (d) {
        for (var secKey in secondaryFilters) {
            if (secondaryFilters[secKey][d[secKey]]) {
                return 0
            }
        }
        if ((categoryName !== undefined) && (d[categoryName] != categoryValue)) {
            return 0;
        }
            return 1;
    }
    var newGroup = dimension.dimension.group().reduceSum(reduceSumFunction);
    var difference = parseFloat(end) - parseFloat(start)
    var min = parseFloat(start) - (difference * 0.05) ;
    var max = parseFloat(end) + (difference * 0.05);
    // process de groups
    var groups = newGroup.all();
    if (type == DYNAMIC_DISTRIBUTION_CONTINUOUS_ACCUMULATED){
        var accumulated = 0;
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].key == "null" ||
                groups[i].key == null ||
                (groups[i].key - start < 0) ||
                (groups[i].key - end > 0)) {
                groups.splice(i, 1)
                i--;

            } else {
                accumulated += groups[i].value;
                groups[i].value = accumulated;
            }

        }
        groups.splice(0, 0, {key: min, value: 0})
        groups.push({key: max, value: accumulated})
    } else {
        var newValues = []
        for (var i = 0; i < groups.length; i++) {
            for (var j = 0; j < groups[i].value;j++){
                if (groups[i].key == "null" ||
                    groups[i].key == null ||
                    (groups[i].key - start < 0) ||
                    (groups[i].key - end > 0)) {
                } else {
                    newValues.push(parseFloat(groups[i].key))
                }
            }
        }
        var size = newValues.length/dimension.size;
        var kde = science.stats.kde().sample(newValues);
        kde.bandwidth(science.stats.bandwidth.nrd0);
        var frequency = Math.abs(parseFloat(max) - parseFloat(min)) / 512
        var newData = kde(d3.range(min,max,frequency));
        newGroup.all().splice(0,newGroup.all().length);
        for (var i = 0; i < newData.length;i++){
            newGroup.all().push({key: newData[i][0],value: (newData[i][1]*size)})//*dimension.size)})//
        }
    }

    var lineChart
    lineChart = dc.lineChart(parent);
    lineChart
        .colors(myColors(color))
        .dimension(dimension.dimension)
        .group(newGroup, name)
        .brushOn(false)
        .title(function (d) {
            return d.key + ": " + d.value;
        })
    return lineChart;



}

function continuousFilter() {

}

function discreteGraphicPaint (dynamicDistributionObject) {

    // Comprobar que se ha selecionado la columna de categoria y de atributo primario
    // Si no hay ninguna categoria no mostrar nada tampoco se muestra nada
    var populationFiltered = getPopulationFiltered();

    if (dynamicDistributionObject.getPopulationCol() == undefined ||
        dynamicDistributionObject.getPopulationCol() == ""
        ){
        return;
    }


    var populationInfo = dynamicDistributionObject.getPopulationColInfo();
    var populationCol = populationInfo.key;
    var dimension = populationInfo.dimension();
    var categoryCol = dynamicDistributionObject.getCategoryCol();

    var compositeChart = dc.compositeChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);
    /**
     * Function reduce sum when there are not a category col selected
     * @param d
     * @returns {*}
     */
    function reduceSumFunctionReduced(d){
        return reduceSumFunction(undefined,d);
    }
    /**
     * Reduce function , must be called with bind with the population that is been reduced
     * @param cat
     * @param d
     * @returns {number}
     */
    function reduceSumFunction (cat,d) {
        for (var secKey in secondaryFilters){
            if (secondaryFilters[secKey][d[secKey]]) {
                return 0
            }
        }
        if ((cat !== undefined) && (d[this] != cat)){
            return 0;
        }
        if ((populationFiltered.indexOf(d[populationCol]) == -1) ){
            return 0;
        }else{
            return 1;
        }
    }




    var groupsReduced = new Object;



    // Filtrar tambien aqui porque si no lo suma y luego no sabe donde ponerlo
    var charts = new Array;

    // Si la categoria el atributo principal son el mismo se muestra la población de ese atributo
    //


    if (categoryCol == populationCol || categoryCol === undefined ||  categoryCol == ""){
        var group = dimension.dimension.group().reduceSum(reduceSumFunctionReduced);
        var color = 0;
        var newChart = dc.barChart(compositeChart)
            .colors(myColors(color++))
            .gap(0)
            .dimension(dimension.dimension)
            .group(group, populationCol)
            .brushOn(false)
            .title(function (d) {
                return d.key + ": " + d.value;
            })
        charts.push(newChart)

    }else {
        var categoryKeys = new Array;
        var color = 0;
        for (var key in dynamicDistributionObject.getCategoryColInfo().keys){
            key = dynamicDistributionObject.getCategoryColInfo().keys[key]
            if(!categoryFiltered[key]){
                categoryKeys.push(key);
            }
        }
        for (var key in categoryKeys) {
            groupsReduced[key] = dimension.dimension.group().reduceSum(reduceSumFunction.bind(categoryCol,categoryKeys[key]));
            var cat = categoryKeys[key];
            var newChart = dc.barChart(compositeChart)
                .colors(myColors(color++))
                .gap(0)
                .dimension(dimension.dimension)
                .group(groupsReduced[key], cat)
                .brushOn(false)
                .title(function (d) {
                    return "Population: "+d.key + "\nCategory: " + this + "\nAppearances: " + d.value;
                }.bind(cat))
            charts.push(newChart)
        }
    }

    var dim = calculateDimensions();
    var keys;
    if (populationFiltered.length == 0){
        keys = populationInfo.keys;
    } else {
        keys = populationFiltered;
    }
    compositeChart
        .width(dim.width)
        .height(dim.height)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal().domain(keys))
        .yAxisLabel("Population")
        .renderHorizontalGridLines(true)
        .shareTitle(false)
        .compose(charts)
        .transitionDuration(0)
        .brushOn(false)
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))



    compositeChart
        .renderlet(function (chart) {
            if (charts.length > 0) {
                // Este código mueve las columnas del gráfico para que se vean todas correctamente
                var boxes = chart.selectAll("rect.bar");
                var width = boxes.attr("width");
                var border = Math.floor(width * BORDER_PROPORTION);
                var width_borderless = width - border * 2;
                var category_col_width = Math.floor(width_borderless / charts.length);
                boxes.attr("width", category_col_width);
                for (var i = 0; i < charts.length; i++) {
                    var element_name = "g._" + i;
                    var movement = category_col_width * i + border / 2;
                    var translate_cad = "translate(" + movement + ", 0)"
                    chart.selectAll(element_name).attr("transform", translate_cad);
                }
            }
        });
    compositeChart.render();
}

/**
 * set a new population attribute. This routine contains all actions needed to set this population.
 * @param newPopulation
 */
function setPopulation(newPopulation){
    var prevPopulation = dynamicDistributionObject.getPopulationCol();

    if (newPopulation == "") {
        $("#"+DYNAMIC_DISTRIBUTION_POPULATION_FILTER).empty();
        $("."+BUTTON_POPULATION_CLASS).toggleClass('active',false)

    } else if (newPopulation != prevPopulation){
        // Active only one population
        $("."+BUTTON_POPULATION_CLASS).removeClass("active");
        $(document.getElementById(BUTTON_POPULATION_ID_PREFIX + newPopulation)).addClass("active")
        dynamicDistributionObject.categorizedBy(newPopulation);
        var populationInfo = dynamicDistributionObject.getPopulationColInfo();
        var populationType = populationInfo.type;
        if (populationType == undefined) {
            document.getElementById(DYNAMIC_DISTRIBUTION_POPULATION_FILTER).innerHTML = "";
            return;
        } else if (populationType == CSVContainerForDistributions.TYPE_DISCRETE) {
            setPopulationFilterList(populationInfo.keys);


            populationFiltered = {};
            $("."+BUTTON_POPULATION_FILTER_CLASS).addClass("active")
            for (var key in populationInfo.keys){
                populationFiltered[populationInfo.keys[key]] = true;
            }
            graphicPaint(dynamicDistributionObject)
        } else if (populationType == CSVContainerForDistributions.TYPE_CONTINUOUS) {

            populationFiltered = {};
            for (var key in populationInfo.keys){
                populationFiltered[populationInfo.keys[key]] = true;
            }

            setPopulationFilterBar(populationInfo.keys);
            graphicPaint(dynamicDistributionObject)
        }
    }
}

/**
 * Create a panel with the buttons with all categories
 * @param keys
 */
function setPopulationList(keys) {
    //removeResizingWatcher(DYNAMIC_DISTRIBUTION_POPULATION_SELECT_COL_ID)
    $("#"+DYNAMIC_DISTRIBUTION_POPULATION_SELECT_COL_ID).empty();
    createPanelButtons("Population attribute",undefined,DYNAMIC_DISTRIBUTION_POPULATION_SELECT_COL_ID,keys,BUTTON_POPULATION_CLASS,BUTTON_POPULATION_ID_PREFIX,setPopulation);
}


/**
 * Function contains the routines executed when a population value is clicked
 * @param population
 */
function clickOnPopulationFilter(population) {
    populationFiltered[population] =!populationFiltered[population];
    $(document.getElementById(BUTTON_POPULATION_ID_PREFIX_FILTER+population)).toggleClass("active")
    $("#"+BUTTON_POPULATION_ID_FILTER_ALL).removeClass("active")


    graphicPaint(dynamicDistributionObject)
}

function clickOkPopulationSliderFilter(start,end){
    populationFiltered = {}
    populationFiltered[start] = true;
    populationFiltered[end] = true;
    graphicPaint(dynamicDistributionObject)

}

/**
 * Create a panel with all population values
 * @param keys
 * @returns {*}
 */
function setPopulationFilterList(keys){

    var title = 'Population filter ('+dynamicDistributionObject.getPopulationCol()+')';
    $("#"+DYNAMIC_DISTRIBUTION_POPULATION_FILTER).empty();
    var panel = createPanelButtons(title,undefined,DYNAMIC_DISTRIBUTION_POPULATION_FILTER,keys,BUTTON_POPULATION_FILTER_CLASS,BUTTON_POPULATION_ID_PREFIX_FILTER,clickOnPopulationFilter)
    var body = panel.find(".panel-body")
    // Space to separate buttons
    body.append(" ")
    var button_all_group= jQuery('<div/>', {
            class: 'btn-group'
        }
    ).appendTo(body);

    // Adding "All" button
    jQuery('<button/>',{
        id : BUTTON_POPULATION_ID_FILTER_ALL,
        onclick:clickOnPopulationFilterAllNone.name+"()",
        text: "All/None",
        type: 'button',
        class: 'btn btn-default active'
    }).appendTo(button_all_group);

    return panel;
}

function setPopulationFilterBar(keys){

    var title = 'Population filter ('+dynamicDistributionObject.getPopulationCol()+')';
    $("#"+DYNAMIC_DISTRIBUTION_POPULATION_FILTER).empty();
//    var panel = createPanelButtons(title,undefined,DYNAMIC_DISTRIBUTION_POPULATION_FILTER,keys,BUTTON_POPULATION_FILTER_CLASS,BUTTON_POPULATION_ID_PREFIX_FILTER,clickOnPopulationFilter)
//    title, id, parentId , keys, buttonsClass,buttons_id_prefix,callback,buttonAttr
    var panel = createSliderPanel(title,undefined,DYNAMIC_DISTRIBUTION_POPULATION_FILTER,keys,BUTTON_POPULATION_FILTER_CLASS,BUTTON_POPULATION_ID_PREFIX_FILTER,clickOkPopulationSliderFilter);
    var body = panel.find(".panel-body")
    continuousRepresentationType = DYNAMIC_DISTRIBUTION_CONTINUOUS_DISTRIBUTION;
    var selectRepresentationTypeButton = jQuery('<button/>',{
            id : BUTTON_POPULATION_CONT_REPRESENTATION_TYPE,
            text: "Prov/Acc",
            class: 'btn btn-default active'
        }).appendTo(body)
    selectRepresentationTypeButton.click(setContinuousType)
    selectRepresentationTypeButton.appendTo(body);
    return panel;
}

function setContinuousType (){
    continuousRepresentationType = ($("#"+BUTTON_POPULATION_CONT_REPRESENTATION_TYPE).toggleClass('active').hasClass('active'))?DYNAMIC_DISTRIBUTION_CONTINUOUS_DISTRIBUTION:DYNAMIC_DISTRIBUTION_CONTINUOUS_ACCUMULATED;
    graphicPaint(dynamicDistributionObject)

}

/**
 * Function that contains the routine of all/none button
 */
function clickOnPopulationFilterAllNone(){
    $(document.getElementById(BUTTON_POPULATION_ID_FILTER_ALL)).toggleClass("active")
    var result = $("#"+BUTTON_POPULATION_ID_FILTER_ALL).hasClass("active");
    $("."+BUTTON_POPULATION_FILTER_CLASS).toggleClass("active",result);
    for (var key in populationFiltered){
        populationFiltered[key] = result;
    }
    graphicPaint(dynamicDistributionObject)
}

/**
 * get all categories that are not filtered
 * @returns {Array}
 */
function getPopulationFiltered(){
    var population = new Array
    for (var key in populationFiltered ){
        if (populationFiltered[key]){
            population.push(key);
        }
    }
    return population;
}

// CATEGORY ATTRIBUTE FUNCTIONS
function setCategoryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_CATEGORY_SELECT_COL_ID).empty();
    createPanelButtons("Category attribute",undefined,DYNAMIC_DISTRIBUTION_CATEGORY_SELECT_COL_ID,keys,BUTTON_CATEGORY_CLASS,BUTTON_CATEGORY_ID_PREFIX,setCategory)
}

function setCategory(newCategory){
    var prevCategory = dynamicDistributionObject.getCategoryColInfo();
    var cleanCategoryFunction = function () {
        $("."+BUTTON_CATEGORY_CLASS).toggleClass("active",false)
        dynamicDistributionObject.setCategoryCol(undefined);
        categoryFiltered = undefined;
        $("#"+DYNAMIC_DISTRIBUTION_CATEGORY_FILTER).empty();
    }
    var newCategoryFunction = function () {
        // Active only one category
        $("."+BUTTON_CATEGORY_CLASS).removeClass("active");
        $(document.getElementById(BUTTON_CATEGORY_ID_PREFIX + newCategory)).addClass("active")
        dynamicDistributionObject.setCategoryCol(newCategory);

        var categoryColInfo = dynamicDistributionObject.getCategoryColInfo();
        var categoryType = categoryColInfo.type;

        if (categoryType == undefined) {
            document.getElementById(DYNAMIC_DISTRIBUTION_CATEGORY_FILTER).innerHTML = "";
            return;
        } else if (categoryType == CSVContainerForDistributions.TYPE_DISCRETE) {
            setCategoryFilterList(categoryColInfo.keys);
            categoryFiltered = new Object;
            $("."+BUTTON_CATEGORY_FILTER_CLASS).addClass("active")
        }

    }

    if (newCategory == ""){
        cleanCategoryFunction();
    }
    else if(prevCategory === undefined || prevCategory.key != newCategory){
        newCategoryFunction();
    }
    else if (newCategory == "" || newCategory == prevCategory.key ){
        cleanCategoryFunction();
    }
    graphicPaint(dynamicDistributionObject)

}

function setCategoryFilterList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_CATEGORY_FILTER).empty();
    var panel = createPanelButtons("Category filter ("+dynamicDistributionObject.getCategoryCol()+")",undefined,DYNAMIC_DISTRIBUTION_CATEGORY_FILTER,keys,BUTTON_CATEGORY_FILTER_CLASS ,BUTTON_CATEGORY_ID_PREFIX_FILTER ,clickOnCategoryFilter);
    var body = panel.find(".panel-body");
    body.append(" ");
    var button_all_group= jQuery('<div/>', {
            class: 'btn-group'
        }
    ).appendTo(body);
    jQuery('<button/>',{
        id : BUTTON_CATEGORY_ID_FILTER_ALL,
        onclick:clickOnCategoryAllNone.name +"()",
        text: "All/None",
        type: 'button',
        class: 'btn btn-default active'
    }).appendTo(button_all_group)


}

function clickOnCategoryFilter (attribute){
    if (categoryFiltered[attribute] === undefined){
        categoryFiltered[attribute] = true;
    } else {
        delete categoryFiltered[attribute];
    }
    $("#"+BUTTON_CATEGORY_ID_FILTER_ALL).toggleClass("active",false);
    // Se ha hecho así por si el atributo tiene caracteres prohibidos para jQuery como "." y "/"
    $(document.getElementById(BUTTON_CATEGORY_ID_PREFIX_FILTER+attribute)).toggleClass("active")
    graphicPaint(dynamicDistributionObject)

}


function clickOnCategoryAllNone(){
    $(document.getElementById(BUTTON_CATEGORY_ID_FILTER_ALL)).toggleClass("active")
    var result = $("#"+BUTTON_CATEGORY_ID_FILTER_ALL).hasClass("active");
    $("."+BUTTON_CATEGORY_FILTER_CLASS).toggleClass("active",result);
    var keys = dynamicDistributionObject.getCategoryColInfo().keys;
    for (var key in keys){
        if (result) {
            delete categoryFiltered[keys[key]];
        } else {
            categoryFiltered[keys[key]] = true;
        }
    }
    graphicPaint(dynamicDistributionObject)
}


// SECONDARY ATTRIBUTES FUNCTIONS
function setSecondaryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_SECONDARY_SELECT_COL_ID).empty();
    createPanelButtons("Additional filters",undefined,DYNAMIC_DISTRIBUTION_SECONDARY_SELECT_COL_ID,keys,BUTTON_SECONDARY_CLASS,BUTTON_SECONDARY_ID_PREFIX,setSecondary)
}

function setSecondary(attribute){
    $(document.getElementById(BUTTON_SECONDARY_ID_PREFIX+attribute)).toggleClass("active")
    var activeStatus = $(document.getElementById(BUTTON_SECONDARY_ID_PREFIX+attribute)).hasClass("active")
    var panel;
    if (activeStatus){

        var keys = dynamicDistributionObject.getAttributeInfo(attribute).keys;
        panel = createPanelButtons("Filter by "+attribute,DYNAMIC_DISTRIBUTION_SECONDARY_PANEL_FILTER_PREFIX+attribute,DYNAMIC_DISTRIBUTION_SECONDARY_FILTER,keys,BUTTON_SECONDARY_FILTER_CLASS_PREFIX+attribute,BUTTON_SECONDARY_ID_PREFIX_FILTER+attribute+"-",clickOnSecondaryFilter,{selfAttribute:attribute})
        var body = panel.find(".panel-body");
        body.append(" ");
        var button_all_group= jQuery('<div/>', {
                class: 'btn-group'
            }
        ).appendTo(body);
        jQuery('<button/>',{
            id : BUTTON_SECONDARY_ID_FILTER_ALL_PREFIX+attribute,
            onclick:"clickOnSecondaryAllNone(\""+attribute+"\")",
            text: "All/None",
            type: 'button',
            class: 'btn btn-default active'
        }).appendTo(button_all_group)
        secondaryFilters[attribute] = new Object
        $("."+BUTTON_SECONDARY_FILTER_CLASS_PREFIX+attribute).addClass("active");
    } else {
        panel = document.getElementById(DYNAMIC_DISTRIBUTION_SECONDARY_PANEL_FILTER_PREFIX+attribute);
        delete secondaryFilters[attribute];
        if (panel!== undefined){
            removeResizingWatcher(DYNAMIC_DISTRIBUTION_SECONDARY_PANEL_FILTER_PREFIX+attribute)
            panel.parentNode.removeChild(panel);
        }
        graphicPaint(dynamicDistributionObject)
    }
}

function removeAllSecondaries(){
    $("#"+DYNAMIC_DISTRIBUTION_SECONDARY_FILTER).empty();
    $("."+BUTTON_SECONDARY_CLASS).toggleClass('active',false)
    secondaryFilters = {}
}

function clickOnSecondaryAllNone(col){
    $(document.getElementById(BUTTON_SECONDARY_ID_FILTER_ALL_PREFIX+col)).toggleClass("active")
    var result = $(document.getElementById(BUTTON_SECONDARY_ID_FILTER_ALL_PREFIX+col)).hasClass("active");
    $(document.getElementsByClassName(BUTTON_SECONDARY_FILTER_CLASS_PREFIX+col)).toggleClass("active",result);
    var keys = dynamicDistributionObject.getAttributeInfo(col).keys;
    for (var key in keys){
        if (result) {
            delete secondaryFilters[col][keys[key]];
        } else {
            secondaryFilters[col][keys[key]] = true;
        }
    }
    graphicPaint(dynamicDistributionObject);
}

function clickOnSecondaryFilter (attribute) {
    // Extraer el id porque no puedo pasarlo directamente, el id esta tres niveles de etiquetas encima
    var idClicked = $(event.target).attr('selfAttribute');
    if(secondaryFilters[idClicked][attribute]){
        delete secondaryFilters[idClicked][attribute];
    } else {
        $(document.getElementById(BUTTON_SECONDARY_ID_FILTER_ALL_PREFIX+idClicked)).toggleClass("active",false)
        secondaryFilters[idClicked][attribute] = true;
    }
    // Se ha hecho así por si el atributo tiene caracteres prohibidos para jQuery como "." y "/"
    $(document.getElementById(BUTTON_SECONDARY_ID_PREFIX_FILTER+idClicked+"-"+attribute)).toggleClass("active")
    graphicPaint(dynamicDistributionObject)
}

function createPanelButtons(title, id, parentId , keys, buttonsClass,buttons_id_prefix,callback,buttonAttr){
//    removeResizingWatcher(parentId);
    var panel = jQuery('<div/>',{
           class : "panel panel-default",
           id : id
        }
    ).appendTo("#"+parentId);
    var panelHeader = jQuery('<div/>', {
            class: "panel-heading",
            text: title
        }
    ).appendTo(panel);
    var panelBody = jQuery('<div/>', {
        class: 'panel-body'
    }).appendTo(panel);
    var panelButtons = jQuery('<div/>', {
        class: 'btn-group'
    }).appendTo(panelBody);
    var pos = {top:-1, left:-1}
    $.each(keys,function(){
        var text = this;
        if (text == "") text = "#blank";
        if (buttonAttr === undefined) {
            buttonAttr = new Object
        }
        buttonAttr['type'] = 'button';
        buttonAttr['class'] = 'btn btn-default '+buttonsClass;
        buttonAttr['id'] = buttons_id_prefix + this;
        buttonAttr['text'] = text;
        buttonAttr['onclick'] = callback.name+'("' + this + '")';

        var button = jQuery('<button/>',buttonAttr ).appendTo(panelButtons);
        var actualPos = button.offset()
        if (pos.left > actualPos.left){
            button.detach();
            panelButtons = jQuery('<div/>', {
                class: 'btn-group'
            }).appendTo(panelBody);
            button.appendTo(panelButtons)
            pos = {top:-1, left:-1}
        }else {
            pos = actualPos;
        }

    })
    var func = function(buttonsClass,oldDimensions,event){
        var prevWidth = oldDimensions.width;
        var actualWidth = event.target.offsetWidth
        if (prevWidth != actualWidth) {
            var buttons = this.find("."+buttonsClass);
//            this.find("."+buttonsClass).remove();
            buttons.detach();
            buttons.detach();
//            var panelButtons =
            var panelsToAddAfter = []
            this.find(".btn-group").each(function(pos,btnGroup){
                if (btnGroup.childElementCount != 0){
                    panelsToAddAfter.push(btnGroup);
                } else {
                    btnGroup.remove()
                }
            })
            var panelButtons = jQuery('<div/>', {
                class: 'btn-group'
            }).appendTo(panelBody);
            var buttonPos = {top:-1, left:-1}
            $.each(buttons,function(pos){
                var button = $(buttons[pos]);
                button.appendTo(panelButtons);
                var actualPos = button.offset()
                if (buttonPos.left > actualPos.left){
                    button.detach();
                    panelButtons = jQuery('<div/>', {
                        class: 'btn-group'
                    }).appendTo(panelBody);
                    button.appendTo(panelButtons)
                    buttonPos = {top:-1, left:-1}
                }else {
                    buttonPos = actualPos;
                }

            })

            panelBody.append(panelsToAddAfter)
        }
    }.bind(panel,buttonsClass)
    resizingWatcher(panel,func)
    return panel;
}


function createSliderPanel(title, id, parentId , keys, buttonsClass,buttons_id_prefix,callback,buttonAttr){
    // TODO saltos
    var leftValue = Math.floor(keys[0]);
    var rightValue = Math.ceil(keys[1])
    var leftLength = (""+leftValue).length
    var rightLength = (""+rightValue).length
    var length = (leftLength > rightLength)?leftLength:rightLength;
    var panel = jQuery('<div/>',{
            class : "panel panel-default",
            id : id
        }
    ).appendTo("#"+parentId);
    resizingWatcher(panel,function(oldSize,event){
        if (oldSize.width != event.target.offsetWidth){
            var children = this.find(".panel-body").children();
            var width= 0;
            $.each(children,function (pos,child){
                if (!$(child).hasClass("ui-slider")){
                    width += $(child).outerWidth(true);
                }
            })
            $(event.target.parentNode).find(".panelBody")
            var newSliderWidth = this.width() - width;
            slider.css('width',newSliderWidth)
        }

    }.bind(panel))

    var panelHeader = jQuery('<div/>', {
            class: "panel-heading",
            text: title
        }
    ).appendTo(panel);
    var panelBody = jQuery('<div/>', {
        class: 'panel-body slider-panel'
    }).appendTo(panel);
    panelBody.append('<div style="width:'+(length*7)+'px" id="'+buttons_id_prefix+'left">'+leftValue+'</div>')

    var slider = jQuery('<div/>').slider({
        range: true,
        min: leftValue,
        max: rightValue,
        values: [leftValue,rightValue],
        slide: function (event,ui) {
            $("#"+buttons_id_prefix+"left").text(ui.values[0])
            $("#"+buttons_id_prefix+"right").text(ui.values[1])
        },
        stop : function (event, ui){
            callback(ui.values[0],ui.values[1])
        }
    }).appendTo(panelBody);
    var sliderWidth = panel.offsetWidth /2;
    slider.css('width',sliderWidth)
    panelBody.append('<div id="'+buttons_id_prefix+'right">'+rightValue+'</div>')

    return panel;
}
var color20 = d3.scale.category20();
function myColors(pos){
    pos = pos % 20;
    return color20(pos);
}

function reset(){
    dynamicDistributionObject.init(dynamicDistributionObject.src,dynamicDistributionObject.keys)
    setPopulation("");
    setCategory("")
    removeAllSecondaries();
    graphicPaint()
}

function clearPanel(){
    $("#titanic-button").removeAttr("active")
    $("#events-button").removeAttr("active")
}

function upload(){
    $("#"+BUTTON_INPUT_FILE).click();
}

function postLoad() {
// Drag and drop code
    $('#'+UPLOAD_FORM).fileupload({
        // This element will accept file drag/drop uploading
        dropZone: $('#dd-dropArea'),
        add: function (e, data) {
            console.log("add")
            for (var key in data.files) {
                var file = data.files[key];
                processNewFile(file);

            }
        },

        progress: function(e, data){
            console.log("progress")
        },

        fail:function(e, data){
            console.log("Error")
        }

    });
}


function processNewFile(file) {
    var name = file.name;
    var reader = new FileReader();
    reader.onload = function(fileName,e) {
        console.log("database readed");
        filesInMemory[fileName] = new Object;
        filesInMemory[fileName].data = d3.csv.parse(e.target.result);
        if (filesInMemory[fileName].data.length > 0) {
            var keys = new Array
            for (var key in filesInMemory[fileName].data[0]) {
                keys.push(key);
            }
            filesInMemory[fileName].colsTypes = pupUpCols(keys);
        }
        jQuery('<div/>', {
            class: "btn-group " + DYNAMIC_DISTRIBUTION_DATABASE_ENTRY
        }).append(jQuery('<a/>', {
            class: "btn btn-default " + BUTTON_TYPE_DATA_SELECT,
            onclick: 'setData("' + fileName + '")',
            id: BUTTON_ID_DATA_PREFIX + fileName,
            text: fileName
        })).append(jQuery('<a/>', {
            class: "btn btn-default " + BUTTON_TYPE_DATA_TRASH,
            onclick: 'deleteData(\''+fileName+'\')'
        }).append('<span class="glyphicon glyphicon-trash"></span>'))
            .appendTo("#" + DYNAMIC_DISTRIBUTION_DATABASE_LIST)
    }.bind(this,name)
    reader.readAsText(file);
}


function loadDataSetFromUrl(url,columns ){
    $.get(url,{},function (data) {
        filesInMemory[url] = new Object;
        filesInMemory[url].data = d3.csv.parse(data);
        if (filesInMemory[url].data.length > 0){
            var keys = new Array
            for (var key in filesInMemory[url].data[0]){
                keys.push(key);
            }
        }
        if (columns !== undefined){
            filesInMemory[url].colsTypes = columns;
        } else {
            filesInMemory[url].colsTypes = {
                date: CSVContainerForDistributions.TYPE_DATE,
                node: CSVContainerForDistributions.TYPE_DISCRETE,
                type: CSVContainerForDistributions.TYPE_DISCRETE,
                variable: CSVContainerForDistributions.TYPE_DISCRETE,
                value: CSVContainerForDistributions.TYPE_CONTINUOUS
            }
        }
    })
}

function pupUpCols(cols) {
    var oldPanel = document.getElementById(DYNAMIC_DISTRIBUTION_COLUMNS_TYPES_PUP_UP_ID);
    if (oldPanel != null){
        oldPanel.parentNode.removeChild(oldPanel);
    }
    var title = "Attributes"
    var body = $('<ul class="list-group"/>');
    var colTypes = new Object;

    for (var key in cols){
        colTypes[cols[key]] = CSVContainerForDistributions.TYPE_ID;
        var entry = $('<li class="row list-group-item"/>');
        var buttons = $('<div class="btn-group btn-toggle col-lg-7" data-toggle="buttons"/>');
        buttons.attr('id',DYNAMIC_DISTRIBUTION_BUTTONS_ATTR_TYPE_PREFIX+cols[key]);
        buttons.click(toggleButtonsFunction.bind(undefined,DYNAMIC_DISTRIBUTION_BUTTONS_ATTR_TYPE_PREFIX+cols[key],function(attribute,value){
            colTypes[attribute] = value;
        }));
        var buttonA = $('<label class="btn btn-primary active">' +
            '<input name="'+cols[key]+'" value="'+CSVContainerForDistributions.TYPE_ID+'" checked="" type="radio">'+ CSVContainerForDistributions.TYPE_ID +
            '</label>')
        var buttonB = $('<label class="btn btn-default">' +
            '<input name="'+cols[key]+'" value="'+CSVContainerForDistributions.TYPE_DISCRETE+'" type="radio">'+ CSVContainerForDistributions.TYPE_DISCRETE +
            '</label>')
        var buttonC =$('<label class="btn btn-default">' +
            '<input name="'+cols[key]+'" value="'+CSVContainerForDistributions.TYPE_DATE+'" checked="" type="radio">'+ CSVContainerForDistributions.TYPE_DATE +
            '</label>')
        var buttonD =$('<label class="btn btn-default">' +
            '<input name="'+cols[key]+'" value="'+CSVContainerForDistributions.TYPE_CONTINUOUS+'" type="radio">' + CSVContainerForDistributions.TYPE_CONTINUOUS +
            '</label>')
        buttons.append(buttonA)
        buttons.append(buttonB)
        buttons.append(buttonC)
        buttons.append(buttonD)
        $('<div/>',{text:cols[key],class:"col-lg-4 "+DYNAMIC_DISTRIBUTION_CLASS_LIST_ATTRS}).appendTo(entry);

        buttons.appendTo(entry)
        entry.appendTo(body);
    }

    var footer =
        '<button type="button" class="btn btn-primary btn-default" data-dismiss="modal">Close</button>'
    var panel =createPupUp(DYNAMIC_DISTRIBUTION_COLUMNS_TYPES_PUP_UP_ID,title, body,footer);
    $(panel).appendTo('body');
    $(panel).modal('show');
    return colTypes;
}

function setData(name){
    if ($("."+BUTTON_TYPE_DATA_SELECT+".active").length > 0){
        reset()
    }
    $("."+BUTTON_TYPE_DATA_SELECT).removeClass("active")
    $(document.getElementById(BUTTON_ID_DATA_PREFIX + name)).addClass("active")
    var file = name;
    runDynamicDistribution(file);
}

function deleteData(name){
    var div = document.getElementById(BUTTON_ID_DATA_PREFIX + name).parentNode;
    if ($(document.getElementById(BUTTON_ID_DATA_PREFIX + name)).hasClass('active')){
        clearPanel();
    }

    delete filesInMemory[name];
    div.parentNode.removeChild(div);

}

function onLoadedCSV() {
    console.log("The new data has been loaded")
    var PopulationKeysList = [];
    var CategoryKeysList = [];
    var SecondaryKeysList = []
    for (var key in dynamicDistributionObject.getKeys()){
        if (dynamicDistributionObject.getKeys()[key] == CSVContainerForDistributions.TYPE_DISCRETE) {
            PopulationKeysList.push(key)
            SecondaryKeysList.push(key)
            CategoryKeysList.push(key)
        } else if (dynamicDistributionObject.getKeys()[key] == CSVContainerForDistributions.TYPE_CONTINUOUS) {
            PopulationKeysList.push(key)
            SecondaryKeysList.push(key)
        }
    }
    setPopulationList(PopulationKeysList);
    setCategoryList(CategoryKeysList);
    setSecondaryList(SecondaryKeysList);
}

function calculateDimensions(){
    var totalWidth = window.innerWidth;
    var totalHeight = window.innerHeight;
    var position = $("#"+DYNAMIC_DISTRIBUTION_CHART_DIV).offset();
    var height = totalHeight - position.top;
    if  (height < 100) {
        height = totalHeight*0.8;
    }
    var positionFilters = $("#"+DYNAMIC_DISTRIBUTION_FILTERS_DIV).offset()
    var width = positionFilters.left - position.left;
    if (width < 100) {
        width = totalWidth
    }
    return {width: width*0.95, height: height*0.95}

}


// resizing routines
//
function resizingWatcher(jqElement,resizingRoutine){
    jqElement.resize(resizingRoutine)
}

function removeResizingWatcher(elementId){
    $("#dd-select-population").children("div.resize-triggers").remove()
    return;
}


window.onresize = function () {
    graphicPaint(dynamicDistributionObject)
}