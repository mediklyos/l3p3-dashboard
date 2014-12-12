/**
 * Created by fhuertas on 12/12/14.
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

    views[0][4] = {id: "TemporalAssociationNetwork",constantsPrefix: "tan",ref: "js/templates/template_temporal_association_network.ejs",title : "Temporal Association Network", js: "js/src/temporalAssociationNetwork.js"}
    views[0][3] = {id: "ColorMapViewer",constantsPrefix: "CMV",ref: "js/templates/template_color_map.ejs",title : "Color map", js: "js/src/color_map.js"}
    views[2][0] = {id: "examples",constantsPrefix: "",ref: "js/templates/example.ejs",title: "Examples", js: "js/src/example.js"}

}

var demoViews = []
demoViews[0] = [];
demoViews[0][0] = {id: "d3plusDemo",constantsPrefix: "d3p",ref: "js/templates/template_d3p.ejs",title : "Demo D3 plus", js: "js/src/d3plusDemo.js"}
if (GLOBAL_DEBUG){
}




