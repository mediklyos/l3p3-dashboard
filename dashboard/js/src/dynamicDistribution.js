var DYNAMIC_DISTRIBUTION_CHART_DIV = "dynamic-distribution-chart-div";

function discreteGraphicProcess (dynamicDistributionObject){
//    dynamicDistributionObject.primary;
//    dynamicDistributionObject.preLoadDimension(principal_dimension_name);

    //var principal_dimension_values;
}
dc.units.ordinal = function (a,b,c){
    return 4;
}
function discreteGraphicPaint (dynamicDistributionObject) {
    var chart = dc.barChart("#" + DYNAMIC_DISTRIBUTION_CHART_DIV);
    var dimension = dynamicDistributionObject.data.dimension(function (d) {
        return d.Pclass;
    });
//    var group       = dimension.group().reduceCount();
    // Survived porque solo sumamos si survived es cierto! Representar todos los valores
    var group = dimension.group().reduceSum(function (d) {
        return d.Survived;
        ;
    });

    var myFunction = function (s, e, domain) {
        return domain;
    }
    chart
        .width(768)
        .height(480)
        .brushOn(false)
        .yAxisLabel("This is the Y Axis!")

        .dimension(dimension)
        .group(group)
        .x(d3.scale.ordinal().domain(["1", "2", "3"]))
        .xUnits(dc.units.ordinal)

    chart.render();



}
