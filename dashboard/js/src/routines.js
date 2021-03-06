/**
 * This scripts contains the initial routines of the editor
 *
 * Created by paco on 27/06/14.
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
    list = $("#views-drop-down")
//    var request = new EJS.newRequest();
    var request = new XMLHttpRequest;
    var linesPainted = 0;
    $.each(views, function (pos, value){
        if (linesPainted != 0 && value.length != 0){
            $('<li class="divider"></li>').appendTo(list);
        }
        linesPainted = 0;
        $.each(value,function(pos,value) {
            if (value == undefined){
                return;
            }
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

    var list = $("#demo-drop-down")
    linesPainted = 0;
    if (demoViews[0].length == 0){
        $("#demo-drop-down").remove();
    } else {
        $.each(demoViews, function (pos, value){
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
    }

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

    $("#"+LEFT_COLUMN_BUTTON_OPEN).remove(CSS_CLASS_SHOW_LEFT_COLUMN)
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
var cookie_colors = getCookie(COOKIE_COLORS)
if (cookie_colors !== undefined) {
    web_colors =cookie_colors.split(",")
} else {
    web_colors = ORIGINAL_COLORS;
}

generateInteractiveMenus();
$(function(){
    if (GLOBAL_DEBUG){
        //changeView(demoViews[0][0]);
        changeView(debugView);
    } else {
        $("#content").html(new EJS ({url: "js/templates/template_overview.ejs"}).render());
    }
//
})

var keyPress = function (event){
    if (event.keyCode == FULL_SCREEN_KEY && event.ctrlKey){
        if ($("."+SHOW_FOOTER_CLASS).length > 0 || $("."+CSS_CLASS_SHOW_LEFT_COLUMN).length > 0){
            toggleFooter(false)
            toggleLeftColumn(false)
        } else {
            toggleFooter(true)
            toggleLeftColumn(true)
        }
    }
}
$(document).keypress(keyPress);
var toggleLeftColumn = function (state) {
    if (state === undefined){
        $("#"+LEFT_COLUMN).children().toggleClass(CSS_CLASS_SHOW_LEFT_COLUMN)
    }
    else {
        $("#"+LEFT_COLUMN).children().toggleClass(CSS_CLASS_SHOW_LEFT_COLUMN,state)
    }
    $(window).trigger('resize');
}

var enableLeftColumn = function (){
    $("#"+LEFT_COLUMN).addClass(CSS_ENABLE_CLASS )
    $("#"+LEFT_COLUMN_CONTENT).empty();
    $(window).trigger('resize');
}

var disableLeftColumn = function (){
    toggleLeftColumn(false)
    $("#"+LEFT_COLUMN).removeClass(CSS_ENABLE_CLASS )
    $(window).trigger('resize');
}

$(function (){
    /*Disable by default*/
    disableLeftColumn();
    disableFooter();
})
var disableFooter = function () {
    toggleFooter(false)
    $("#"+FOOTER_ID).removeClass(CSS_ENABLE_CLASS )
    $(window).trigger('resize');
}

var enableFooter = function () {
    $("#"+FOOTER_ID).addClass(CSS_ENABLE_CLASS )
    $("#"+FOOTER_CONTENT_ID).empty();
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

var toggleMaximizeFooter = function (state) {
    if (state === undefined){
        $("#"+CONTENT_FATHER).children().toggleClass(MAXIMIZE_FOOTER_CLASS)
        $("#"+CONTENT_FATHER).children().children().toggleClass(MAXIMIZE_FOOTER_CLASS)
    } else {
        $("#"+CONTENT_FATHER).children().toggleClass(MAXIMIZE_FOOTER_CLASS,state)
        $("#"+CONTENT_FATHER).children().children().toggleClass(MAXIMIZE_FOOTER_CLASS,state)
    }
    $(window).trigger('resize');

}

/**
 * Obtains the width of a html element, this function ignore the css inherit properties
 * @param obj
 * @returns {*}
 */
var realWidth = function (obj) {
    var clone = obj.clone();
    clone.css({ position: "absolute", visibility: "hidden", display: "block" });
    $('body').append(clone);
    var width = clone.outerWidth();
    clone.remove();
    return width;
}

var printDate = function (date) {
    if (!(date instanceof Date)){
        if ((typeof date) == "number"){
            date = new Date(date);
        } else{
            return undefined;
        }

    }
    var hour = date.getHours();
    if (hour < 10){
        hour = "0"+hour;
    }
    var minutes = date.getMinutes()
    if (minutes < 10){
        minutes = "0"+minutes
    }
    var seconds = date.getSeconds()
    if (seconds < 10){
        seconds = "0"+seconds
    }
    var year = date.getFullYear()
    var month = date.getMonth()+1;
    if (month< 10){
        month= "0"+month
    }
    var day = date.getDate()
    if (day< 10){
        day= "0"+day
    }
    return hour+":"+minutes+":"+seconds+"-"+day+"/"+month+"/"+year
}

var changeLoadingScreen = function (active) {
    if (active == undefined) {
        active = ($("#"+LOADING_SCREEN).css('display') =='none');
    }
    if (active){
        $("#"+LOADING_SCREEN).css('display','inline')
    } else {
        $("#"+LOADING_SCREEN).css('display','none')
    }


}

var alternativeAddClass = function (jElements, className) {
    alternativeSwitchClass(jElements,className,true);
    //jElements.attr('class',elements.attr('class').replace(className,"").replace(/\s\s+/g, ' ').trim()+" "+className);
}

var alternativeRemoveClass = function (jElements, className) {
    alternativeSwitchClass(jElements,className,false);
    //jElements.attr('class',elements.attr('class').replace(className,"").replace(/\s\s+/g, ' ').trim());
}

var alternativeSwitchClass = function (jElement, className,status) {
    $.each(jElement, function (){
        if (status== undefined) {
            this.classList.toggle(className)
        } else if (status) {
            this.classList.add(className)
        } else {
            this.classList.remove(className)
        }
    })
}


var addTransparencyToHexColor = function (color,alpha){
    var rgbColor = d3.rgb(color);
    return "rgba("+rgbColor.r+","+rgbColor.g+","+rgbColor.b+","+alpha+")"

}