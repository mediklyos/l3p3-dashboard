var firstNode = null;
var timeInspection = true;
if (timeInspection) {
    var start = null;
    var end = null;
    var timeTaken = null;
}

function measureTime(message) {
    end = new Date().getTime();
    timeTaken = end - start;
    console.log("Time taken for " + message + ": " + timeTaken + " ms.");
    start = new Date().getTime();
}


var dataEvents = null;
var dataResources = null;

function getData(sourceFileResources, sourceFileEvents) {
    d3.csv(sourceFileResources, function (error, ResourceData) {
        d3.csv(sourceFileEvents, function (error2, EventsData) {
            dataResources = ResourceData;
            dataEvents = EventsData;


            if (timeInspection) {start = new Date().getTime(); }

            var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;


            ///////  Resource data   /////////
            dataResources.forEach(function (d) {
                            d.date = parseDate(d.date);
                            d.Day = d3.time.day(d.date);
                            if (d.cpu=="NA"){d.cpu=0;}
                            else            {d.cpu = +d.cpu;}
                            if (d.mem=="NA"){d.mem=0;}
                            else            {d.mem = +d.mem;}
                            if (d.int=="NA"){d.int=0;}
                            else            {d.int = +d.int;}
                           if (d.hd=="NA"){d.hd=0;}
                            else            {d.hd = +d.hd;}
                        });

            if(timeInspection){measureTime("forEach Resources");}
            /*
             date, day, node, a1, a2 , a3 ---> date, day, node, resource (posibles values = a1, a2, a3), value (cell values)
             */
            var ndxR = crossfilter(melt(dataResources,["date","Day","node"],"Resource","Value"));

            //Series chart
            var dateDim = ndxR.dimension(function(d){return d.date.getTime();});
            var dateTypeDim = ndxR.dimension (function(d) {
                return [d.date.getTime(),d.Resource,d.node];
            });
            var valueGroup = dateTypeDim.group().reduceSum(function(d){
                return d.Value;
            });

            //Time range selector
            var dayDim = ndxR.dimension(function(d) {return d.Day.getTime();});
            var volumeByDayGroup = dayDim.group().reduceSum(function (d) {return 1});

            //Resource pie chart
            var resourceDim  = ndxR.dimension(function(d) {return d.Resource;});
            var value_resource = resourceDim.group().reduceSum(function(d) {return 1;}
            );

            //Node selector
            var nodeDimension = ndxR.dimension(function(d){return d.node});
            var nodeGroup = nodeDimension.group();
            var nodeNames = new Array();
            for (var i=0;i<nodeGroup.top(Infinity).length;i++){
                nodeNames.push(nodeGroup.top(Infinity)[i].key);
            }
            firstNode = nodeNames[0];
            var selectorString = "<br><br><select id=\"nodeSelector\">";
            for (var i=0;i<nodeNames.length;i++){
                selectorString=selectorString+"<option value=\""+nodeNames[i]+"\">"+nodeNames[i]+"</option>";}
            selectorString = selectorString+"</select>";
            $("#nodeSelectorTitle").append(selectorString);
            $("#nodeSelector").select2();
            nodeDimension.filter($("#nodeSelector").val());



            ///// Events data ///////

            dataEvents.forEach(function(d) {
                d.date = parseDate(d.date);
                d.value = 1;
            });

            var ndxE = crossfilter(dataEvents);

            var dateTypeDimE = ndxE.dimension(function(d){return [d.date.getTime(),d.type];});
            var eventGroup = dateTypeDimE.group().reduceSum(function(d){return 1});

            var minDateE = dateTypeDimE.bottom(1)[0].date;
            var maxDateE = dateTypeDimE.top(1)[0].date;

            var nodeDimE = ndxE.dimension(function(d){return d.node;});
            nodeDimE.filter($("#nodeSelector").val());

            if(timeInspection){measureTime("Crossfilter");}


            /////// Graph defining   ////////

            var minDate = dateDim.bottom(1)[0].date;
            var maxDate = dateDim.top(1)[0].date;

            var xAxisWidth = 1000;
            var yAxisHeight = 300;

            var colorListChart = ["#FF0000","#FF7400","#009999","#00CC00"];
            var colorListPie = ["#E76473","#70CB58","#5361A4","#F1C968"];


            //Date range picker

            var dateRangePicker = dc.barChart("#rangeTable");
            dateRangePicker
                .width(xAxisWidth).height(50)
                .margins({top: 0, right: 10, bottom: 20, left: 55})
                .dimension(dayDim)
                .group(volumeByDayGroup)
                .x(d3.time.scale().domain([minDate,maxDate]))
                .gap(10)
                .round(d3.time.day.round)
//                .elasticY(true)
                .xUnits(d3.time.days)
		        .turnOnControls(true)
                .yAxis().ticks(0);

            //Resources chart

            var chart = dc.seriesChart("#resourceChart");
              chart
               .width(xAxisWidth).height(yAxisHeight)
               .dimension(dateDim)
               .group(valueGroup)
               .seriesAccessor(function(d) {
                   return d.key[1];
               })
               .keyAccessor(function(d) {
                   return d.key[0];
               })
               .valueAccessor(function (d) {
                   return d.value;
               })
               .elasticY(false)
               .ordinalColors(colorListChart)
               .x(d3.time.scale().domain([minDate,maxDate]))
               .y(d3.scale.linear().domain([0,100]))
               .elasticX(true)
               .xUnits(d3.time.days)
               .brushOn(false)
               .transitionDuration(1000)
               .renderHorizontalGridLines(true)
               .renderVerticalGridLines(true)
               .rangeChart(dateRangePicker)
               .mouseZoomable(false)
               .legend(dc.legend().x(xAxisWidth-100).y(30).itemHeight(13).gap(5))
               .margins({ top: 10, left: 50, right: 10, bottom: 50 })
               .title(function(d){ return new Date(d.key[0])+", "+d.key[1]+": "+d.value+"%";} )
               .xAxisLabel("Date")
                .data(function(group) {
                    return group.all().filter(function(d) { return d.value > 0; });
                })
               .yAxisLabel("Resource Percentage");


//Resource picker
             var resourceRingChart = dc.pieChart("#chart-ring-resource");
            resourceRingChart
                .width(170).height(170)
                .ordinalColors(colorListPie)
                .dimension(resourceDim)
                .group(value_resource)
                .legend(dc.legend().x(73).y(53).itemHeight(13).gap(5))
                .renderLabel(false)
                .renderTitle(false)
                .innerRadius(50);

//Event scatterplot    

            var symbolScale = d3.scale.ordinal().range(d3.svg.symbolTypes);
            var symbolAccessor = function(d){
	 		    return symbolScale(d.key[1]);
            };

            var subChart = function(c) {
                return dc.scatterPlot(c)
                .symbol(symbolAccessor)
                .symbolSize(5)
                .highlightedSize(10);
  };

             var eventScatter = dc.seriesChart("#eventsTable");
            eventScatter
                .width(xAxisWidth).height(yAxisHeight)
                .dimension(dateTypeDimE)
                .group(eventGroup)
                .chart(subChart)
//                .elasticY(true)
                .renderHorizontalGridLines(true)
                .renderVerticalGridLines(true)
//                .label(function(d){ return new Date(d.key[0])+", "+d.key[1]+": "+d.value;} )
                .rangeChart(dateRangePicker)
                .seriesAccessor(function(d){
                    return d.key[1]})
                .keyAccessor(function(d){
                    return d.key[0]})
                .valueAccessor(function(d){
                    if (d.value==0){return null}
                    else return d.value})
                .legend(dc.legend().x(xAxisWidth-150).y(50).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70))
                .brushOn(false)
                .yAxisLabel("Amount of events")
                .xAxisLabel("Date")
                .y(d3.scale.linear().domain([0,eventGroup.top(1)[0].value+3]))
                .data(function(group) {
                    return group.all().filter(function(d) { return d.value > 0; });
                })
                .x(d3.time.scale().domain([minDateE,maxDateE]));





                dc.renderAll();

                if(timeInspection){measureTime("Graph defining and rendering");}

//Node selection            
            $("#nodeSelector").on("change",function(){
                nodeDimE.filterAll();
                nodeDimension.filterAll();
                nodeDimension.filter($("#nodeSelector").val());
                nodeDimE.filter($("#nodeSelector").val());
                dc.redrawAll();
                chart.data(function(group) {
                    return group.all().filter(function(d) { return d.value > 0; });
                })
            });

//Range selection

            $("#rangeSlider").slider({
                  range: true,
                  min: 0,
                  max: 100,
                  values: [0,100]
                });

            $("#rangeSlider").on("mouseup",function(){
                var min = $('#rangeSlider').slider("option", "values")[0];
                var max = $('#rangeSlider').slider("option", "values")[1];
                chart.y(d3.scale.linear().domain([min,max]));
                chart.render();
            });




//Reset button

            $("#resetButton").on("click",function(){
               start = new Date().getTime();
               chart.y(d3.scale.linear().domain([0,100]));
                dc.filterAll();
                dc.redrawAll();
                chart.render();
               $("#rangeSlider").slider("destroy");
                $("#rangeSlider").slider({
                 range: true,
                 min: 0,
                 max: 100,
                 values: [0,100]
               });
              end = new Date().getTime();
              timeTaken = end - start;
              console.log(timeTaken+" ms resetting.")
            });
                }
              )
            }
          )
}
