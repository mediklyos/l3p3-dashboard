var DYNAMIC_DISTRIBUTION_CHART_DIV = "dynamic-distribution-chart-div";
var DYNAMIC_DISTRIBUTION_SELECT_CATEGORY_ROW_ID = "dd-select-category"
var DYNAMIC_DISTRIBUTION_SELECT_PRIMARY_ROW_ID = "dd-select-primary-row"

var DYNAMIC_DISTRIBUTION_ATTRIBUTES_DIV = "dd-attributes-row";
var DYNAMIC_DISTRIBUTION_GRAPHICS_DIV = "dd-graphics-row";
var DYNAMIC_DISTRIBUTION_FILTERS_DIV = "dd-filters-row";

var DYNAMIC_DISTRIBUTION_FILTER_CATEGORY = "dd-filter-category";

var DYNAMIC_DISTRIBUTION_FILTER_CATEGORY_CLASS = "dd-filter-category-class";

var BUTTON_ID_PREFIX_PRIMARY = "dd-primary-";

var BUTTON_PRIMARY_CLASS = "dd-primary-class"

var BUTTON_ID_PREFIX_CATEGORY = "dd-button-";

var BUTTON_CATEGORY_CLASS = "dd-category-class"

var BORDER_PROPORTION = 0.1
var CHART_WIDTH = $(window).width();

var categoryFiltered = new Object;


function discreteGraphicProcess (dynamicDistributionObject){
}


function selectCategory(category){
    var prevCategory = dynamicDistributionObject.getCategoryRow();
    if (category != prevCategory){

    }
}


function clickSelect(){

    var needUpdate = false; // TODO cambiar
    var prevPrimary = dynamicDistributionObject.getPrimaryRowInfo();
    var tmp =document.getElementById(DYNAMIC_DISTRIBUTION_SELECT_PRIMARY_ROW_ID).selectedOptions[0];
    var newPrimary = (tmp==undefined)?undefined:tmp.innerText;
    if (prevPrimary != newPrimary){
        dynamicDistributionObject.setPrimaryRow(newPrimary);
        needUpdate = true;
    }
    if (needUpdate){
        discreteGraphicPaint (dynamicDistributionObject);
    }
}

function discreteGraphicPaint (dynamicDistributionObject) {
    if (dynamicDistributionObject.getPrimaryRow() == undefined ||
        dynamicDistributionObject.getPrimaryRow() == "" ||
        dynamicDistributionObject.getCategoryRow() == undefined ||
        dynamicDistributionObject.getCategoryRow() == ""){
        return;
    }
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'block'
    document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'block'


//    var chart = dc.barChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);
    var compositeChart = dc.compositeChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);
    var categoryInfo = dynamicDistributionObject.getCategoryRowInfo();
    var categoryKeys = categoryInfo.keys;
    var categoryRow = categoryInfo.key;
    var dimension = categoryInfo.dimension();
    var primaryRowInfo = dynamicDistributionObject.getPrimaryRowInfo();
    var primaryRow = primaryRowInfo.key;
    var primaryKeys = primaryRowInfo.keys;
    var categoriesFiltered = getCategoriesFiltered();




    var groupsReduced = new Object;



    // Filtrar tambien aqui porque si no lo suma y luego no sabe donde ponerlo
    var charts = new Array;
    var color = 0;

    if (primaryRow == categoryRow){
        var group = dimension.dimension.group().reduceSum(function(d){
            if (categoriesFiltered.indexOf(d[categoryRow]) == -1){
                return 0;
            }else{
                return 1;
            }
        });
        var newChart = dc.barChart(compositeChart)
            .colors(myColors(color++))
            .gap(0)
            .dimension(dimension.dimension)
            .group(group, categoryRow)
            .brushOn(false)
        charts.push(newChart)
    }else {
        for (var i = 0; i < primaryKeys.length;i++){
            groupsReduced[i] = dimension.dimension.group().reduceSum(function (pos,d) {
                if ((categoriesFiltered.indexOf(d[categoryRow]) == -1) || (primaryKeys[pos] != d[primaryRow])){
                    return 0;
                }else{
                    return 1;
                }
            }.bind(null,i))
        }
        for (var key in primaryKeys) {
            var cat = primaryKeys[key];
            var newChart = dc.barChart(compositeChart)
                .colors(myColors(color++))
                .gap(0)
                .dimension(dimension.dimension)
                .group(groupsReduced[key], cat)
                .brushOn(false)
                .title(function (d) {
                    return "" + this + ": " + d.value;
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
            var boxes = chart.selectAll("rect.bar");
            var width = boxes.attr("width");
            var border = Math.floor(width * BORDER_PROPORTION);
            var width_borderless = width - border * 2;
            var primary_row_width = Math.floor(width_borderless / charts.length);
            boxes.attr("width",primary_row_width);
//            boxes.attr("width",(width / 2)-22);
            for (var i = 0; i < charts.length; i ++){
                var element_name = "g._"+i;
                var movement = primary_row_width * i  + border / 2;
//                movement = border / 2;
                var translate_cad = "translate(" + movement + ", 0)"
                chart.selectAll(element_name).attr("transform", translate_cad);
            }
        });
    compositeChart.render();
}


function setCategoryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_SELECT_CATEGORY_ROW_ID).empty()
    var buttons = jQuery('<div/>', {
            class: 'btn-group'
        }
    ).appendTo("#"+DYNAMIC_DISTRIBUTION_SELECT_CATEGORY_ROW_ID);
    for (var key in keys){
        if (keys[key] == CSVContainer.TYPE_DISCRETE) {
            var button = jQuery('<button/>', {
                type: 'button',
                class: 'btn btn-default '+BUTTON_CATEGORY_CLASS,
                id: BUTTON_ID_PREFIX_CATEGORY + key,
                text: key,
                onclick: 'setCategory("' + key + '")'
            }).appendTo(buttons);
        }
    }
}

function setPrimaryList(keys) {
    $("#"+DYNAMIC_DISTRIBUTION_SELECT_PRIMARY_ROW_ID).empty()
    var buttons = jQuery('<div/>', {
            class: 'btn-group'
        }
    ).appendTo("#"+DYNAMIC_DISTRIBUTION_SELECT_PRIMARY_ROW_ID);
    for (var key in keys){
        if (keys[key] == CSVContainer.TYPE_DISCRETE) {
            var button = jQuery('<button/>', {
                type: 'button',
                class: 'btn btn-default '+BUTTON_PRIMARY_CLASS,
                id: BUTTON_ID_PREFIX_PRIMARY + key,
                text: key,
                onclick: 'setPrimary("' + key + '")'
            }).appendTo(buttons);
        }
    }
}

function setCategory(newCategory){
    var prevCategory = dynamicDistributionObject.getCategoryRow();

    if (newCategory == "") {
        $("#"+DYNAMIC_DISTRIBUTION_FILTER_CATEGORY).empty();
        document.getElementById(DYNAMIC_DISTRIBUTION_FILTER_CATEGORY).innerHTML = "";
        return;
    } else if (newCategory != prevCategory){
        $("."+BUTTON_CATEGORY_CLASS).removeClass("active");
        $("#"+BUTTON_ID_PREFIX_CATEGORY + newCategory).addClass("active")
        dynamicDistributionObject.categorizedBy(newCategory);
        var categoryInfo = dynamicDistributionObject.getCategoryRowInfo();
        var categoryType = categoryInfo.type;
        if (categoryType == undefined) {
            document.getElementById(DYNAMIC_DISTRIBUTION_FILTER_CATEGORY).innerHTML = "";
            return;
        } else if (categoryType == CSVContainer.TYPE_DISCRETE) {
            categoryFiltered = new Object;
            // TODO cambiar a jQuery
            var innerHTML = '<div class="panel panel-default">' +
                '<div class="panel-heading">Categories ' +
                '<small>(<a href="#" onclick="clickOnCategoryAll()">all</a>/' +
                '<a href="#" onclick="clickOnCategoryNone()">none</a>)</small></div>' +
                '<div class="panel-body">'
            for (var key in categoryInfo.keys){
                innerHTML += '<input type="checkbox" class="'+DYNAMIC_DISTRIBUTION_FILTER_CATEGORY_CLASS+'" name="categories" value="'+categoryInfo.keys[key]
                    + '" checked onclick="clickOnCategoryCheckBoxes(\''+categoryInfo.keys[key]+'\')">'+categoryInfo.keys[key]+'<br>';
                categoryFiltered[categoryInfo.keys[key]] = true;
            }
            document.getElementById(DYNAMIC_DISTRIBUTION_FILTER_CATEGORY).innerHTML = innerHTML;
        }
        discreteGraphicPaint(dynamicDistributionObject)
    }
}

function setPrimary(newPrimary){
    var prevPrimary = dynamicDistributionObject.getPrimaryRowInfo();

    if(prevPrimary != newPrimary){
        $("."+BUTTON_PRIMARY_CLASS).removeClass("active");
        $("#"+BUTTON_ID_PREFIX_PRIMARY + newPrimary).addClass("active")
        dynamicDistributionObject.setPrimaryRow(newPrimary);
        discreteGraphicPaint(dynamicDistributionObject)
    }

}

function clickOnCategoryCheckBoxes(category) {
    categoryFiltered[category] =!categoryFiltered[category];
    discreteGraphicPaint(dynamicDistributionObject)
}
function clickOnCategoryAll(){
    for (var key in categoryFiltered){
        categoryFiltered[key] = true;
    }
    $("."+DYNAMIC_DISTRIBUTION_FILTER_CATEGORY_CLASS).prop("checked",true);
    discreteGraphicPaint(dynamicDistributionObject)
}

function clickOnCategoryNone(){
    for (var key in categoryFiltered){
        categoryFiltered[key] = false;
    }
    $("."+DYNAMIC_DISTRIBUTION_FILTER_CATEGORY_CLASS).prop("checked",false)
    discreteGraphicPaint(dynamicDistributionObject)
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none';
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

var color20 = d3.scale.category20();
function myColors(pos){
    return color20(pos);
}

function reset(){
    dynamicDistributionObject.init(dynamicDistributionObject.src,dynamicDistributionObject.keys)
    setCategory("");
    setPrimary("")
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'; // block
    document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'none'; // block
}