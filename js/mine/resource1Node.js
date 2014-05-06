

function nodeResourceLines ( sourceFile,htmlID){
    
    d3.csv(sourceFile, function(error, data) {	
            //var ndx = crossfilter(data); 
            var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
            data.forEach(function(d) {
                d.Date = parseDate(d.date);
                d.Year=d.Date.getFullYear();
                d.Hour = d3.time.hour(d.Date);
            });
            var ndx2 = crossfilter(melt(data,["Date","Year","Hour","date"],"Resource"));
            var meltedDim  = ndx2.dimension(function(d) {return d.Resource;});
            var dateDim = ndx2.dimension(function(d) {return d.Date;});
            var hourDim = ndx2.dimension(function(d) {return d.Hour;});
            var volumeByHourGroup = hourDim.group().reduceSum(function (d) {
                return d.value / 10;
            });
            var hits = dateDim.group().reduceSum(dc.pluck('value'));
            var yearDim  = ndx2.dimension(function(d) {return +d.Year;}); 
            var year_total = yearDim.group().reduceSum(function(d) {return d.value;});
            var resourceDim  = ndx2.dimension(function(d) {return d.Resource;});
            var value_resource = resourceDim.group().reduceSum(function(d) {return d.value;}); 
            var Cpu=dateDim.group().reduceSum(function(d) 
               {if (d.Resource==='cpu') {return d.value;}else{return 0;}});
            var Int=dateDim.group().reduceSum(function(d) 
               {if (d.Resource==='int') {return d.value;}else{return 0;}});
            var Mem=dateDim.group().reduceSum(function(d) 
               {if (d.Resource==='mem') {return d.value;}else{return 0;}}); 

            var minDate = dateDim.bottom(1)[0].Date;
            var maxDate = dateDim.top(1)[0].Date;
            
            var xAxisWidth = 1000;

            var dateRangePicker = dc.barChart("#rangeTable");
            dateRangePicker
                .width(xAxisWidth).height(80)
                .margins({top: 0, right: 10, bottom: 20, left: 65})
                .dimension(hourDim)
                .group(volumeByHourGroup)
                .x(d3.time.scale().domain([minDate,maxDate]))
                .gap(1)
                .round(d3.time.hour.round)
                .elasticY(true)
                .xUnits(d3.time.hours)
                .yAxis().ticks(4);
        
            var chart = dc.compositeChart(htmlID); 
            chart
               .width(xAxisWidth).height(600)
               .dimension(dateDim)
               .elasticY(false)
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
               .legend(dc.legend().x(900).y(10).itemHeight(13).gap(5))
                       .margins({ top: 10, left: 50, right: 10, bottom: 50 }) 
               .title(function(d){ return getvalues(d);} ) 
               .yAxisLabel("Resource Percentage")
                   .compose([
                dc.lineChart(chart)
                    .group(Cpu,"CPU")
                    .colors("#56B2EA"),
                dc.lineChart(chart)
                    .group(Int,"Interfaces")
                    .colors("#E064CD"),
                dc.lineChart(chart)
                    .group(Mem,"Memory")
                    .colors("#F8B700")
            ]);


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
        


            dc.renderAll();
        

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
               chart.filterAll();
               dateRangePicker.filterAll();
               resourceRingChart.filterAll();
               dc.redrawAll();
               $("#rangeSlider").slider("destroy");
                $("#rangeSlider").slider({
                 range: true,
                 min: 0,
                 max: 100,
                 values: [0,100],
               });
            });
        
             $("#axisButton").on("click",function(){
                var min = $('#rangeSlider').slider("option", "values")[0];
                var max = $('#rangeSlider').slider("option", "values")[1];
                chart.y(d3.scale.linear().domain([min,max]));
                chart.redraw();
            });
        
            $("#rangeSlider").slider({
                  range: true,
                  min: 0,
                  max: 100,
                  values: [0,100],
                });
        })
}

