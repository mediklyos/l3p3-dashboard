/**
 * Created by paco on 1/09/14.
 */

var PRE = views[0][2].constantsPrefix

var MAIN_DIV = PRE + "-main"

// HTML ID ELEMENTS
var TAN_INPUT = PRE + "-input-url"
var bigCSV;

function tcr_load(url) {
    var csvRequest = new CsvRequest(url, 0);
    csvRequest.fullProcess(function () {
//        var list = csvRequest.getFullCsv().orderedList()
//        console.log(list)
        csvRequest.getFullCsv().printTimes()
    });

}