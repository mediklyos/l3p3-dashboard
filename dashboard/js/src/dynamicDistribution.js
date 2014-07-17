var DYNAMIC_DISTRIBUTION_CHART_DIV = "dynamic-distribution-chart-div";

var DYNAMIC_DISTRIBUTION_ATTRIBUTES_DIV = "dd-attributes-col";
var DYNAMIC_DISTRIBUTION_GRAPHICS_DIV = "dd-graphics-col";
var DYNAMIC_DISTRIBUTION_FILTERS_DIV = "dd-filters-col";





// *_COL_ID = Ids de los div donde se muestran los atributos
// *_FILTER = Ids de los div donde se muestran los filtros de los atributos
// *_PANEL_FILTER_ID = Id del panel de filtro
// *_ID_PREFIX = Prefijo para los botones que se usan para selecionar los atributos
// *_CLASS = Clase para los botones que se usan para selecionar los atributos
// *_ID_FILTER_ALL = Id del boton all/none en los filtros
// *_ID_PREFIX_FILTER = Prefijo para el id de los botones de los valores para los filtros de cada atributo
// *_ID_FILTER_CLASS = clase para los botones de los filtros
var DYNAMIC_DISTRIBUTION_CATEGORY_SELECT_COL_ID = "dd-select-category"
var DYNAMIC_DISTRIBUTION_CATEGORY_FILTER = "dd-filter-category";
var DYNAMIC_DISTRIBUTION_CATEGORY_PANEL_FILTER = "dd-filter-category-panel-filter";
var BUTTON_CATEGORY_ID_PREFIX = "dd-button-";
var BUTTON_CATEGORY_CLASS = "dd-category-class"
var BUTTON_CATEGORY_FILTER_CLASS = "dd-category-filter-class"
var BUTTON_CATEGORY_ID_FILTER_ALL = "dd-category-filter-all";
var BUTTON_CATEGORY_ID_PREFIX_FILTER = "dd-category-filter";

var DYNAMIC_DISTRIBUTION_FILTER_CATEGORY_CLASS = "dd-filter-category-class";


var DYNAMIC_DISTRIBUTION_PRIMARY_SELECT_COL_ID = "dd-select-primary-col"
var DYNAMIC_DISTRIBUTION_PRIMARY_FILTER = "dd-filter-primary";
var DYNAMIC_DISTRIBUTION_PRIMARY_PANEL_FILTER = "dd-filter-primary-panel-filter";
var BUTTON_PRIMARY_ID_PREFIX = "dd-primary-";
var BUTTON_PRIMARY_CLASS = "dd-primary-class"
var BUTTON_PRIMARY_ID_FILTER_ALL = "dd-primary-filter-all";
var BUTTON_PRIMARY_ID_PREFIX_FILTER = "dd-primary-filter";
var BUTTON_PRIMARY_FILTER_CLASS = "dd-primary-filter-class"

var DYNAMIC_DISTRIBUTION_SECONDARY_SELECT_COL_ID = "dd-select-secondary-col"
var DYNAMIC_DISTRIBUTION_SECONDARY_FILTER = "dd-filter-secondary";
var DYNAMIC_DISTRIBUTION_SECONDARY_PANEL_FILTER_PREFIX = "dd-filter-secondary-panel-filter-";
var BUTTON_SECONDARY_ID_PREFIX = "dd-secondary-";
var BUTTON_SECONDARY_CLASS = "dd-secondary-class"
var BUTTON_SECONDARY_ID_FILTER_ALL_PREFIX = "dd-secondary-filter-all-";
var BUTTON_SECONDARY_ID_PREFIX_FILTER = "dd-secondary-filter-";
var BUTTON_SECONDARY_FILTER_CLASS_PREFIX = "dd-secondary-filter-class-"


var BORDER_PROPORTION = 0.1
var CHART_WIDTH = $(window).width() * 0.96;

var categoryFiltered = new Object;
var primaryFiltered = new Object;
var secondaryFilters = new Object;


function discreteGraphicProcess (dynamicDistributionObject){
}

function discreteGraphicPaint (dynamicDistributionObject) {

    // Comprobar que se ha selecionado la columna de categoria y de atributo primario
    // Si no hay ninguna categoria no mostrar nada tampoco se muestra nada
    var categoriesFiltered = getCategoriesFiltered();
    var primaryFiltered = getPrimaryFiltered();
    var emptySecondary = false;

    for (var key1 in secondaryFilters){
        emptySecondary = (Object.keys(secondaryFilters[key1]).length == 0) || emptySecondary;
    }
    secondaryFilters
    if (dynamicDistributionObject.getPrimaryCol() == undefined ||
        dynamicDistributionObject.getPrimaryCol() == "" ||
        dynamicDistributionObject.getCategoryCol() == undefined ||
        dynamicDistributionObject.getCategoryCol() == "" ||
        categoriesFiltered.length == 0 || primaryFiltered.length == 0 || emptySecondary
        ){
        document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'
        return;
    }
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'block'
    document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'block'
    var compositeChart = dc.compositeChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);


    var categoryInfo = dynamicDistributionObject.getCategoryColInfo();
    var categoryCol = categoryInfo.key;
    var dimension = categoryInfo.dimension();
    var primaryColInfo = dynamicDistributionObject.getPrimaryColInfo();
    var primaryCol = primaryColInfo.key;




    var groupsReduced = new Object;



    // Filtrar tambien aqui porque si no lo suma y luego no sabe donde ponerlo
    var charts = new Array;
    var color = 0;

    // Si la categoria el atributo principal son el mismo se muestra la población de ese atributo
    //
    if (primaryCol == categoryCol){
        var group = dimension.dimension.group().reduceSum(function(d){
            if (categoriesFiltered.indexOf(d[categoryCol]) == -1){
                return 0;
            }else{
                return 1;
            }
        });
        var newChart = dc.barChart(compositeChart)
            .colors(myColors(color++))
            .gap(0)
            .dimension(dimension.dimension)
            .group(group, categoryCol)
            .brushOn(false)
            .title(function (d) {
                return d.key + ": " + d.value;
            })
        charts.push(newChart)

    }else {
        for (var i = 0; i < primaryFiltered.length;i++){
            groupsReduced[i] = dimension.dimension.group().reduceSum(function (pos,d) {
                for (var secKey in secondaryFilters){
                    if (secondaryFilters[secKey][d[secKey]] === undefined) {
                        return 0
                    }
                }
                if ((categoriesFiltered.indexOf(d[categoryCol]) == -1) || (primaryFiltered[pos] != d[primaryCol])){
                    return 0;
                }else{
                    return 1;
                }
            }.bind(null,i));
        }
        for (var key in primaryFiltered) {
            var cat = primaryFiltered[key];
            var newChart = dc.barChart(compositeChart)
                .colors(myColors(color++))
                .gap(0)
                .dimension(dimension.dimension)
                .group(groupsReduced[key], cat)
                .brushOn(false)
                .title(function (d) {
                    return "Category: "+d.key + "\nPrimary: " + this + "\nAppearances: " + d.value;
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
            // Este código mueve las columnas del gráfico para que se vean todas correctamente
            var boxes = chart.selectAll("rect.bar");
            var width = boxes.attr("width");
            var border = Math.floor(width * BORDER_PROPORTION);
            var width_borderless = width - border * 2;
            var primary_col_width = Math.floor(width_borderless / charts.length);
            boxes.attr("width", primary_col_width);
            for (var i = 0; i < charts.length; i++) {
                var element_name = "g._" + i;
                var movement = primary_col_width * i + border / 2;
                var translate_cad = "translate(" + movement + ", 0)"
                chart.selectAll(element_name).attr("transform", translate_cad);
            }
        });
    compositeChart.render();
}

// CATEGORY FUNCTIONS
function setCategory(newCategory){
    var prevCategory = dynamicDistributionObject.getCategoryCol();

    if (newCategory == "") {
        $("#"+DYNAMIC_DISTRIBUTION_CATEGORY_FILTER).empty();
    } else if (newCategory != prevCategory){
        // Active only one category
        $("."+BUTTON_CATEGORY_CLASS).removeClass("active");
        $(document.getElementById(BUTTON_CATEGORY_ID_PREFIX + newCategory)).addClass("active")
        dynamicDistributionObject.categorizedBy(newCategory);
        var categoryInfo = dynamicDistributionObject.getCategoryColInfo();
        var categoryType = categoryInfo.type;
        if (categoryType == undefined) {
            document.getElementById(DYNAMIC_DISTRIBUTION_CATEGORY_FILTER).innerHTML = "";
            return;
        } else if (categoryType == CSVContainer.TYPE_DISCRETE) {
            setCategoryFilterList(categoryInfo.keys);


            categoryFiltered = new Object;
            $("."+BUTTON_CATEGORY_FILTER_CLASS).addClass("active")
            for (var key in categoryInfo.keys){
                categoryFiltered[categoryInfo.keys[key]] = true;
//                $("#"+BUTTON_CATEGORY_ID_PREFIX_FILTER+categoryInfo.keys[key]).addClass("active")
            }
            discreteGraphicPaint(dynamicDistributionObject)
            return;
        }
    }
}

function setCategoryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_CATEGORY_SELECT_COL_ID).empty();
    createPanelButtons("Category attribute",undefined,DYNAMIC_DISTRIBUTION_CATEGORY_SELECT_COL_ID,keys,BUTTON_CATEGORY_CLASS,BUTTON_CATEGORY_ID_PREFIX,setCategory);
}

function clickOnCategoryFilter(category) {
    categoryFiltered[category] =!categoryFiltered[category];
    $(document.getElementById(BUTTON_CATEGORY_ID_PREFIX_FILTER+category)).toggleClass("active")
    $("#"+BUTTON_CATEGORY_ID_FILTER_ALL).removeClass("active")


    discreteGraphicPaint(dynamicDistributionObject)
}

function setCategoryFilterList(keys){

    var title = 'Categories ('+dynamicDistributionObject.getCategoryCol()+')';
    $("#"+DYNAMIC_DISTRIBUTION_CATEGORY_FILTER).empty();
    var panel = createPanelButtons(title,undefined,DYNAMIC_DISTRIBUTION_CATEGORY_FILTER,keys,BUTTON_CATEGORY_FILTER_CLASS,BUTTON_CATEGORY_ID_PREFIX_FILTER,clickOnCategoryFilter)
    var body = panel.find(".panel-body")
    body.append(" ")
    var button_all_group= jQuery('<div/>', {
            class: 'btn-group'
        }
    ).appendTo(body);

    // Adding "All" button
    jQuery('<button/>',{
        id : BUTTON_CATEGORY_ID_FILTER_ALL,
        onclick:"clickOnCategoryFilterAllNone()",
        text: "All/None",
        type: 'button',
        class: 'btn btn-default active'
    }).appendTo(button_all_group);

    return panel;
}

function clickOnCategoryFilterAllNone(){
    $(document.getElementById(BUTTON_CATEGORY_ID_FILTER_ALL)).toggleClass("active")
    var result = $("#"+BUTTON_CATEGORY_ID_FILTER_ALL).hasClass("active");
    $("."+BUTTON_CATEGORY_FILTER_CLASS).toggleClass("active",result);
    for (var key in categoryFiltered){
        categoryFiltered[key] = result;
    }
    discreteGraphicPaint(dynamicDistributionObject)
}

function getCategoriesFiltered(){
    var categories = new Array
    for (var key in categoryFiltered ){
        if (categoryFiltered[key]){
            categories.push(key);
        }
    }
    return categories;
}

// PRIMARY ATTRIBUTE FUNCTIONS
function setPrimaryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_PRIMARY_SELECT_COL_ID).empty();
    createPanelButtons("Primary attribute",undefined,DYNAMIC_DISTRIBUTION_PRIMARY_SELECT_COL_ID,keys,BUTTON_PRIMARY_CLASS,BUTTON_PRIMARY_ID_PREFIX,setPrimary)
}

function setPrimary(newPrimary){
    var prevPrimary = dynamicDistributionObject.getPrimaryColInfo();
    if (newPrimary == ""){

    }
    else if(prevPrimary != newPrimary){
        // Active only one primary
        $("."+BUTTON_PRIMARY_CLASS).removeClass("active");
        $(document.getElementById(BUTTON_PRIMARY_ID_PREFIX + newPrimary)).addClass("active")
        dynamicDistributionObject.setPrimaryCol(newPrimary);

        var primaryColInfo = dynamicDistributionObject.getPrimaryColInfo();
        var primaryType = primaryColInfo.type;

        if (primaryType == undefined) {
            document.getElementById(DYNAMIC_DISTRIBUTION_PRIMARY_FILTER).innerHTML = "";
            return;
        } else if (primaryType == CSVContainer.TYPE_DISCRETE) {
            setPrimaryFilterList(primaryColInfo.keys);
            primaryFiltered = new Object;
            $("."+BUTTON_PRIMARY_FILTER_CLASS).addClass("active")
            for (var key in primaryColInfo.keys){
                primaryFiltered[primaryColInfo.keys[key]] = true;
            }
            discreteGraphicPaint(dynamicDistributionObject)
            return;
        }
    }

}

function setPrimaryFilterList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_PRIMARY_FILTER).empty();
    var panel = createPanelButtons("Primary attribute  ("+dynamicDistributionObject.getPrimaryCol()+")",undefined,DYNAMIC_DISTRIBUTION_PRIMARY_FILTER,keys,BUTTON_PRIMARY_FILTER_CLASS ,BUTTON_PRIMARY_ID_PREFIX_FILTER ,clickOnPrimaryFilter);
    var body = panel.find(".panel-body");
    body.append(" ");
    var button_all_group= jQuery('<div/>', {
            class: 'btn-group'
        }
    ).appendTo(body);
    jQuery('<button/>',{
        id : BUTTON_PRIMARY_ID_FILTER_ALL,
        onclick:"clickOnPrimaryAllNone()",
        text: "All/None",
        type: 'button',
        class: 'btn btn-default active'
    }).appendTo(button_all_group)


}

function clickOnPrimaryFilter (attribute){
    primaryFiltered[attribute] =!primaryFiltered[attribute];
    // Se ha hecho así por si el atributo tiene caracteres prohibidos para jQuery como "." y "/"
    $(document.getElementById(BUTTON_PRIMARY_ID_PREFIX_FILTER+attribute)).toggleClass("active")
    discreteGraphicPaint(dynamicDistributionObject)

}


function clickOnPrimaryAllNone(){
    $(document.getElementById(BUTTON_PRIMARY_ID_FILTER_ALL)).toggleClass("active")
    var result = $("#"+BUTTON_PRIMARY_ID_FILTER_ALL).hasClass("active");
    $("."+BUTTON_PRIMARY_FILTER_CLASS).toggleClass("active",result);
    for (var key in primaryFiltered){
        primaryFiltered[key] = result;
    }
    discreteGraphicPaint(dynamicDistributionObject)
}



function getPrimaryFiltered(){
    var categories = new Array
    for (var key in primaryFiltered ){
        if (primaryFiltered[key]){
            categories.push(key);
        }
    }
    return categories;
}


// SECONDARY ATTRIBUTES FUNCTIONS
function setSecondaryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_SECONDARY_SELECT_COL_ID).empty();
    createPanelButtons("Secondary attributes",undefined,DYNAMIC_DISTRIBUTION_SECONDARY_SELECT_COL_ID,keys,BUTTON_SECONDARY_CLASS,BUTTON_SECONDARY_ID_PREFIX,clickSecondary)
}

function clickSecondary(attribute){
    $(document.getElementById(BUTTON_SECONDARY_ID_PREFIX+attribute)).toggleClass("active")
    var activeStatus = $(document.getElementById(BUTTON_SECONDARY_ID_PREFIX+attribute)).hasClass("active")
    if (activeStatus){
        var a = {
            firstName:"John",
            lastName:"Doe",
            age:50,
            eyeColor:"blue"
        };

        var keys = dynamicDistributionObject.getAttributeInfo(attribute).keys;
        createPanelButtons("Filter by "+attribute,DYNAMIC_DISTRIBUTION_SECONDARY_PANEL_FILTER_PREFIX+attribute,DYNAMIC_DISTRIBUTION_SECONDARY_FILTER,keys,BUTTON_SECONDARY_FILTER_CLASS_PREFIX+attribute,BUTTON_SECONDARY_ID_PREFIX_FILTER+attribute+"-",clickSecondaryFilter,{selfAttribute:attribute})
        secondaryFilters[attribute] = new Object
        $("."+BUTTON_SECONDARY_FILTER_CLASS_PREFIX+attribute).addClass("active");
        for (var key in keys){
            secondaryFilters[attribute][keys[key]] = true;
        }
    } else {
        var panel = document.getElementById(DYNAMIC_DISTRIBUTION_SECONDARY_PANEL_FILTER_PREFIX+attribute);
        delete secondaryFilters[attribute];
        if (panel!== undefined){
            panel.parentNode.removeChild(panel);
        }
        discreteGraphicPaint(dynamicDistributionObject)
//        $("#"+DYNAMIC_DISTRIBUTION_SECONDARY_FILTER).remove();

    }
    return;
}

function clickSecondaryFilter (attribute) {
    // Extraer el id porque no puedo pasarlo directamente, el id esta tres niveles de etiquetas encima
    var idClicked = $(event.target).attr('selfAttribute');
    if(secondaryFilters[idClicked][attribute]){
        delete secondaryFilters[idClicked][attribute];
    } else {
        secondaryFilters[idClicked][attribute] = true;
    }
    // Se ha hecho así por si el atributo tiene caracteres prohibidos para jQuery como "." y "/"
    $(document.getElementById(BUTTON_SECONDARY_ID_PREFIX_FILTER+idClicked+"-"+attribute)).toggleClass("active")
    discreteGraphicPaint(dynamicDistributionObject)
    return;
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
    jQuery('<div/>', {
            class: 'btn-group'
        }
    ).appendTo("#"+parentId);
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

var color20 = d3.scale.category20();
function myColors(pos){
    pos = pos % 20;
    return color20(pos);
}

function reset(){
    dynamicDistributionObject.init(dynamicDistributionObject.src,dynamicDistributionObject.keys)
    setCategory("");
    setPrimary("")
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'; // block
    document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'none'; // block
}