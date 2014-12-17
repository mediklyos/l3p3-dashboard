/**
 * Created by paco on 10/07/14.
 */
/*  Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

function runExample() {
    var countries = ["Russia", "USA", "Ukraine"];
    var chartExample = {
        initChart: function (data) {
            var composite = dc.compositeChart("#test");

            var ndx = crossfilter(data),
                categoryDimension = ndx.dimension(dc.pluck('category')),
                usaGroup = categoryDimension.group().reduceSum(dc.pluck('usa')),
                russiaGroup = categoryDimension.group().reduceSum(dc.pluck('russia'));

            composite
                .width(400)
                .height(300)
                .x(d3.scale.ordinal().domain([1,2,3]))
                .xUnits(dc.units.ordinal)
                .yAxisLabel("User Count")
                .renderHorizontalGridLines(true)
                .compose([
                    dc.barChart(composite)
                        .centerBar(true)
                        .gap(100)
                        .colors('red')
                        .dimension(categoryDimension)
                        .group(russiaGroup),
                    dc.barChart(composite)
                        .centerBar(true)
                        .gap(100)
                        .colors('blue')
                        .dimension(categoryDimension)
                        .group(usaGroup)])
                .brushOn(false)
                .render();
        },
        initData: function () {
            var data = [];

            for (var i = 0; i < 100; i++) {
                var userCount = Math.floor(Math.random() * 100);
                var userCount2 = Math.floor(Math.random() * 200);
                var category = Math.floor(Math.random() * 3) + 1;
                data.push({
                    usa: userCount,
                    russia: userCount2,
                    category: category
                });
            }
            debugger;
            chartExample.initChart(data);
        }
    };

    chartExample.initData();
}