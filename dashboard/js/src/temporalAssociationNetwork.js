/**
 * Created by paco on 1/09/14.
 */

var PRE = views[0][2].constantsPrefix


// HTML ID ELEMENTS
var TAN_INPUT = PRE + "-input-url"
var bigCSV;

function tcr_load(url){
    console.log(url)
    var options = {
        port: 1337,
        hostname: '127.0.0.1',
        method: 'POST'
    };

    var request = new XMLHttpRequest();

    bigCSV = new BigCsvProcess(0);
    request.open('GET',url,true)
    request.onload = function (event){
        var target = (event.target)?event.target:event.srcElement;
        bigCSV.process(target.responseText)
//        var result = bigCSV.search("0x0V1000");
        var list = bigCSV.list("0x0");
        return;
    }
    request.abort = function (e){
//        console.log(e);
    }

    request.onloadstart = function (event){
//        var position = 0;
//        headers = undefined;
    }
    request.onerror = function (e){
//        console.log(e);
    }
    request.onprogress = function(event){

        var target = (event.target)?event.target:event.srcElement;
//        if (target.responseText == ""){
//            return;
//        }
        bigCSV.process(target.responseText)
        // first time


        return;
    }

    request.send(null)

}

