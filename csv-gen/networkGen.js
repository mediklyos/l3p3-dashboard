/**
 * Created by paco on 23/09/14.
 */

/* Environment vars*/

var fs = require('fs');

/* Configuration vars*/
var networkFileName = "timeLine.csv"
var nodesFileName = "nodes.json"
var timeRange = 100; /* in milliseconds*/
var nodes = [
    "nodeA",
    "nodeB",
    "nodeC",
    "nodeD",
    "nodeE",
    "nodeF",
    "nodeG",
    "nodeH",
    "nodeI",
    "nodeJ",
    "nodeK",
    "nodeL",
    "nodeM",
    "nodeN"
]


var elements = [
    { id:"e1", position : "nodeA"},
    { id:"e2", position : "nodeA"},
    { id:"e3", position : "nodeA"},
    { id:"e4", position : "nodeA"},
    { id:"e5", position : "nodeA"},
    { id:"e6", position : "nodeA"},
    { id:"e7", position : "nodeA"},
    { id:"e8", position : "nodeA"},
    { id:"e9", position : "nodeA"},
    { id:"e10", position : "nodeA"},
    { id:"e11", position : "nodeA"},
    { id:"e12", position : "nodeA"},
    { id:"e13", position : "nodeA"},
    { id:"e14", position : "nodeA"},
    { id:"e15", position : "nodeA"},
    { id:"e16", position : "nodeA"},
    { id:"e17", position : "nodeA"},
    { id:"e18", position : "nodeA"},
    { id:"e19", position : "nodeA"},
    { id:"e20", position : "nodeA"},
    { id:"e21", position : "nodeA"},
    { id:"e22", position : "nodeA"}
]
var rows = 1000;
var date = new Date();
var longTime = date.getTime();

/* Creating the graph file*/
var fileGraph = fs.openSync(nodesFileName,'w');
fs.writeSync(fileGraph,"{\n");
fs.writeSync(fileGraph,'"'+nodes[0]+'" : {\n\t"x" : 0,\n\t"y" : 0\n\t}')
for (var i = 1; i < nodes.length;i++){
    fs.writeSync(fileGraph,',\n"'+nodes[i]+'" : {\n\t"x" : 0,\n\t"y" : 0\n\t}')
}
fs.writeSync(fileGraph,"\n}");

/*Creating the time line file*/
var file = fs.openSync(networkFileName,'w');
var header = "time,id,origin,destination\n";
fs.writeSync(file,header);


for (var i = 0; i < elements.length; i++){
    fs.writeSync(file,"0,"+elements[i].id+",undefined,"+elements[i].position+"\n")

}
for (var i = 0; i < rows; i++){
    //longTime = longTime + Math.floor(Math.random()*timeRange);
    longTime++;
    var elementAffected = Math.floor(Math.random()*elements.length);
    var origin = elements[elementAffected].position;
    var destiny = "";
    do {
        destiny = nodes [Math.floor(Math.random()*nodes.length)]
    }  while (origin == destiny)
    elements[elementAffected].position = destiny
    var line = longTime+","+elements[elementAffected].id+","+origin+","+destiny+"\n"
//    console.log(line)
    fs.writeSync(file,line);


}