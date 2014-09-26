/**
 * This scripts contains the initial routines of the editor
 *
 * Created by paco on 27/06/14.
 */

var dynamicDistributionObject;

var filesInMemory= new Object

// Rutina del menu izquierdo que permite cambiar dinamicamente el contenido del centro al hacer link.
// Los links que son de la clase CONTENT_LINK_CLASS_NAME se le activa y desactiva la clase active para
$(document).ready(function(){
//    $("."+CONTENT_LINK_CLASS_NAME).click(function(){
//        var contentLinks = $(".contentLink");
//        // This is similar to for of all elements with contentLink
//        $("."+ACTIVE_CLASS).parents().removeClass("active");
//        $("."+CONTENT_LINK_CLASS_NAME).removeClass("active");
//        $(this).addClass("active");
//        $(this).parents().addClass("active");
//        var string_url = $(this).attr("ref");
//        var html = new EJS ({url: string_url}).render()
//        $("#content").html(html);
////        $("#content").load("section_singleNodeViewer.html")
//    });

});
var clear = function(){}

function generateInteractiveMenus(){
    var list = $("#views-drop-down")
//    var request = new EJS.newRequest();
    var request = new XMLHttpRequest;
    var linesPainted = 0;
    $.each(views, function (pos, value){
        if (linesPainted != 0 && value.length != 0){
            $('<li class="divider"></li>').appendTo(list);
        }
        linesPainted = 0;
        $.each(value,function(pos,value) {
            var request = new XMLHttpRequest();
            request.open('GET', value.ref, false);  // `false` makes the request synchronous
            request.send(null)
            if (request.status === 200) {
                var li = $('<li/>')
                $('<a/>',{
                    ref: value.ref,
                    id: value.id,
                    href: "#",
                    class: "contentLink subLink",
                    text: value.title
                }).appendTo(li);
                li.appendTo(list)
                linesPainted++;
                $("#"+value.id).click(changeView.bind(undefined,value))
            } else {
                console.log("Ignore the GET exception...")
            }

        })

    })

    var mainLinks = $(".staticLink");
    $.each(mainLinks,function(){
        var url = this.getAttribute("ref");
        var request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null)
        if (!request.status === 200) {
            url = "js/templates/template_blank.ejs"
        }
        $(this).click(changeView.bind(undefined,{ref:url, js:"",id:this.getAttribute('id')}))

//        console.log(this.ref)
    })
}


// Toggle buttons color too
var toggleButtonsFunction = function(id,callback,event) {
    var div = $(document.getElementById(id));
    div.find('.btn').toggleClass('btn-default',true).toggleClass('btn-primary',false);
    $(window.event.target).toggleClass('btn-default',false).toggleClass('btn-primary',true);
    var name = $(window.event.target).find('input').attr('name');
    var value = $(window.event.target).find('input').attr('value');
    callback(name,value)
}



/*Load at the start*/





/*dynamicDistribution*/
//dynamicDistributionLoadData(DISTRIBUTION_SOURCE_FILE);
/*
    dynamicDistributionObject
        | csv (CSVContainerForDistributions)
        | population (String)
        | primary (String)
        | Secondary (Array(String))

 */


function runDynamicDistribution(file){
    // hidden elements
    // Si son null es porque aun no se ha cargado el ejs
    dynamicDistributionObject = new CSVContainerForDistributions(file);
    onLoadedCSV()
}
function changeUrlString(url){
    clear()
    clear = function (){};
    $("."+CONTENT_LINK_CLASS_NAME+"."+ACTIVE_CLASS).parents().removeClass("active");
    var parent = $("#"+ID_DASHBOARD_ACTIVE_VIEW_SCRIPT)[0];
    $("#"+ID_DASHBOARD_ACTIVE_VIEW_SCRIPT).remove();
    $("#content").html(new EJS ({url: this}).render());
//    var newScript = $("<script/>",{
//        id: ID_DASHBOARD_ACTIVE_VIEW_SCRIPT,
//        src: url.js
//    })
//    document.body.appendChild(newScript[0])

}
function changeView(view){
    clear();
    $("#"+TITLE_VIEW_ID).empty()
    clear = function (){};
    disableLeftColumn();
    disableFooter();
    toggleLeftColumn(false)

    $("#"+LEFT_COLUMN_BUTTON_OPEN).addClass(CSS_CLASS_HIDDEN_LEFT_COLUMN)
    $("."+CONTENT_LINK_CLASS_NAME+"."+ACTIVE_CLASS).parents().removeClass("active");
    $("#"+TITLE_VIEW_ID).text(view.title)
    var parent = $("#"+ID_DASHBOARD_ACTIVE_VIEW_SCRIPT)[0];
    $("#"+ID_DASHBOARD_ACTIVE_VIEW_SCRIPT).remove();
    var newScript = $("<script/>",{
        id: ID_DASHBOARD_ACTIVE_VIEW_SCRIPT,
        src: view.js
    })
    document.body.appendChild(newScript[0])
//    newScript.appendTo(parent);

//    $("#"+ID_DASHBOARD_ACTIVE_VIEW_SCRIPT).attr('src',view.js)
    $("#"+view.id).addClass("active");
    $("#"+view.id).parents().addClass("active");
    if (view.js == ""){
        $("#content").html(new EJS({url: view.ref}).render());
    } else {
        $("#" + ID_DASHBOARD_ACTIVE_VIEW_SCRIPT)[0].onload = function () {
//        alert("hola mundo");
            $("#content").html(new EJS({url: view.ref}).render());
        }
    }
}

var setCookie = function (cname, cvalue, exdays) {
    var expires = "";
    if (exdays !== undefined) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = "expires=" + d.toUTCString();
    }
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

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
function deleteCookie( cname ) {
//    document.cookie = cname + '=; expires=-1;';
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function deleteAllCookies(){
    var cookies = document.cookie.split(";")
    $.each(cookies,function(){
        deleteCookie(this.split("=")[0])
    })
}

function resetConfigRoutine(){
    deleteAllCookies();
}

/*Routine code*/
if (RESET){
    resetConfigRoutine();
}

var cookie_debug = getCookie(COOKIE_DEBUG);
if (cookie_debug !== undefined){
    GLOBAL_DEBUG = cookie_debug == "true";
}
var views = [];
views[0] = []
views[1] = []
views[2] = []
if (GLOBAL_DEBUG){

    views[0][4] = {id: "TemporalAssociationNetwork",constantsPrefix: "tan",ref: "js/templates/template_temporal_association_network.ejs",title : "Temporal Association Network", js: "js/src/temporalAssociationNetwork.js"}
    views[0][3] = {id: "ColorMapViewer",constantsPrefix: "CMV",ref: "js/templates/template_color_map.ejs",title : "Color map", js: "js/src/color_map.js"}
    views[0][2] = {id: "NetworkGraphLifeCycle",constantsPrefix: "ngcl",ref: "js/templates/template_NG_LC.ejs",title : "Network Graph Life Cycle", js: "js/src/NetworkGraphLifeCycle.js"}
    views[2][0] = {id: "examples",constantsPrefix: "",ref: "js/templates/example.ejs",title: "Examples", js: "js/src/example.js"}

}


views[0][0] = {id: "DynamicDistributions",constantsPrefix: "dd",ref: "js/templates/template_dynamicDistribution.ejs",title : "Distribution charts", js: "js/src/dynamicDistribution.js"}
views[0][1] = {id: "ComputerResources",constantsPrefix: "odv",ref: "js/templates/template_comp_resources.ejs",title : "Online Data Viewer", js: "js/src/onlineResourceViewer.js"}
//--------------------------------------------------------------------//
views[1][0] = {id: "SingleNodeViewer",constantsPrefix: "snv",ref: "js/templates/template_singleNodeViewer.ejs",title : "Single Node Viewer", js: "js/src/singleNodeViewer.js"}
views[1][1] = {id: "GlobalEventsViewer",constantsPrefix: "gev",ref: "js/templates/template_globalEventsViewer.ejs",title: "Global Events Viewer", js: "js/src/globalEventsViewer.js"}
generateInteractiveMenus();
$(function(){
    if (GLOBAL_DEBUG){
//    $("#"+views[0][1].id).addClass("active");
//    $("#"+views[0][1].id).parents().addClass("active");
//    $("#content").html(new EJS ({url: views[0][1].ref}).render());
//    $("#"+views[0][2].id).addClass("active");
//    $("#"+views[0][2].id).parents().addClass("active");
//    $("#content").html(new EJS ({url: views[0][2].ref}).render());
        changeView(views[0][2]);
//    $("#content").html(new EJS ({url: "js/templates/template_overview.ejs"}).render());
    } else {
        $("#content").html(new EJS ({url: "js/templates/template_overview.ejs"}).render());
    }
//
})

var toggleLeftColumn = function (state) {
//    $("#"+LEFT_COLUMN_BUTTON_OPEN).removeClass(CSS_CLASS_HIDDEN_LEFT_COLUMN)
//    $("#"+LEFT_COLUMN).removeClass(CSS_CLASS_HIDDEN_LEFT_COLUMN)
    if (state === undefined){
        $("#"+LEFT_COLUMN).children().toggleClass(CSS_CLASS_HIDDEN_LEFT_COLUMN)
    }
    else {
        $("#"+LEFT_COLUMN).children().toggleClass(CSS_CLASS_HIDDEN_LEFT_COLUMN,!state)
    }
    $(window).trigger('resize');
}

var enableLeftColumn = function (){
    $("#"+LEFT_COLUMN).css('display','')
    $(window).trigger('resize');
}

var disableLeftColumn = function (){
    $("#"+LEFT_COLUMN).css('display','none')
    $(window).trigger('resize');

}

$(function (){
    disableLeftColumn();
    disableFooter();
    toggleLeftColumn(false)
})
var disableFooter = function () {
    $("#"+FOOTER_ID).css('display','none')
    $(window).trigger('resize');
}

var enableFooter = function () {
    $("#"+FOOTER_ID).css('display','')
    $(window).trigger('resize');
}
var toggleFooter = function (state){
    if (state === undefined){
        $("#"+CONTENT_FATHER).children().toggleClass(SHOW_FOOTER_CLASS)
        $("#"+CONTENT_FATHER).children().children().toggleClass(SHOW_FOOTER_CLASS)
    } else {
        $("#"+CONTENT_FATHER).children().toggleClass(SHOW_FOOTER_CLASS,state)
        $("#"+CONTENT_FATHER).children().children().toggleClass(SHOW_FOOTER_CLASS,state)

    }
    $(window).trigger('resize');
}

