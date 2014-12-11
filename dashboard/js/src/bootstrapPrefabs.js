function createSetFilterPanelsByAttributeValue(id,parent,panelList,panel_id_prefix,panels_class,callback,inline){
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
        class:"panel-group",
        id: id
    }).appendTo(parentPanel)

    $.each(panelList, function (key,value){
        var panel = $('<div/>',{
            class: "panel panel-default "+panels_class,
            id: panel_id_prefix + key
        })
        // Panel title
        var heading = jQuery('<div />',{class:'panel-heading'}).appendTo(panel);
        var panelTitle = $('<h4/>', {
            class: 'panel-title',
            text: 'Filter by '+value
        }).appendTo(heading);
        var arrowSpanContainer = $('<span/>', {
            class: 'pull-right clickable'
        }).on("click", function (e) {
            if ($(this).hasClass('panel-collapsed')) {
                // expand the panel
                $(this).parents('.panel').find('.panel-body').slideDown();
                $(this).removeClass('panel-collapsed');
                $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            }
            else {
                // collapse the panel
                $(this).parents('.panel').find('.panel-body').slideUp();
                $(this).addClass('panel-collapsed');
                $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }
        }).appendTo(panelTitle);
        $('<i/>', {
            class: 'glyphicon glyphicon-chevron-up'
        }).appendTo(arrowSpanContainer);
        var panelBody = jQuery('<div />',{class:'panel-body'})

        var panelBodyRow1 = jQuery('<div />',{class:'row'})
        var panelBodyRowColLG1 = jQuery('<div />',{class:'col-lg-12'})
        var formGroup = jQuery('<div />',{class:'form-group'});
        var inputfilter = jQuery('<input />',{class:"form-control", name: "filter-"+value, id: "filter-"+value});
        if(value == "id" || value == "bank") {
            formGroup.append(inputfilter);
        } else {
            var inputfilterContainer = $('<div />', {class: 'input-group'});
            inputfilter.appendTo(inputfilterContainer);
            var inputGroupButton = $('<div />', {
                class: 'input-group-btn'
            }).append($("<button />", {
                type: "button",
                class: "btn btn-default dropdown-toggle"}).attr("data-toggle", "dropdown").append(
                    $('<span />', {
                        class: "caret",
                        style: "margin-top: 8px;margin-bottom: 8px;"})));

            var lista = $('<ul />', {
                id: 'lista-'+NGLC_FILTER_PREFIX+value,
                class: 'dropdown-menu pull-right'
            });

            // Los <li /> los meto en la función de

            lista.appendTo(inputGroupButton);
            inputGroupButton.appendTo(inputfilterContainer);
            inputfilterContainer.appendTo(formGroup);
        }

        var buttonUpdate = jQuery('<button />', {class: "btn btn-default", name: "updatebutton-"+value, text: "Update", style: "margin-right: 5px;"}).click(function(){
            var inputContent = $('#filter-'+value).val();
            updateFilterContent(inputContent, 'filter-'+value)
            $('#filter-'+value).val('');
        });

        var buttonReset = jQuery('<button />', {class: "btn btn-default", name: "resetbutton-"+value, text: "Reset"}).click(function(){
            $('#filter-'+value).val('');
            resetFilterContent('filter-'+value)
        });


        panelBodyRowColLG1.append(formGroup);
        panelBodyRowColLG1.append(buttonUpdate);
        panelBodyRowColLG1.append(buttonReset);
        panelBodyRow1.append(panelBodyRowColLG1);

        var panelBodyRow2 = jQuery('<div />',{class:'row'});
        var panelBodyRowColLG2 = jQuery('<div />',{class:'col-lg-12', id: 'items-filter-'+value});

        panelBodyRow2.append(panelBodyRowColLG2);

        panelBody.append(panelBodyRow1);
        panelBody.append(panelBodyRow2);
        panelBody.appendTo(panel);
        panel.appendTo(buttonsPanel);
        if (!inline) {
            $('<br/>').appendTo(buttonsPanel);
        }
    });
    return buttonsPanel;
}

var createFilterItemButton = function(item, filterId) {
    //<div class="btn-group" id="button107" style="margin: 5px"><a class="btn btn-success disabled" href="#"><i class="icon-user icon-white"></i>RFC01234</a>
    // <a class="btn btn-success dropdown-toggle" data-toggle="dropdown" href="#" style="padding-bottom: 14;padding-top: 14"><span class="caret"></span></a><ul class="dropdown-menu"><li><a onclick="deleteHastag(107);" href="#"><i class="icon-trash"></i> Delete</a></li> </ul> </div><div class="btn-group" id="button117" style="margin: 5px"><a class="btn btn-success disabled" href="#"><i class="icon-user icon-white"></i>RFC789456</a><a class="btn btn-success dropdown-toggle" data-toggle="dropdown" href="#" style="padding-bottom: 14;padding-top: 14"><span class="caret"></span></a><ul class="dropdown-menu"><li><a onclick="deleteHastag(117);" href="#"><i class="icon-trash"></i> Delete</a></li> </ul> </div>
    var itemNoWhiteSpace = item.replace(/ /g,'')
    var buttonGroup = jQuery('<div />', {
        class: 'btn-group',
        id: filterId+"-"+itemNoWhiteSpace,
        style: 'margin: 5px'
    })
    // Add button item
    jQuery('<a />', {
        class: 'btn btn-success disabled',
        href: '#',
        text: item
    }).appendTo(buttonGroup)
    jQuery('<a />', {
        class: 'btn btn-success',
        href: '#',
        onclick: "deleteItem('"+item+"', '"+filterId+"')"
    }).append(jQuery('<span />', {class: 'glyphicon glyphicon-trash', style: 'margin: 3px'})).appendTo(buttonGroup)
    $('#items-'+filterId).append(buttonGroup)
}

/**
 * Delete item from filter content and html.
 * @param item
 * @param filterId
 */
var deleteItem = function(item, filterId) {
    itemsFiltered[filterId] = jQuery.grep(itemsFiltered[filterId], function(value) {
        return value != item;
    });
    $('#'+filterId+"-"+item.replace(/ /g,'')).remove();
}

var resetFilterContent = function(filterId) {
    $.each(itemsFiltered[filterId], function(index, value) {
        deleteItem(value, filterId)
    })
}

/**
 * Gets input text and formats it. Then updates the filter content.
*/
var updateFilterContent = function (text, filterId) {
    filter = text.split(/,\s*/);
    $.each(filter, function(index, value) {
        if(insertIntoFilterContent(value, filterId)) {
            createFilterItemButton(value, filterId)
        }
    })

}

var insertIntoFilterContent = function (item, filterId) {
    var found = jQuery.inArray(item, itemsFiltered[filterId]);
    //console.log(itemsFiltered[filterId])
    console.log(itemsFiltered[filterId])
    if (found >= 0) {
        // Element was found, don't add it.
        return false;
    } else {
        // Element was not found, add it.
        itemsFiltered[filterId].push(item);
        return true;
    }
}

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

function createSliderPanel(title, id, parentId , keys, buttonsClass,buttons_id_prefix,callback){
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
