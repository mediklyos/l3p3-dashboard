var firstNode = null;

var timeInspection = true;
if(timeInspection){
    var start = null;
    var end = null;
    var timeTaken=null;
}

function measureTime(message){
    end = new Date().getTime();
    timeTaken = end-start;
    console.log("Time taken for "+message+": "+timeTaken+" ms.");
    start = new Date().getTime();
}

function nodeResourceLines (sourceFile,htmlID){
    d3.csv(sourceFile, function(error, data) {	
        
            if (timeInspection){start = new Date().getTime();}
        
            var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
            data.forEach(function(d) {
                d.Date = parseDate(d.date);
                d.Day = d3.time.day(d.Date);
                d.value = +d.value;
            });
        
            if(timeInspection){measureTime("forEach");}
        
            var ndx2 = crossfilter(data);
        
            // Series chart
            var dateDim = ndx2.dimension(function(d){return d.Date;});
            var dateTypeDim = ndx2.dimension (function(d) {
                var type = d.variable;
                if (type=="cpu"){return [d.Date.getTime(),1];}
                if (type=="mem"){return [d.Date.getTime(),2];}
                if (type=="int"){return [d.Date.getTime(),3];} 
                if (type=="hd"){return [d.Date.getTime(),4];}
            });
            var valueGroup = dateTypeDim.group().reduceSum(function(d){return d.value});
        
            //Time range selector
            var dayDim = ndx2.dimension(function(d) {return d.Day;});
            var volumeByDayGroup = dayDim.group().reduceSum(function (d) {return 1});
        
            //Resource pie chart
            var resourceDim  = ndx2.dimension(function(d) {if (d.variable!="event"){return d.variable;}});
            var value_resource = resourceDim.group().reduceSum(function(d) {return 1;}); 
            
        
            //Events scatter plot
//            var eventDim = ndx2.dimension(function(d) {return d.variable;});
//            eventDim.filter("event");
//            var eventCountGroup = eventDim.group().reduceSum(function(d){return d.value});
        
            //Node selector
            var nodeDimension = ndx2.dimension(function(d){return d.node});
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
                
        
            if(timeInspection){measureTime("crossfiltering");}
        
            var minDate = dateDim.bottom(1)[0].Date;
            var maxDate = dateDim.top(1)[0].Date;
            
            var xAxisWidth = 1000;
            var yAxisHeight = 700;
        
            var colorList1 = ["#E76473","#F1C968","#5361A4","#70CB58"];
            var colorList2 = ["#E76473","#70CB58","#5361A4","#F1C968"];
        
            var dateRangePicker = dc.barChart("#rangeTable");
            dateRangePicker
                .width(xAxisWidth).height(50)
                .margins({top: 0, right: 10, bottom: 20, left: 65})
                .dimension(dayDim)
                .group(volumeByDayGroup)
                .x(d3.time.scale().domain([minDate,maxDate]))
                .gap(1)
                .round(d3.time.day.round)
                .elasticY(true)
                .xUnits(d3.time.days)
                .yAxis().ticks(0);
        
                var chart = dc.seriesChart(htmlID);
              chart
                .width(xAxisWidth).height(yAxisHeight)
               .dimension(dateDim)
               .group(valueGroup)
               .seriesAccessor(function(d) {return d.key[1]})
               .keyAccessor(function(d) {return d.key[0]})
               .valueAccessor(function (d) {return d.value})               
               .elasticY(false)
               .ordinalColors(colorList1)
               .x(d3.time.scale().domain([minDate,maxDate]))
               .y(d3.scale.linear().domain([0,100]))
               .elasticX(true)
               .margins({top: 10, right: 10, bottom: 00, left: 10})
               .brushOn(false)
               .transitionDuration(1000)
               .renderHorizontalGridLines(true)
               .renderVerticalGridLines(true)
               .rangeChart(dateRangePicker)
               .mouseZoomable(false)
//               .legend(dc.legend().x(xAxisWidth-65).y(10).itemHeight(13).gap(5))
                       .margins({ top: 10, left: 50, right: 10, bottom: 50 }) 
               .title(function(d){ return new Date(d.key[0])+", "+d.key[1]+": "+d.value+"%";} ) 
               .yAxisLabel("Resource Percentage");
            
            var symbolScale = d3.scale.ordinal().range(d3.svg.symbolTypes);
//            var symbolAccessor = function(d){
//	 		    return symbolScale(d.key[0]);
//            };
        
//            var eventScatter = dc.scatterPlot("#eventsTable");
//            eventScatter
//                .width(xAxisWidth).height(yAxisHeight)
//                .dimension(dateDim)
//                .group(eventCountGroup)
//                .x(d3.time.scale().domain([minDate,maxDate]))
//                .symbol(symbolAccessor)
                
        
            var resourceRingChart = dc.pieChart("#chart-ring-resource");
            resourceRingChart
                .width(170).height(170)
                .ordinalColors(colorList2)
                .dimension(resourceDim)
                .group(value_resource)
                .legend(dc.legend().x(73).y(53).itemHeight(13).gap(5))
                .renderLabel(false)
                .renderTitle(false)
                .innerRadius(50); 
        
            if (timeInspection){measureTime("graph defining");}
        
            dc.renderAll();
                    
            if(timeInspection){measureTime("rendering");}
            
            $("#nodeSelector").on("change",function(){
                nodeDimension.filterAll();
                var node = $("#nodeSelector").val();
                nodeDimension.filter(node);
                dc.redrawAll();
            });
        
            $("#resetButton").on("click",function(){
               start = new Date().getTime();
               dateDim.filterAll();
//               nodeDimension.filterAll();
               chart.y(d3.scale.linear().domain([0,100]));
               resourceDim.filterAll();
               dayDim.filterAll();
//               nodeDimension.filter(firstNode);    
               dc.redrawAll();
               $("#rangeSlider").slider("destroy");
                $("#rangeSlider").slider({
                 range: true,
                 min: 0,
                 max: 100,
                 values: [0,100],
               });
              end = new Date().getTime();
              timeTaken = end - start;
              console.log(timeTaken+" ms resetting.")
            });
        
             $("#axisButton").on("click",function(){
                var min = $('#rangeSlider').slider("option", "values")[0];
                var max = $('#rangeSlider').slider("option", "values")[1];
                chart.y(d3.scale.linear().domain([min,max]));
                chart.render();
            });
        
            $("#rangeSlider").slider({
                  range: true,
                  min: 0,
                  max: 100,
                  values: [0,100],
                });
        })
}

