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

var sourceFile = "data/4-VisualizationTables/events-allnodes.csv";

//Chart variables

var dateRangePicker = dc.barChart("#rangeTable");
var eventScatter = dc.seriesChart("#eventsTable");


d3.csv(sourceFile,function(error,data){
            
        if (timeInspection){start = new Date().getTime();}

        var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

///// Events data ///////
            
            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.day = d3.time.day(d.date);
                d.value = 1;
            });
                               
            var ndxE = crossfilter(data);
            
            var dateTypeDimE = ndxE.dimension(function(d){return [d.date.getTime(),d.type];});
            var eventGroup = dateTypeDimE.group().reduceSum(function(d){return 1});
                        
            
//Time range selector
            var dayDim = ndxE.dimension(function(d) {return d.day.getTime();});
            var volumeByDayGroup = dayDim.group().reduceSum(function (d) {return 1});
        
//Node selector
            var nodeDimension = ndxE.dimension(function(d){return d.node});
            var nodeGroup = nodeDimension.group();
            var nodeNames = new Array();
            for (var i=0;i<nodeGroup.top(Infinity).length;i++){
                nodeNames.push(nodeGroup.top(Infinity)[i].key);
            }
            firstNode = nodeNames[0];
            var allNodes = "All nodes";
            var selectorString = "<br><br><select id=\"nodeSelector\">"+"<option value=\""+allNodes+"\">"+allNodes+"</option>";
            for (var i=0;i<nodeNames.length;i++){
                selectorString=selectorString+"<option value=\""+nodeNames[i]+"\">"+nodeNames[i]+"</option>";}
            selectorString = selectorString+"</select>";
            $("#nodeSelectorTitle").append(selectorString);
            $("#nodeSelector").select2();
            
    
            if(timeInspection){measureTime("Crossfilter");}
            
            
/////// Graph defining   ////////
            
            var minDateE = dateTypeDimE.bottom(1)[0].date;
            var maxDateE = dateTypeDimE.top(1)[0].date;
            
            var xAxisWidth = 1000;
            var yAxisHeight = 750;
            

//Date range picker
            
            dateRangePicker
                .width(xAxisWidth).height(50)
                .margins({top: 0, right: 10, bottom: 20, left: 55})
                .dimension(dayDim)
                .group(volumeByDayGroup)
                .x(d3.time.scale().domain([minDateE,maxDateE]))
                .gap(10)
                .round(d3.time.day.round)
//                .elasticY(true)
                .xUnits(d3.time.days)
		        .turnOnControls(true)
                .yAxis().ticks(0);
            
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
            
            eventScatter
                .width(xAxisWidth).height(yAxisHeight)
                .dimension(dateTypeDimE)
                .group(eventGroup)
                .chart(subChart)
//                .elasticY(true)
                .renderHorizontalGridLines(true)
                .renderVerticalGridLines(true)
                .rangeChart(dateRangePicker)
                .seriesAccessor(function(d){return d.key[1]})
                .keyAccessor(function(d){return d.key[0]})
                .valueAccessor(function(d){if (d.value==0){return null} else return d.value})
                .legend(dc.legend().x(xAxisWidth-150).y(50).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70))
                .brushOn(false)
                .turnOnControls(true)
                .yAxisLabel("Amount of events")
                .xAxisLabel("Date")
                .y(d3.scale.linear().domain([0,eventGroup.top(1)[0].value+3]))
                .data(function(group) {
                    return group.all().filter(function(d) { return d.value > 0; });
                })
                .x(d3.time.scale().domain([minDateE,maxDateE]));
                        
                dc.renderAll();
            
                if(timeInspection){measureTime("Graph defining and rendering");}
            
        
/////jQuery stuff//////        
        
// Node selection            
            $("#nodeSelector").on("change",function(){
                nodeDimension.filterAll();
                if ($("#nodeSelector").val()!="All nodes"){
                nodeDimension.filter($("#nodeSelector").val());
                }    
                //Y axis magic
                var checked = $('#checkbox').prop('checked');
                if (checked){
                    eventScatter.y(d3.scale.linear().domain([0,eventGroup.top(1)[0].value+3]));
                    eventScatter.render();
                    dateRangePicker.redraw();
                }
                //
                else{dc.redrawAll();}
                takeOutZeroes();
            });            
            
// Y axis magic
              $("#autoYAxis").on("change",function(){
                var checked = $('#checkbox').prop('checked');
                if (checked){
                    eventScatter.y(d3.scale.linear().domain([0,eventGroup.top(1)[0].value+3]));
                    eventScatter.render();
                    takeOutZeroes();
                }  
              });      
    
function takeOutZeroes(){
    eventScatter.data(function(group) {
        return group.all().filter(function(d) { return d.value > 0; });
    })
}              
         
        
//Ending curly braces DON'T TOUCH!!!        
                }
              )
