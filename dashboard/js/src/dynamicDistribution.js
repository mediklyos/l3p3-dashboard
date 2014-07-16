var DYNAMIC_DISTRIBUTION_CHART_DIV = "dynamic-distribution-chart-div";
var DYNAMIC_DISTRIBUTION_SELECT_CATEGORY_COL_ID = "dd-select-category"
var DYNAMIC_DISTRIBUTION_SELECT_PRIMARY_COL_ID = "dd-select-primary-col"

var DYNAMIC_DISTRIBUTION_ATTRIBUTES_DIV = "dd-attributes-col";
var DYNAMIC_DISTRIBUTION_GRAPHICS_DIV = "dd-graphics-col";
var DYNAMIC_DISTRIBUTION_FILTERS_DIV = "dd-filters-col";

var DYNAMIC_DISTRIBUTION_FILTER_CATEGORY = "dd-filter-category";

var DYNAMIC_DISTRIBUTION_FILTER_CATEGORY_CLASS = "dd-filter-category-class";

var BUTTON_ID_CATEGORY_FILTER_ALL = "dd-category-filter-all";
var BUTTON_ID_PREFIX_PRIMARY = "dd-primary-";
var BUTTON_ID_PREFIX_CATEGORY = "dd-button-";
var BUTTON_ID_PREFIX_CATEGORY_FILTER = "dd-category-filter";

var BUTTON_PRIMARY_CLASS = "dd-primary-class"

var BUTTON_CATEGORY_FILTER_CLASS = "dd-category-filter-class"


var BUTTON_CATEGORY_CLASS = "dd-category-class"

var BORDER_PROPORTION = 0.1
var CHART_WIDTH = $(window).width() * 0.96;

var categoryFiltered = new Object;


function discreteGraphicProcess (dynamicDistributionObject){
}


function selectCategory(category){
    var prevCategory = dynamicDistributionObject.getCategoryCol();
    if (category != prevCategory){

    }
}


function clickSelect(){

    var needUpdate = false; // TODO cambiar
    var prevPrimary = dynamicDistributionObject.getPrimaryColInfo();
    var tmp =document.getElementById(DYNAMIC_DISTRIBUTION_SELECT_PRIMARY_COL_ID).selectedOptions[0];
    var newPrimary = (tmp==undefined)?undefined:tmp.innerText;
    if (prevPrimary != newPrimary){
        dynamicDistributionObject.setPrimaryCol(newPrimary);
        needUpdate = true;
    }
    if (needUpdate){
        discreteGraphicPaint (dynamicDistributionObject);
    }
}

function discreteGraphicPaint (dynamicDistributionObject) {
    if (dynamicDistributionObject.getPrimaryCol() == undefined ||
        dynamicDistributionObject.getPrimaryCol() == "" ||
        dynamicDistributionObject.getCategoryCol() == undefined ||
        dynamicDistributionObject.getCategoryCol() == ""
        ){
        return;
    }
    var compositeChart = dc.compositeChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);
    var categoriesFiltered = getCategoriesFiltered();
    if (categoriesFiltered.length == 0){
        document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'none'
        return;
    }
    document.getElementById(DYNAMIC_DISTRIBUTION_GRAPHICS_DIV).style.display = 'block'
    document.getElementById(DYNAMIC_DISTRIBUTION_FILTERS_DIV).style.display = 'block'


//    var chart = dc.barChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);
    var categoryInfo = dynamicDistributionObject.getCategoryColInfo();
    var categoryKeys = categoryInfo.keys;
    var categoryCol = categoryInfo.key;
    var dimension = categoryInfo.dimension();
    var primaryColInfo = dynamicDistributionObject.getPrimaryColInfo();
    var primaryCol = primaryColInfo.key;
    var primaryKeys = primaryColInfo.keys;




    var groupsReduced = new Object;



    // Filtrar tambien aqui porque si no lo suma y luego no sabe donde ponerlo
    var charts = new Array;
    var color = 0;

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
        charts.push(newChart)
    }else {
        for (var i = 0; i < primaryKeys.length;i++){
            groupsReduced[i] = dimension.dimension.group().reduceSum(function (pos,d) {
                if ((categoriesFiltered.indexOf(d[categoryCol]) == -1) || (primaryKeys[pos] != d[primaryCol])){
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


function setCategoryList(keys) {
    createPanelButtons("Category attribute",DYNAMIC_DISTRIBUTION_SELECT_CATEGORY_COL_ID,keys,BUTTON_CATEGORY_CLASS,BUTTON_ID_PREFIX_CATEGORY,setCategory);
}

function setPrimaryList(keys) {
    createPanelButtons("Primary attribute",DYNAMIC_DISTRIBUTION_SELECT_PRIMARY_COL_ID,keys,BUTTON_PRIMARY_CLASS,BUTTON_ID_PREFIX_PRIMARY,setPrimary)
}

function setCategoryFilterList(keys){

    var title = 'Categories'
    var panel = createPanelButtons(title,DYNAMIC_DISTRIBUTION_FILTER_CATEGORY,keys,BUTTON_CATEGORY_FILTER_CLASS,BUTTON_ID_PREFIX_CATEGORY_FILTER,clickOnCategoryFilter)
    var body = panel.find(".panel-body")
    body.append(" ")
    var button_all_group= jQuery('<div/>', {
            class: 'btn-group'
        }
    ).appendTo(body);

    // Adding "All" button
    jQuery('<button/>',{
        id : BUTTON_ID_CATEGORY_FILTER_ALL,
        onclick:"clickOnCategoryAllNone()",
        text: "All/None",
        type: 'button',
        class: 'btn btn-default active'
    }).appendTo(button_all_group);

    return panel;
}

function createPanelButtons(title, parentId , keys, buttonsClass,buttons_id_prefix,callback){
    $("#"+parentId).empty();
    var panel = jQuery('<div/>',{
           class : "panel panel-default"
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


        var button = jQuery('<button/>', {
            type: 'button',
            class: 'btn btn-default '+buttonsClass,
            id: buttons_id_prefix + this,
            text: text,
            onclick: callback.name+'("' + this + '")'
        }).appendTo(panelButtons);
    })
    return panel;
}

function setCategory(newCategory){
    var prevCategory = dynamicDistributionObject.getCategoryCol();

    if (newCategory == "") {
        $("#"+DYNAMIC_DISTRIBUTION_FILTER_CATEGORY).empty();
    } else if (newCategory != prevCategory){
        $("."+BUTTON_CATEGORY_CLASS).removeClass("active");
        $("#"+BUTTON_ID_PREFIX_CATEGORY + newCategory).addClass("active")
        dynamicDistributionObject.categorizedBy(newCategory);
        var categoryInfo = dynamicDistributionObject.getCategoryColInfo();
        var categoryType = categoryInfo.type;
        if (categoryType == undefined) {
            document.getElementById(DYNAMIC_DISTRIBUTION_FILTER_CATEGORY).innerHTML = "";
            return;
        } else if (categoryType == CSVContainer.TYPE_DISCRETE) {
            var panel = setCategoryFilterList(categoryInfo.keys);


            categoryFiltered = new Object;
            $("."+BUTTON_CATEGORY_FILTER_CLASS).addClass("active")
            for (var key in categoryInfo.keys){
                categoryFiltered[categoryInfo.keys[key]] = true;
//                $("#"+BUTTON_ID_PREFIX_CATEGORY_FILTER+categoryInfo.keys[key]).addClass("active")
            }
            discreteGraphicPaint(dynamicDistributionObject)
            return;
        }
    }
}

function setPrimary(newPrimary){
    var prevPrimary = dynamicDistributionObject.getPrimaryColInfo();
    if(prevPrimary != newPrimary){
        $("."+BUTTON_PRIMARY_CLASS).removeClass("active");
        $(document.getElementById(BUTTON_ID_PREFIX_PRIMARY + newPrimary)).addClass("active")
        dynamicDistributionObject.setPrimaryCol(newPrimary);
        discreteGraphicPaint(dynamicDistributionObject)
    }

}

function clickOnCategoryFilter(category) {
    categoryFiltered[category] =!categoryFiltered[category];
    $(document.getElementById(BUTTON_ID_PREFIX_CATEGORY_FILTER+category)).toggleClass("active")
    $("#"+BUTTON_ID_CATEGORY_FILTER_ALL).removeClass("active")
    discreteGraphicPaint(dynamicDistributionObject)
}
function clickOnCategoryAllNone(){
    $(document.getElementById(BUTTON_ID_CATEGORY_FILTER_ALL)).toggleClass("active")
    var result = $("#"+BUTTON_ID_CATEGORY_FILTER_ALL).hasClass("active");
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