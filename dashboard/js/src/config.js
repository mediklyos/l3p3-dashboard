/**
 * Created by paco on 31/07/14.
 * This is created to contains the variables that configure the application as develop or stable version,
 * the file has not been merged from other version to this version. This is using the merge ours merge strategy
 */


var views = [];
views[0] = []
views[1] = []
views[2] = []

views[0][0]  = {id: "DynamicDistributions",constantsPrefix: "dd",ref: "js/templates/template_dynamicDistribution.ejs",title : "Distribution charts"}
views[0][1]  = {id: "ComputerResources",constantsPrefix: "dd",ref: "js/templates/template_comp_resources.ejs",title : "Online Data Viewer"}
//views[1][0] = {id: "SingleNodeViewer",constantsPrefix: "snv",ref: "js/templates/template_singleNodeViewer.ejs",title : "Single Node Viewer"}
//views[1][1] = {id: "GlobalEventsViewer",constantsPrefix: "gev",ref: "js/templates/template_globalEventsViewer.ejs",title: "Global Events Viewer"}
//views[2][0] = {id:"examples",constantsPrefix: "",ref: "js/templates/example.ejs",title: "Examples"}