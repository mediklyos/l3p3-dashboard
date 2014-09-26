/**
 * Created by paco on 1/09/14.
 */
var folder = "100/";
var BASE_FILENAME = "csv"
var MAX_TIME = 10000;
var nFiles = 5;
var valuesPerFile = 4;
var iterations = 100;
var rangeValue = [1,9];

var date = new Date();
longTime = date.getTime();

var fs = require('fs')
var statFile = fs.openSync(folder+"info.txt",'w');
fs.writeSync(statFile,"Start: Date=["+date+"] LongDate=["+longTime+"]\n")

var files = [];
for (var i = 0; i < nFiles; i++){
    var path = BASE_FILENAME+i+".csv"
        console.log("Creando fichero: " +folder+path )
        files[i] = fs.openSync(folder+path,'w');
        var header = "date"
        for (var j = 0; j<valuesPerFile; j++){
            header += ",value"+j;
        }
        header += "\n"
        fs.writeSync(files[i],header);
}


for (var i = 0; i < iterations; i++){

//    var dateInc =
    var longTime = longTime + Math.floor(Math.random()*MAX_TIME)
    var line =  longTime;
    var numFile = Math.floor(Math.random()*nFiles);
    var valuePrefix = numFile+"x"
    for (var j = 0; j<valuesPerFile; j++){
        line += ","+valuePrefix+j+"V"+Math.floor((Math.random()*(rangeValue[1]-rangeValue[0]))+rangeValue[0])

    }
    line += "\n"
//    var path = BASE_FILENAME+numFile+".csv"
    fs.writeSync(files[numFile],line);
//    var file = fs.appendFile(path,line,function(error){
//        console.log("ERROR!"+error)
//    });
//    var line =
}
//fs.closeSync(file);

fs.writeSync(statFile,"End: Date=["+(new Date(longTime))+"] LongDate=["+longTime+"]")
console.log("END")
