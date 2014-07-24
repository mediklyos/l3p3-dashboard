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
var DYNAMIC_DISTRIBUTION_DROP_AREA = "dd-dropArea";
var BORDER_PROPORTION = 0.1;
var CHART_WIDTH = $(window).width() * 0.96;
var BUTTON_TYPE_DATA_SELECT = "dd-button-type-select";
var BUTTON_TYPE_DATA_TRASH = "dd-button-type-trash";
var BUTTON_ID_DATA_PREFIX = "dd-button-data-";
var DYNAMIC_DISTRIBUTION_DATABASE_ENTRY ="dd-database-entry";
var DYNAMIC_DISTRIBUTION_DATABASE_LIST ="dd-databases";

var DYNAMIC_DISTRIBUTION_COLUMNS_TYPES_PUP_UP_ID = "dd-cols-pup-up";
var DYNAMIC_DISTRIBUTION_BUTTONS_ATTR_TYPE_PREFIX = "dd-btns-attr-type-";

var DYNAMIC_DISTRIBUTION_CLASS_LIST_ATTRS = "dd-class-div-select-attr";



var populationFiltered = new Object;
var categoryFiltered = new Object;
var secondaryFilters = new Object;

function discreteGraphicPaint (dynamicDistributionObject) {

    // Comprobar que se ha selecionado la columna de categoria y de atributo primario
    // Si no hay ninguna categoria no mostrar nada tampoco se muestra nada
    var categoriesFiltered = getCategoriesFiltered();
    var categoryColInfo = dynamicDistributionObject.getCategoryColInfo();
    var emptySecondary = false;
    var emptyCategory = false;//(categoryColInfo !== undefined) && (false || (Object.keys(categoryFiltered).length == 0))

    if (dynamicDistributionObject.getPopulationCol() == undefined ||
        dynamicDistributionObject.getPopulationCol() == "" ||
        categoriesFiltered.length == 0 || emptyCategory || emptySecondary
        ){
        document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'
        return;
    }
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'block'
    document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'block'


    var populationInfo = dynamicDistributionObject.getPopulationColInfo();
    var populationCol = populationInfo.key;
    var dimension = populationInfo.dimension();
    var categoryCol = dynamicDistributionObject.getCategoryCol();


    if (populationInfo.type == CSVContainerForDistributions.TYPE_CONTINUOUS ){
        var lineChart = dc.lineChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);
        var group = dimension.dimension.group();
        var values = new Object;
        var group2 = group.reduce(
            // add
            function (p, v) {
                if (v[populationCol] == "" || categoriesFiltered[0] >= v[populationCol] || categoriesFiltered[1] <= v[populationCol]){
                    return p;
                }
                if (p[v[populationCol]] === undefined){
                    p[v[populationCol]] = 0;
                }
                p[v[populationCol]]++;
                return p;
            },

            function (p, v) {
                return p - 1;
            },

            function () {
                return values;
            }.bind(values)
        )
        var difenrence = categoriesFiltered[1] - categoriesFiltered[0]
        var min = categoriesFiltered[0] - (difenrence * 0,1);
        var max = categoriesFiltered[1] + (difenrence * 0,1);

        lineChart
            .width(CHART_WIDTH)
            .height(300)
            .x(d3.scale.linear().domain([min,max]))
            .yAxisLabel("Population")
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            .dimension(dimension.dimension)
            .group(group2)
            .brushOn(false)
            .valueAccessor(function (d){
                var accumulated = 0;
                for (var key in d.value){
                    if (key <= d.key) {
                        accumulated += d.value[key];
//                    } else if (key == d.key) {
//                        accumulated += d.value[key];
//                        return accumulated;
//
                    }

                }
                return accumulated;
            })
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        lineChart.render();

        return;
    }
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
        Math.get
        if ((categoriesFiltered.indexOf(d[populationCol]) == -1) ){
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
        }
        for (var key in categoryKeys) {
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
    compositeChart
        .width(CHART_WIDTH)
        .height(300)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal().domain(categoriesFiltered))
        .yAxisLabel("Population")
        .renderHorizontalGridLines(true)
//        .renderVerticalGridLines(true)
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
            discreteGraphicPaint(dynamicDistributionObject)
        } else if (populationType == CSVContainerForDistributions.TYPE_CONTINUOUS) {
            populationFiltered = {};
            for (var key in populationInfo.keys){
                populationFiltered[populationInfo.keys[key]] = true;
            }

            setPopulationFilterBar(populationInfo.keys);
            discreteGraphicPaint(dynamicDistributionObject)
        }
    }
}

/**
 * Create a panel with the buttons with all categories
 * @param keys
 */
function setPopulationList(keys) {
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


    discreteGraphicPaint(dynamicDistributionObject)
}

/**
 * Create a panel with all population values
 * @param keys
 * @returns {*}
 */
function setPopulationFilterList(keys){

    var title = 'Categories ('+dynamicDistributionObject.getPopulationCol()+')';
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
        onclick:"clickOnPopulationFilterAllNone()",
        text: "All/None",
        type: 'button',
        class: 'btn btn-default active'
    }).appendTo(button_all_group);

    return panel;
}

function setPopulationFilterBar(keys){

    var title = 'Categories ('+dynamicDistributionObject.getPopulationCol()+')';
    $("#"+DYNAMIC_DISTRIBUTION_POPULATION_FILTER).empty();
//    var panel = createPanelButtons(title,undefined,DYNAMIC_DISTRIBUTION_POPULATION_FILTER,keys,BUTTON_POPULATION_FILTER_CLASS,BUTTON_POPULATION_ID_PREFIX_FILTER,clickOnPopulationFilter)
//    title, id, parentId , keys, buttonsClass,buttons_id_prefix,callback,buttonAttr
    var panel = createSliderPanel(title,undefined,DYNAMIC_DISTRIBUTION_POPULATION_FILTER,keys,BUTTON_POPULATION_FILTER_CLASS,BUTTON_POPULATION_ID_PREFIX_FILTER,function(){});
    var body = panel.find(".panel-body")
    return panel;
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
    discreteGraphicPaint(dynamicDistributionObject)
}

/**
 * get all categories that are not filtered
 * @returns {Array}
 */
function getCategoriesFiltered(){
    var categories = new Array
    for (var key in populationFiltered ){
        if (populationFiltered[key]){
            categories.push(key);
        }
    }
    return categories;
}

// CATEGORY ATTRIBUTE FUNCTIONS
function setCategoryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_CATEGORY_SELECT_COL_ID).empty();
    createPanelButtons("Category attribute",undefined,DYNAMIC_DISTRIBUTION_CATEGORY_SELECT_COL_ID,keys,BUTTON_CATEGORY_CLASS,BUTTON_CATEGORY_ID_PREFIX,setCategory)
}

function setCategory(newCategory){
    var prevCategory = dynamicDistributionObject.getCategoryColInfo();
    var cleanCategoryFunction = function () {
        $(document.getElementById(BUTTON_CATEGORY_ID_PREFIX + newCategory)).toggleClass("active")
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
    discreteGraphicPaint(dynamicDistributionObject)

}

function setCategoryFilterList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_CATEGORY_FILTER).empty();
    var panel = createPanelButtons("Category attribute  ("+dynamicDistributionObject.getCategoryCol()+")",undefined,DYNAMIC_DISTRIBUTION_CATEGORY_FILTER,keys,BUTTON_CATEGORY_FILTER_CLASS ,BUTTON_CATEGORY_ID_PREFIX_FILTER ,clickOnCategoryFilter);
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

    // Se ha hecho así por si el atributo tiene caracteres prohibidos para jQuery como "." y "/"
    $(document.getElementById(BUTTON_CATEGORY_ID_PREFIX_FILTER+attribute)).toggleClass("active")
    discreteGraphicPaint(dynamicDistributionObject)

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
    discreteGraphicPaint(dynamicDistributionObject)
}


// SECONDARY ATTRIBUTES FUNCTIONS
function setSecondaryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_SECONDARY_SELECT_COL_ID).empty();
    createPanelButtons("Secondary attributes",undefined,DYNAMIC_DISTRIBUTION_SECONDARY_SELECT_COL_ID,keys,BUTTON_SECONDARY_CLASS,BUTTON_SECONDARY_ID_PREFIX,clickSecondary)
}

function clickSecondary(attribute){
    $(document.getElementById(BUTTON_SECONDARY_ID_PREFIX+attribute)).toggleClass("active")
    var activeStatus = $(document.getElementById(BUTTON_SECONDARY_ID_PREFIX+attribute)).hasClass("active")
    var panel;
    if (activeStatus){
        var a = {
            firstName:"John",
            lastName:"Doe",
            age:50,
            eyeColor:"blue"
        };

        var keys = dynamicDistributionObject.getAttributeInfo(attribute).keys;
        panel = createPanelButtons("Filter by "+attribute,DYNAMIC_DISTRIBUTION_SECONDARY_PANEL_FILTER_PREFIX+attribute,DYNAMIC_DISTRIBUTION_SECONDARY_FILTER,keys,BUTTON_SECONDARY_FILTER_CLASS_PREFIX+attribute,BUTTON_SECONDARY_ID_PREFIX_FILTER+attribute+"-",clickSecondaryFilter,{selfAttribute:attribute})
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
            panel.parentNode.removeChild(panel);
        }
        discreteGraphicPaint(dynamicDistributionObject)
    }
}

function removeAllSecondaries(){
    $("#"+DYNAMIC_DISTRIBUTION_SECONDARY_FILTER).empty();
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
    discreteGraphicPaint(dynamicDistributionObject)
}

function clickSecondaryFilter (attribute) {
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
    discreteGraphicPaint(dynamicDistributionObject)
}

function createPanelButtons(title, id, parentId , keys, buttonsClass,buttons_id_prefix,callback,buttonAttr){

//    $("#"+parentId).empty();
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
    })
    return panel;
}


function createSliderPanel(title, id, parentId , keys, buttonsClass,buttons_id_prefix,callback,buttonAttr){
    var leftValue = Math.floor(keys[0])-Math.ceil(keys[0]-Math.floor(keys[0]));
    var rightValue = Math.floor(keys[1]) + Math.ceil(keys[1]-Math.floor(keys[1]));
    var leftLength = (""+leftValue).length
    var rightLength = (""+rightValue).length
    var length = (leftLength > rightLength)?leftLength:rightLength;
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
        class: 'panel-body slider-panel'
    }).appendTo(panel);
    panelBody.append('<div style="width:'+(length*7)+'px" id="'+buttons_id_prefix+'left">'+leftValue+'</div>')
//    panelBody.append('<b>'+keys[1]+'</b>')

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
    removeAllSecondaries("");
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'; // block
    document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'none'; // block
}

function clearPanel(){
    $("#titanic-button").removeAttr("active")
    $("#events-button").removeAttr("active")
    if (document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV) != null){
        document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'; // block
    }
    if (document.getElementById(DYNAMIC_DISTRIBUTION_ATTRIBUTES_DIV) != null){
        document.getElementById(DYNAMIC_DISTRIBUTION_ATTRIBUTES_DIV).style.display = 'none'; // block
    }
    if (document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV) != null) {
        document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'none'; // block
    }
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
    console.log("The data has been loaded")
    if (document.getElementById(DYNAMIC_DISTRIBUTION_ATTRIBUTES_DIV) != null) {
        document.getElementById(DYNAMIC_DISTRIBUTION_ATTRIBUTES_DIV).style.display = 'block'; // block
    }
    var keyList = new Array;
    for (var key in dynamicDistributionObject.getKeys()){
        if (dynamicDistributionObject.getKeys()[key] == CSVContainerForDistributions.TYPE_DISCRETE ||
            dynamicDistributionObject.getKeys()[key] == CSVContainerForDistributions.TYPE_CONTINUOUS){
            keyList.push(key)
        }
    }
    setPopulationList(keyList);
    setCategoryList(keyList);
    setSecondaryList(keyList);
}
