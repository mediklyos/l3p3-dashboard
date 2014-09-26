/**
 * Created by paco on 1/09/14.
 */


/**Hierachi directions*/
var TAN_TOP = "UD";
var TAN_DOWN = "DU";
var TAN_LEFT = "LR";
var TAN_RIGHT = "RL";
var TAN_FONT_BASE_SIZE = 30;
var TAN_SEPARATION_BASE = 700;

var TAN_TITLE = "Temporal Association Network"

var PRE = views[0][4].constantsPrefix

var MAIN_DIV = PRE + "-main"

// HTML ID ELEMENTS
var TAN_INPUT = PRE + "-input-url"
var TAN_GRAPH_CONTAINER = PRE + "-graph-container"
var TAN_GRAPH_CSV = PRE + "-graph-csv"


var bigCSV;

function tcr_load(url) {
    if (GLOBAL_DEBUG){
        var files = 5;
        var columns = 4;
        var valueRanges = 10000;
        var maxOccurrence = 100;
        var id = 0;
        var source = Math.floor((Math.random() * files))
        var column = Math.floor((Math.random() * columns))
        var name = (source) +
            "x"+ (column) +
            "V" + (Math.floor((Math.random() * valueRanges) + 1))
        var query = {
            time : 5000,
            levels : 2,
            maxChildren : 3,
            root : {
                id :id++,
                name : name,
                src: "csv"+source+".csv",
                column: "value"+column,
                children : []
            }
        }

        var times = 0;
        for (var i = 0; i < query.levels;i++){
            var nodeList = [query.root]
            for (var j = 0; j < i;j++ ){
                var newNodeList = []
                $.each(nodeList,function (){
                    newNodeList = newNodeList.concat(this.children)
                })
                nodeList = newNodeList;
            }
            for (var j = 0; j < nodeList.length ;j++){
                var children = 3;//Math.floor((Math.random() * query.maxChildren) + 1);
                for (var k = 0; k < children;k++){
                    var source = Math.floor((Math.random() * files))
                    var column = Math.floor((Math.random() * columns))
                    var name = (source) +
                        "x"+ (column) +
                        "V" + (Math.floor((Math.random() * valueRanges) + 1))
                    var occurrence = 0;
                    for (var h = query.levels; h > i;h--){
                        occurrence += Math.floor((Math.random()*9)+1);
                        occurrence *= 10;
                    }
                    occurrence = Math.floor(occurrence/10)
//                    var occurrence = (Math.floor( ((Math.random() * maxOccurrence) + 1)/(i+1)) )
                    var newChild = {
                        id:(id++),
                        name: name,
                        occurrence: occurrence,
                        src: "csv"+source+".csv",
                        column: "value"+column,
                        children:[]}
                    nodeList[j].children.push(newChild)
                    times++;
                }
            }
        }
        var result = query;

        var nodes  = [];
        var edges = [];
        fillNodes ([result.root],undefined,nodes,edges,0,result.levels)
        generateNetwork(nodes,edges)
        console.log(times)
        return;
    }
    var csvRequest = new CsvRequest(url, 0);
    csvRequest.fullProcess(function () {
//        var list = csvRequest.getFullCsv().orderedList()
//        console.log(list)
        csvRequest.getFullCsv().printTimes()
    });

}
function fillNodes(prevNodes, father, nodes, edges,level,invertLevel){
    for (var i = 0; i < prevNodes.length;i++){
        nodes.push({
            id: prevNodes[i].id,
            label: prevNodes[i].name,
            radius:invertLevel,
            shape:"box",
            borderWidth: (invertLevel+1),
            level:level,
            title: "Value: "+prevNodes[i].name+"<br>Source: "+prevNodes[i].src+"<br>Column: "+prevNodes[i].column,
            fontSize:(TAN_FONT_BASE_SIZE*(invertLevel+1))
        })
        if (father !== undefined){
            var newEdge = {
                from : father,
                to : prevNodes[i].id,
                label : prevNodes[i].occurrence,
                style : "arrow",
                fontSize : TAN_FONT_BASE_SIZE
            }
            edges.push(newEdge);
        }
        fillNodes(prevNodes[i].children,prevNodes[i].id,nodes,edges,level+1,invertLevel-1)
    }

}
var tanResizeFunction = function(){
    var headerHeight = $("#upper-navbar").outerHeight();
//    $("#"+MAIN_DIV).css('height','calc(100vh - '+headerHeight+'px - 1px)')
//    $("#"+MAIN_DIV).css('width','100vw');
    $("#"+TAN_GRAPH_CONTAINER).css('height','calc('+$("#content").height()+'px - '+($("#"+TAN_GRAPH_CONTAINER).position().top)+'px)');
}

var generateNetwork = function (nodes,edges){
    var container = document.getElementById(TAN_GRAPH_CSV);
    var options = {
        smoothCurves: false,
        hierarchicalLayout: {
            enable: true,
            direction: TAN_LEFT,
            levelSeparation: TAN_SEPARATION_BASE,
            nodeSpacing: 1,
            layout: "direction"

        }
    }
    var data = {
        nodes: nodes,
        edges: edges
    }
    var network = new vis.Network(container, data, options);
}
var generateNetwork2 = function (){
    var nodes = [
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'},
        {id: 6, label: 'Node 5', shape: 'box'}
    ];

    // create an array with edges
    var edges = [
        {from: 1, to: 2, label: 33, value: 5},
        {from: 2, to: 1, label: 10, value: 1},
        {from: 1, to: 3, style: 'arrow', value: 1},
        {from: 2, to: 4, value: 3},
        {from: 2, to: 5, value: 2, color: 'red'},
        {from: 5, to: 2, value: 1},
        {from: 6, to: 1, style: 'dash-arrow', width: 1}
    ];

    // create a network
    var container = document.getElementById(TAN_GRAPH_CSV);
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {physics:{barnesHut:{gravitationalConstant:0, springConstant:0, centralGravity: 0}}};
    options = {}
    options = {
        hierarchicalLayout: {
            layout: "hubsize"
        },
        edges: {style:"arrow"}
    };
    var network = new vis.Network(container, data, options);
}