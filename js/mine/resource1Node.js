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



function nodeResourceLines ( sourceFile,htmlID,min,max){
    
    d3.csv(sourceFile, function(error, data) {	
        
        if (timeInspection){start = new Date().getTime();}
        
            data = data.splice(min,max);
            var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
            data.forEach(function(d) {
                d.Date = parseDate(d.date);
                d.Year=d.Date.getFullYear();
                d.Day = d3.time.day(d.Date);
            });
        
          if(timeInspection){measureTime("forEach");}
        
            var ndx2 = crossfilter(melt(data,["Date","Year","Day","date"],"Resource"));
            var dateDim = ndx2.dimension(function(d) {return d.Date;});
            var dateTypeDim = ndx2.dimension (function(d) {return [d.Date,d.Resource];}); //ESTA ORDEN ES UNA CABRONA
            var valueGroup = dateTypeDim.group().reduceSum(function(d){return d.value});
            var dayDim = ndx2.dimension(function(d) {return d.Day;});
            var volumeByDayGroup = dayDim.group().reduceSum(function (d) {return d.value/50;});
            var resourceDim  = ndx2.dimension(function(d) {return d.Resource;});
            var value_resource = resourceDim.group().reduceSum(function(d) {return 1;}); 
            
            if(timeInspection){measureTime("crossfiltering");}
        
            var minDate = dateDim.bottom(1)[0].Date;
            var maxDate = dateDim.top(1)[0].Date;
            
            var xAxisWidth = 1000;

            var dateRangePicker = dc.barChart("#rangeTable");
            dateRangePicker
                .width(xAxisWidth).height(80)
                .margins({top: 0, right: 10, bottom: 20, left: 65})
                .dimension(dayDim)
                .group(volumeByDayGroup)
                .x(d3.time.scale().domain([minDate,maxDate]))
                .gap(1)
                .round(d3.time.day.round)
                .elasticY(true)
                .xUnits(d3.time.days)
                .yAxis().ticks(4);
        
                var chart = dc.seriesChart(htmlID);
              chart
                .width(xAxisWidth).height(600)
               .dimension(dateDim)
               .group(valueGroup)
               .seriesAccessor(function(d) {return d.key[1]})
               .keyAccessor(function(d) {return d.key[0]})
               .valueAccessor(function (d) {return d.value})               
               .elasticY(false)
              .ordinalColors(["#56B2EA","#E064CD","#F8B700"])
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
               .legend(dc.legend().x(xAxisWidth-65).y(10).itemHeight(13).gap(5))
                       .margins({ top: 10, left: 50, right: 10, bottom: 50 }) 
//               .title(function(d){ return getvalues(d);} ) 
               .yAxisLabel("Resource Percentage");
            



            var resourceRingChart = dc.pieChart("#chart-ring-resource");
            resourceRingChart
                .width(170).height(170)
                .ordinalColors(["#56B2EA","#E064CD","#F8B700"])
                .dimension(resourceDim)
                .group(value_resource)
                .legend(dc.legend().x(75).y(63).itemHeight(13).gap(5))
                .renderLabel(false)
                .renderTitle(false)
                .innerRadius(50); 
        
            if (timeInspection){measureTime("graph defining");}
        
        
            //dc.renderAll();
            dateRangePicker.render();
            chart.render();
            resourceRingChart.render();
        
            if(timeInspection){measureTime("rendering");}
        

            function getvalues(d){
                var str=d.key.getDate() + "/" + (d.key.getMonth() + 1) + "/" + d.key.getFullYear()+"\n";
                var key_filter = dateDim.filter(d.key).top(Infinity);
                var total=0;
                key_filter.forEach(function(a) {
                str+=a.Resource+": "+a.value+"%\n";
                total+=a.value;
                });

//                str+="Cases:"+total;
                //remove filter so it doesn't effect the graphs,
                //this is the only filter so we can do this
                dateDim.filterAll();
                return str;
            } 
        
            $("#resetButton").on("click",function(){
               start = new Date().getTime();
               chart.filterAll();
               chart.y(d3.scale.linear().domain([0,100]));
               //chart.render();
               dateRangePicker.filterAll();
               resourceRingChart.filterAll();
               dc.renderAll();
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


// OLD CHART

//            var chart = dc.compositeChart(htmlID); 
//            chart
//               .width(xAxisWidth).height(400)
//               .dimension(dateDim)
//               .elasticY(false)
//               .x(d3.time.scale().domain([minDate,maxDate]))
//               .y(d3.scale.linear().domain([0,100]))
//               .elasticX(true)
//               .margins({top: 10, right: 10, bottom: 00, left: 10})
//               .brushOn(false)
//               .transitionDuration(1000)
//               .renderHorizontalGridLines(true)
//               .renderVerticalGridLines(true)
//               .rangeChart(dateRangePicker)
//               .mouseZoomable(false)
//               .legend(dc.legend().x(xAxisWidth-65).y(10).itemHeight(13).gap(5))
//                       .margins({ top: 10, left: 50, right: 10, bottom: 50 }) 
//               .title(function(d){ return getvalues(d);} ) 
//               .yAxisLabel("Resource Percentage")
//                   .compose([
//                dc.lineChart(chart)
//                    .group(Cpu,"CPU")
//                    .colors("#56B2EA"),
//                dc.lineChart(chart)
//                    .group(Int,"Interfaces")
//                    .colors("#E064CD"),
//                dc.lineChart(chart)
//                    .group(Mem,"Memory")
//                    .colors("#F8B700")
//            ]);

