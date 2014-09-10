
(function () {
    function CsvRequest(url,timeColumn){
        this.url = url;
        this.timeColumn = timeColumn;
        this.request = _initRequest()
        this.fullCsvProcessed = new BigCsvProcess(timeColumn)

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

    CsvRequest.prototype.fullProcess = function () {
        this.request.csv = this.fullCsvProcessed;
        this.request.open('GET',this.url,true)
        this.request.send(null);
    }

    this.CsvRequest = CsvRequest;
}())