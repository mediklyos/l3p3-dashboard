/**
 * Created by Francisco Huertas on 07/08/2014.
 */


function createSetButtons(id,parent,buttonsList,buttons_id_prefix,buttons_class,callback,inline){
    if (inline === undefined){
        inline = true;
    }

    var parentPanel;
    if (parent instanceof String){
        parentPanel = $("#"+parent);
    } else {
        parentPanel = parent;
    }
    var buttonsPanel = $('<div/>', {
        class:"btn-group",
        "data-toggle" :"buttons",
//        text: "hola",
        id: id
    }).appendTo(parentPanel)

//    var buttonsSet = $('<div class="btn-group btn-toggle" data-toggle="buttons"/>').appendTo(buttonsPanel);
//    buttonsSet.attr('id',DYNAMIC_DISTRIBUTION_BUTTONS_ATTR_TYPE_PREFIX+cols[key]);
//    buttonsSet.click(toggleButtonsFunction.bind(undefined,DYNAMIC_DISTRIBUTION_BUTTONS_ATTR_TYPE_PREFIX+cols[key],function(attribute,value){
//        colTypes[attribute] = value;
//    }));
//    buttonsList = ["uno","dos","tres","cuatro","cinco","seis"]
    $.each(buttonsList, function (key,value){
        var button = $('<button/>',{
            class: "btn btn-default "+buttons_class,
            text: value,
            value: value,
            id: buttons_id_prefix + key
        })
        if (true){
            button.attr('type',"button")
        }
        button.click(function(){
            var active = !$(this).hasClass('active');
            $(this).toggleClass('btn-primary',active)
            $(this).toggleClass('btn-default',!active)
            callback({key: key, value: value,active: active})

        })
        button.appendTo(buttonsPanel);
        if (!inline){
            $('<br/>').appendTo(buttonsPanel);
        }
    })
    return buttonsPanel;
}


function createPanelButtons(title, id, parentId , keys, buttonsClass,buttons_id_prefix,callback,buttonAttr){
//    removeResizingWatcher(parentId);
    var panel = jQuery('<div/>',{
            class : "panel panel-default",
            id : id
        }
    ).appendTo("#"+parentId);
    var panelHeader = jQuery('<div/>', {
            class: "panel-heading",
            text: title
        }
    ).appendTo(panel);
    var panelBody = jQuery('<div/>', {
        class: 'panel-body'
    }).appendTo(panel);
    var panelButtons = jQuery('<div/>', {
        class: 'btn-group'
    }).appendTo(panelBody);
    var pos = {top:-1, left:-1}
    $.each(keys,function(){
        var text = this;
        if (text == "") text = "#blank";
        if (buttonAttr === undefined) {
            buttonAttr = new Object
        }
        buttonAttr['type'] = 'button';
        buttonAttr['class'] = 'btn btn-default '+buttonsClass;
        buttonAttr['id'] = buttons_id_prefix + this;
        buttonAttr['text'] = text;
        buttonAttr['onclick'] = callback.name+'("' + this + '",this)';

        var button = jQuery('<button/>',buttonAttr ).appendTo(panelButtons);
//        $(button).addEventListener('click',callback.bind(window,this))

        var actualPos = button.offset()
        if (pos.left > actualPos.left){
            button.detach();
            panelButtons = jQuery('<div/>', {
                class: 'btn-group'
            }).appendTo(panelBody);
            button.appendTo(panelButtons)
            pos = {top:-1, left:-1}
        }else {
            pos = actualPos;
        }

    })
    var func = function(buttonsClass,oldDimensions,event){
        var prevWidth = oldDimensions.width;
        var actualWidth = event.target.offsetWidth
        if (prevWidth != actualWidth) {
            var buttons = this.find("."+buttonsClass);
//            this.find("."+buttonsClass).remove();
            buttons.detach();
            buttons.detach();
//            var panelButtons =
            var panelsToAddAfter = []
            this.find(".btn-group").each(function(pos,btnGroup){
                if (btnGroup.childElementCount != 0){
                    panelsToAddAfter.push(btnGroup);
                } else {
                    btnGroup.remove()
                }
            })
            var panelButtons = jQuery('<div/>', {
                class: 'btn-group'
            }).appendTo(panelBody);
            var buttonPos = {top:-1, left:-1}
            $.each(buttons,function(pos){
                var button = $(buttons[pos]);
                button.appendTo(panelButtons);
                var actualPos = button.offset()
                if (buttonPos.left > actualPos.left){
                    button.detach();
                    panelButtons = jQuery('<div/>', {
                        class: 'btn-group'
                    }).appendTo(panelBody);
                    button.appendTo(panelButtons)
                    buttonPos = {top:-1, left:-1}
                }else {
                    buttonPos = actualPos;
                }

            })

            panelBody.append(panelsToAddAfter)
        }
    }.bind(panel,buttonsClass)
    resizingWatcher(panel,func)
    return panel;
}

function createSliderPanel(title, id, parentId , keys, buttonsClass,buttons_id_prefix,callbac){
    var leftValue
    var rightValue
    var step = (keys[1] - keys[0]) / 100;
    var stringLeftValue
    var stringRightValue
    var decimals = 0;
    if (step >= 1) {
        step = Math.floor(step);
        leftValue = Math.floor(keys[0]);
        rightValue = Math.ceil(keys[1])
        stringLeftValue = leftValue;
        stringRightValue = rightValue
    } else {
        var pos = 1;
        while (step < 1){
            step = step*10;
            pos *= 10;
            decimals++;
        }
        step = 1/pos;
        leftValue = parseFloat(parseFloat(keys[0]).toFixed(decimals))
        rightValue = parseFloat(parseFloat(keys[1]).toFixed(decimals))
        stringLeftValue  = parseFloat(keys[0]).toFixed(decimals)
        stringRightValue = parseFloat(keys[1]).toFixed(decimals)

    }
    var leftLength = (""+stringLeftValue).length
    var rightLength = (""+stringRightValue).length
    var length = (leftLength > rightLength)?leftLength:rightLength;
    var panel = jQuery('<div/>',{
            class : "panel panel-default",
            id : id
        }
    ).appendTo("#"+parentId);


    var panelHeader = jQuery('<div/>', {
            class: "panel-heading",
            text: title
        }
    ).appendTo(panel);
    var panelBody = jQuery('<div/>', {
        class: 'panel-body slider-panel'
    }).appendTo(panel);
    panelBody.append('<div style="width:'+(length*7)+'px" id="'+buttons_id_prefix+'left">'+stringLeftValue+'</div>')


    var slider = jQuery('<div/>').slider({
        range: true,
        min: leftValue,
        max: rightValue,
        values: [leftValue,rightValue],
        step: step,

        slide: function (decimals,event,ui) {
            $("#"+buttons_id_prefix+"left").text(ui.values[0].toFixed(decimals))
            $("#"+buttons_id_prefix+"right").text(ui.values[1].toFixed(decimals))
        }.bind(undefined,decimals),
        stop : function (event, ui){
            callback(ui.values[0],ui.values[1])
        }
    }).appendTo(panelBody);
    var sliderWidth = panel.offsetWidth /2;
    slider.css('width',sliderWidth)
    panelBody.append('<div style="width:'+(length*7)+'px" id="'+buttons_id_prefix+'right">'+stringRightValue+'</div>')
    resizingWatcher(panel,function(oldSize,event){
        if (oldSize.width != event.target.offsetWidth){
            var children = this.children();
            var width= 0;
            $.each(children,function (pos,child){
                if (!$(child).hasClass("ui-slider")){
                    width += $(child).outerWidth(true);
                }
            })
//            $(event.target.parentNode).find(".panelBody")
            var newSliderWidth = (this.width() - width -parseInt($(slider).css('margin-left'))-parseInt($(slider).css('margin-right'))) * .95;
            slider.css('width',newSliderWidth)
        }

    }.bind(panelBody))
    return panel;
}


function createPupUp(id,title, body,footer){
    var panel = $('<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '<h4 class="modal-title">'+title+'</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '</div>' +
        '<div class="modal-footer">' +
        footer +
        '</div>' +
        '</div><!-- /.modal-content -->' +
        '</div><!-- /.modal-dialog -->' +
        '</div><!-- /.modal -->')

    panel.find(".modal-body").append(body)
    panel.attr('id',id);

    return panel[0];
}

function createBlankPanel( id, parentId,title, body){
    if (title === undefined){
        title = "";
    }
    var panel = jQuery('<div/>',{
            class : "panel panel-default",
            id : id
        }
    ).appendTo("#"+parentId);
    var panelHeader = jQuery('<div/>', {
            class: "panel-heading",
            text: title
        }
    ).appendTo(panel);
    var panelBody = jQuery('<div/>', {
        class: 'panel-body'
    }).appendTo(panel);
    if (body !== undefined){
        if (body instanceof jQuery){
            body.appendTo(panelBody);
        } else if (body instanceof HTMLElement){
            $(body).appendTo(panelBody);
        } else {
            panelBody.text(body.toString());
        }

    }
}

var createToolTip = function (jElement,text,position){
//    jElement.attr('data-toggle','tooltip')
//    jElement.attr('data-original-title',text)
//    jElement.attr('title',text);
//    jElement.tooltip();
    var tooltip = jElement.tooltip({
//        trigger: "manual",
        placement : position,
        title: text
    })
    return tooltip;
}

var destroyTooltip = function (jElement){
    jElement.tooltip('destroy');
}

function reloadToolTip(jElement,text){
    jElement.tooltip({title:text}).tooltip('close').tooltip('open');
}


// resizing routines
//
function resizingWatcher(jqElement,resizingRoutine){
    jqElement.resize(resizingRoutine)
}
