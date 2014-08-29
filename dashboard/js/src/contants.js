/**
 * Created by Francisco Huertas on 27/06/14.
 */



var ACTIVE_CLASS = "active";

var CONTENT_LINK_CLASS_NAME = "contentLink"

var DATA_URL = "data/";

/*Single nodes*/
var DATA_URL_RESOURCES = DATA_URL + "resources-allnodes-8000.csv"
var DATA_URL_EVENTS = DATA_URL + "events-allnodes15.csv"

/*Global events*/
var GLOBAL_EVENTS_SOURCE_FILE = DATA_URL + "events-allnodes.csv";

/*Distribution*/
var DISTRIBUTION_SOURCE_FILE = DATA_URL + "s-events/res.events-allnodesShort.csv"

var views = [];
views[0] = []
views[1] = []
views[2] = []

var GLOBAL_DEBUG = false;
var views = [];
views[0] = []
views[1] = []
views[2] = []
if (GLOBAL_DEBUG){

    views[0][2] = {id: "ColorMapViewer",constantsPrefix: "CMV",ref: "js/templates/template_color_map.ejs",title : "Color map"}
    views[2][0] = {id:"examples",constantsPrefix: "",ref: "js/templates/example.ejs",title: "Examples"}

}


views[0][0] = {id: "DynamicDistributions",constantsPrefix: "dd",ref: "js/templates/template_dynamicDistribution.ejs",title : "Distribution charts"}
views[0][1] = {id: "ComputerResources",constantsPrefix: "odv",ref: "js/templates/template_comp_resources.ejs",title : "Online Data Viewer"}
//--------------------------------------------------------------------//
views[1][0] = {id: "SingleNodeViewer",constantsPrefix: "snv",ref: "js/templates/template_singleNodeViewer.ejs",title : "Single Node Viewer"}
views[1][1] = {id: "GlobalEventsViewer",constantsPrefix: "gev",ref: "js/templates/template_globalEventsViewer.ejs",title: "Global Events Viewer"}


