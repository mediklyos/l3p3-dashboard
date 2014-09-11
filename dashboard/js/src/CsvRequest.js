
(function () {
    function CsvRequest(url,timeColumn){
        this.url = url;
        this.timeColumn = timeColumn;
        this.request = _initRequest()
        this.fullCsvProcessed = undefined;

//        this.request.onload = function (event){
//            var target = (event.target)?event.target:event.srcElement;
//            this.stepStringProcess(target.responseText,bigCSV)
//        }
    }

    function _initRequest() {
        var request = new XMLHttpRequest();
        request.onload = function (event){
            var target = (event.target)?event.target:event.srcElement;
            this.stepStringProcess(target.responseText);
            this.callback();
        }

        request.onloadstart = function (event){
            // this is the request...
            this.headersRead = false;
            this.currentPosition = 0;

        }
        request.onprogress = function(event){
            var target = (event.target)?event.target:event.srcElement;
            this.stepStringProcess(target.responseText)
        }

        request.stepStringProcess = function(string) {
            if (string == ""){
                return;
            }
            // first time
            if(!this.headersRead){
                this.currentPosition = string.indexOf('\r\n\r\n',string.indexOf('\r\n\r\n')+1)+4;
                this.csv.setStart(this.currentPosition)
            }
            this.csv.process(string)
            return this.csv;
        }
        return request
    }

    CsvRequest.prototype.fullProcess = function (callback) {
        if (this.fullCsvProcessed === undefined) {
            delete this.fullCsvProcessed;
            this.fullCsvProcessed = new BigCsvProcess(this.timeColumn)
        }

        this.request.csv = this.fullCsvProcessed;
        this.request.open('GET',this.url,true)
        this.request.send(null);
        this.request.callback = callback;
    }

    CsvRequest.prototype.getFullCsv = function (){
        return this.request.csv;
    }

    var optionExample = {
        node : "nodename", // Mandatory
        column : "name", // optional, is more prioritary than nColumn
        nColumn : 0 , // Optional , the number of column
        temporalSlot : 0 // Mandatory, temporal slot in miliseconds,

    }
    CsvRequest.prototype.newQuery =function (){

    }

    this.CsvRequest = CsvRequest;
}())