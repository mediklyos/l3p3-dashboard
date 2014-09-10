/**
 * Created by paco on 8/09/14.
 */

(function (){

    var MAX_SEARCH_ELEMENTS = 5;
    function BigCsvProcess(timeColumn) {
        this.headers = undefined;
        this.lastPosition = 0;
        this.totalLines = 0;
        this.radixTree = {}
        this.timeColumn = timeColumn;
    }

    BigCsvProcess.prototype.setValueRule = function () {

    }

    BigCsvProcess.prototype.reset = function (){
        this.lastPosition = 0;
        this.totalLines = 0;
    }

    BigCsvProcess.prototype.search = function (prefix){
        var i = 0;
        var radixNode = this.radixTree;
        while ((prefix.charAt(i) != "") && radixNode !== undefined){
            var char = prefix.charAt(i);
            radixNode = radixNode[prefix.charAt(i)];
            i++;
        }
        return radixNode
    }



    BigCsvProcess.prototype.list = function (prefix){
        var radixNode = this.search(prefix);
        var list = []
        this._auxList(prefix,radixNode,0,list)
        return list;


    }

    BigCsvProcess.prototype._auxList = function (prefix, radixNode, elements,list){
        if (radixNode.hasElement){
            list.push(radixNode);
            elements++;
            if (elements >= MAX_SEARCH_ELEMENTS){
                return elements;
            }
        }
        var self = this;
        if (radixNode !== undefined) {
            for (var key in radixNode){
                if (key.length == 1) {
                    var radixNodeChild = radixNode[key]
                    elements = self._auxList(prefix,radixNodeChild,elements,list);
                    if (elements >= MAX_SEARCH_ELEMENTS){
                        return elements;
                    }
                }
            }
        }
        return elements;
    }
    BigCsvProcess.prototype.setStart = function (position) {
        this.lastPosition = position;
    }
    BigCsvProcess.prototype.process = function (string){
        if (string == ""){
            return this.lastPosition;
        }
        if(this.headers === undefined){
            var endHeaders = string.indexOf('\n',this.lastPosition);
            // No se han cargado todas las cabeceras, muy raro
            if (endHeaders == -1) {
                return this.lastPosition;
            }

            var sHeaders =  string.substring(this.lastPosition,endHeaders);
            this.headers = sHeaders.split(",");
            this.lastPosition = endHeaders + 1;
        }
        var lines = 0;
        var pos = string.indexOf("\n",this.lastPosition);
//        return;
        while (pos != -1){
            lines++;
            var data = string.substring(this.lastPosition,pos).split(",")
            var actualTime = undefined;
            if (this.timeColumn !== undefined) actualTime = data[this.timeColumn];
            for (var i = 0; i < data.length;i++){
                if (this.timeColumn != i) {
                    var j = 0;
                    var radixNode = this.radixTree
                    while (data[i].charAt(j) != "") {
                        // if not defined
                        if (!(radixNode[data[i].charAt(j)])) {
                            radixNode[data[i].charAt(j)] = {}
                            radixNode[data[i].charAt(j)].self = data[i].charAt(j);
                            radixNode[data[i].charAt(j)].name = data[i].slice(0,j+1);
                            radixNode[data[i].charAt(j)].column = this.headers[i]
                        }
                        radixNode = radixNode[data[i].charAt(j)];
                        j++;
                    }
                    if (!radixNode.hasElement) {
                        radixNode.self = data[i].charAt(j-1)
                        radixNode.hasElement = true;
                        radixNode.name = data[i];
                        radixNode.count = 1;
                    } else {
                        radixNode.count++;
                    }
                }
            }
            this.lastPosition = pos +1;
            pos = string.indexOf("\n",this.lastPosition);
        }
        this.totalLines  += lines;
        console.debug("Lines in this step: "+lines+", accumulated lines: "+this.totalLines)
        return this.lastPosition;
    }

    var _applyRules = function(){

    }

    var _applyFilters = function () {

    }

    this.BigCsvProcess = BigCsvProcess
}())