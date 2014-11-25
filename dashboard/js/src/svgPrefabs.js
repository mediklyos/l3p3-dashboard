/**
 * Created by fhuertas on 6/11/14.
 */
/*Alignments*/
var MY_ALIGNMENT_MIDDLE = "middle"
var MY_ALIGNMENT_TOP = "top";
var MY_ALIGNMENT_BOTTOM = "bottom"
var MY_ALIGNMENT_LEFT = "left"
var MY_ALIGNMENT_RIGHT = "right"
var MY_ALIGNMENT_TOP_RIGHT = "top-right"
var MY_ALIGNMENT_TOP_LEFT = "top-left"
var MY_ALIGNMENT_BOTTOM_RIGHT = "bottom-right"
var MY_ALIGNMENT_BOTTOM_LEFT = "bottom-left"
var createTooltip = function (svgParent,content,tooltipClasses,alignment,x,y,height,width){
    if (tooltipClasses instanceof Array){
        tooltipClasses = tooltipClasses.join(" ")
    }
    if(alignment === undefined){
        alignment = MY_ALIGNMENT_MIDDLE;
    }
    if (content instanceof jQuery){
        content = content[0].outerHTML;
    } else if (content instanceof HTMLElement) {
        content = content.outerHTML;
    }

//    if (height === undefined){
//        height = 0;
//    }
//    if (width === undefined){
//        width = 0;
//    }

    var tooltip = svgParent.append("foreignObject")
    var divChild = tooltip.append("xhtml:div").html(content)
    $(function (){

        if (tooltipClasses !== undefined && tooltipClasses != "" ){
            tooltip.attr('class',tooltipClasses)
        }
        if (height === undefined){
            height = $(divChild[0]).height();
        }
        if (width=== undefined){
            width = realWidth($(divChild[0]))
//            width = 100;
        }
        if (x === undefined){
            x = 0;
        }
        if (y === undefined){
            y = 0;
        }
        switch (alignment) {
            case MY_ALIGNMENT_TOP_LEFT:
                x -= 0
                y -= 0
                // SVG DEFAULT POSITION
                break;
            case MY_ALIGNMENT_TOP:
                x -= width / 2
                y -= 0
                break;
            case MY_ALIGNMENT_TOP_RIGHT:
                x -= width
                y -= 0
                break;
            case MY_ALIGNMENT_LEFT:
                x -= 0
                y -= height /2
                break;
            case MY_ALIGNMENT_MIDDLE:
                x -= width / 2
                y -= height / 2
                break;
            case MY_ALIGNMENT_RIGHT:
                x -= width
                y -= height / 2
                break;
            case MY_ALIGNMENT_BOTTOM_RIGHT:
                x -= 0
                y -= height
                break;
            case MY_ALIGNMENT_BOTTOM:
                x -= width / 2
                y -= height
                break;
            case MY_ALIGNMENT_BOTTOM_LEFT:
                x -= width
                y -= height
                break;
        }

        tooltip.attr('x',x)
        tooltip.attr('y',y)
        tooltip.attr('width',width)
        tooltip.attr('height',height)
    })
    return tooltip
}

