/**
 * Created by Francisco Huertas on 27/06/14.
 */
/* Licensed to the Apache Software Foundation (ASF) under one
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

var getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
    return undefined;
}

var COOKIE_DEBUG="debug";

var COOKIE_COLORS="colors"

var CONTENT_FATHER = "content-father"

var dashboard_locale = "es-ES"

var BORDER_SIZE = 20;
var ACTIVE_CLASS = "active";
var FULL_SCREEN_KEY = 17 //f


/*Dashboard classes*/
var DASHBOARD_TEMPLATES = "dashboard-templates"
var LOADING_SCREEN = "l3p3-loading-screen";
var CONTENT_LINK_CLASS_NAME = "contentLink"
var LEFT_COLUMN_BUTTON_OPEN = "left-column-button"
var LEFT_COLUMN = "left-column"
var LEFT_COLUMN_CONTENT = "left-column-div"
var LEFT_COLUMN_ELEMENTS = "left-column-class"
var LEFT_MAIN_CLASS = "left-main"
var TITLE_VIEW_ID = "view-title"
var FOOTER_ID = "footer";
var FOOTER_CONTENT_ID = "footer-content";
var CONTENT = "content"

var CSS_CLASS_SHOW_LEFT_COLUMN = "show-left-column"
var CSS_ENABLE_CLASS = "enable"
var DATA_URL = "data/";

/*Single nodes*/
var DATA_URL_RESOURCES = DATA_URL + "resources-allnodes-8000.csv"
var DATA_URL_EVENTS = DATA_URL + "events-allnodes15.csv"

/*Global events*/
var GLOBAL_EVENTS_SOURCE_FILE = DATA_URL + "events-allnodes.csv";


var ID_DASHBOARD_ACTIVE_VIEW_SCRIPT = "dashboard-active-view-script"

var SHOW_FOOTER_CLASS = "footer-show"
var MAXIMIZE_FOOTER_CLASS = "maximize-footer"


var RESET = false
var GLOBAL_DEBUG = false;
var cookie_debug = getCookie(COOKIE_DEBUG);
if (cookie_debug !== undefined){
 GLOBAL_DEBUG = cookie_debug == "true";
}
var ORIGINAL_COLORS = chroma.brewer['Set1'];
ORIGINAL_COLORS [2] = 'black';
//ORIGINAL_COLORS[0] = 'blue'
//ORIGINAL_COLORS[1] = 'green'
//ORIGINAL_COLORS[2] = 'orange'

ORIGINAL_COLORS = []
var i = 0;

ORIGINAL_COLORS.push('orange')
ORIGINAL_COLORS.push('lightgreen')
ORIGINAL_COLORS.push('navy')

ORIGINAL_COLORS.push('aquamarine')
ORIGINAL_COLORS.push('coral')
ORIGINAL_COLORS.push('darkolivegreen')


ORIGINAL_COLORS.push('cyan')
ORIGINAL_COLORS.push('maroon')
ORIGINAL_COLORS.push('greenyellow')


ORIGINAL_COLORS.push('blue')
ORIGINAL_COLORS.push('chocolate')
ORIGINAL_COLORS.push('forestgreen')


ORIGINAL_COLORS.push('mediumturquoise')
ORIGINAL_COLORS.push('brown')
ORIGINAL_COLORS.push('springgreen')


ORIGINAL_COLORS.push('lightseagreen')
ORIGINAL_COLORS.push('orangered')
ORIGINAL_COLORS.push('limegreen')


ORIGINAL_COLORS.push('mediumblue')
ORIGINAL_COLORS.push('#5F9EA0') // cadet blue
//ORIGINAL_COLORS.push('tomato')
ORIGINAL_COLORS.push('lawngreen')


ORIGINAL_COLORS.push('aqua')
ORIGINAL_COLORS.push('red')
ORIGINAL_COLORS.push('green')


ORIGINAL_COLORS.push('darkblue')
ORIGINAL_COLORS.push('crimson')
ORIGINAL_COLORS.push('lime')


/**/
ORIGINAL_COLORS.push('darkgreen')
ORIGINAL_COLORS.push('firebrick')

ORIGINAL_COLORS.push('chartreuse')
ORIGINAL_COLORS.push('darkred')

ORIGINAL_COLORS.push('seagreen')













var web_colors
//var web_colors = []chroma.brewer['Dark2'];



