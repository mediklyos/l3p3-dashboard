/**
 * Created by fhuertas on 12/12/14.
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
var views = [];
views[0] = []
views[1] = []
views[2] = []

views[0][0] = {id: "DynamicDistributions",constantsPrefix: "dd",ref: "js/templates/template_dynamicDistribution.ejs",title : "Distribution charts", js: "js/src/dynamicDistribution.js"}
views[0][1] = {id: "ComputerResources",constantsPrefix: "odv",ref: "js/templates/template_comp_resources.ejs",title : "Online Data Viewer", js: "js/src/onlineResourceViewer.js"}
views[0][2] = {id: "NetworkGraphLifeCycle",constantsPrefix: "nglc",ref: "js/templates/template_NG_LC.ejs",title : "Network Graph Life Cycle", js: "js/src/NetworkGraphLifeCycle.js"}
views[0][5] = {id: "predictorMonitor",constantsPrefix: "pv",ref: "js/templates/template_predictor.ejs",title : "Predictor Monitor", js: "js/src/predictorView.js"}
//--------------------------------------------------------------------//
views[1][0] = {id: "SingleNodeViewer",constantsPrefix: "snv",ref: "js/templates/template_singleNodeViewer.ejs",title : "Single Node Viewer", js: "js/src/singleNodeViewer.js"}
views[1][1] = {id: "GlobalEventsViewer",constantsPrefix: "gev",ref: "js/templates/template_globalEventsViewer.ejs",title: "Global Events Viewer", js: "js/src/globalEventsViewer.js"}

if (GLOBAL_DEBUG){
    views[0][6] = {id: "alertTable",constantsPrefix: "at",ref: "js/templates/template_alert_table.ejs",title : "Alerts", js: "js/src/alertTableLogic.js"}
    views[0][7] = {id: "dataAnalysisPrediction",constantsPrefix: "dap",ref: "js/templates/template_dap.ejs",title : "Data Analysis Prediction", js: "js/src/dapView.js"}
    views[0][4] = {id: "TemporalAssociationNetwork",constantsPrefix: "tan",ref: "js/templates/template_temporal_association_network.ejs",title : "Temporal Association Network", js: "js/src/temporalAssociationNetwork.js"}
    views[0][3] = {id: "ColorMapViewer",constantsPrefix: "CMV",ref: "js/templates/template_color_map.ejs",title : "Color map", js: "js/src/color_map.js"}
    views[2][0] = {id: "examples",constantsPrefix: "",ref: "js/templates/example.ejs",title: "Examples", js: "js/src/example.js"}
}

var demoViews = []
demoViews[0] = [];
demoViews[0][0] = {id: "d3plusDemo",constantsPrefix: "d3p",ref: "js/templates/template_d3p.ejs",title : "Demo D3 plus", js: "js/src/d3plusDemo.js"}
if (GLOBAL_DEBUG){
    var debugView = views[0][6];
}
