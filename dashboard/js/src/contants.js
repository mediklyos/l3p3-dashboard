/**
 * Created by Francisco Huertas on 27/06/14.
 */

var COOKIE_DEBUG="debug";

var BORDER_SIZE = 20;
var ACTIVE_CLASS = "active";

var CONTENT_LINK_CLASS_NAME = "contentLink"

var DATA_URL = "data/";

/*Single nodes*/
var DATA_URL_RESOURCES = DATA_URL + "resources-allnodes-8000.csv"
var DATA_URL_EVENTS = DATA_URL + "events-allnodes15.csv"

/*Global events*/
var GLOBAL_EVENTS_SOURCE_FILE = DATA_URL + "events-allnodes.csv";


var ID_DASHBOARD_ACTIVE_VIEW_SCRIPT = "dashboard-active-view-script"


var views = [];
views[0] = []
views[1] = []
views[2] = []
var RESET = false
var GLOBAL_DEBUG = false;



