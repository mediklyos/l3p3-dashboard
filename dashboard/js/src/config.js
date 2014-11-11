/**
 * Created by fhuertas on 11/11/14.
 */
var CONFIG_COLORS = "config-colors"
var COLOR_BOX_CLASS = "my-color-box"
var COLOR_ATTR = "my-color"
var DEBUG_CHECKBOX = "config-debug-checkbox"


var dashboardConfigStart = function () {

    var colpicker = $('#picker').colpick({
        onSubmit: function (rgb,hex){
            web_colors.push("#"+hex);
            paintColors()
        }
    });
    $(function () {
        /*Debug checkbox*/
        if (getCookie(COOKIE_DEBUG) == "true") {
            document.getElementById(DEBUG_CHECKBOX).checked = true;
        }

        /*Colors*/
        var height = $(".colpick.colpick_full").height()
        $(".colpick.colpick_full").height(height+10)
        paintColors();

    })
}

var configRemoveColor = function (event){
    var element = $(event.target);
    while ((element.attr(COLOR_ATTR) === undefined) && (element[0] != document.body)) {
        element = element.parent();
    }
    var color = element.attr(COLOR_ATTR)
    element.remove();
    web_colors = []
    $.each($("."+COLOR_BOX_CLASS),function (){
        var color = $(this).attr(COLOR_ATTR)
        if ( color !== undefined){
            web_colors.push($(this).attr(COLOR_ATTR))
        }
    })
//    console.log("color: "+event.target.css('background'))
}

var paintColors = function () {
    var spanColorBase = $("."+COLOR_BOX_CLASS+"."+DASHBOARD_TEMPLATES)
    var spanColors = $('#'+CONFIG_COLORS).empty()
    $.each(web_colors,function () {

        var colorBox = spanColorBase.clone().removeClass(DASHBOARD_TEMPLATES)

        colorBox.attr(COLOR_ATTR ,this)
        colorBox.css("background",this);
        spanColors.append(colorBox)
    })

}

var saveRoutine = function(){
    var GLOBAL_DEBUG = document.getElementById(DEBUG_CHECKBOX).checked;
    setCookie(COOKIE_DEBUG,GLOBAL_DEBUG,10);
    setCookie(COOKIE_COLORS,web_colors,10);

    location.reload();
}

var configColorReset = function () {
    web_colors = ORIGINAL_COLORS;
    paintColors();

}