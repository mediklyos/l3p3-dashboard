/**
 * Created by paco on 8/09/14.
 */

(function (){
    BigCsvProcess.prototype.ALPHABETICAL = "alphabetical"
    var MAX_SEARCH_ELEMENTS = 5;
    function BigCsvProcess(timeColumn,sort) {
        if (GLOBAL_DEBUG = true){
            sort = this.ALPHABETICAL;
        }
        this.headers = undefined;
        this.lastPosition = 0;
        this.totalLines = 0;
        this.radixTree = {}
        this.minnorOcurrence = undefined
        this.mayorOcurrence = undefined

        this.timeColumn = timeColumn;
        this.sort = sort;
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

    BigCsvProcess.prototype.orderedList = function (){
        var list = []
        var element = this.mayorOcurrence;
        for (var i = 0; i < MAX_SEARCH_ELEMENTS ; i++){
            list.push(element)
            if (element.prev != undefined){
                element = element.prev;
            } else {
                return list;
            }

        }
        return list;
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
        if (this.sort == this.ALPHABETICAL){
            return this.alphabeticalSort(string)
        }
    }
    BigCsvProcess.prototype.occurrenceSort = function (string) {


    }
    BigCsvProcess.prototype.alphabeticalSort = function (string){

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
                        radixNode.next = this.minnorOcurrence;
                        if (this.minnorOcurrence !== undefined){
                            this.minnorOcurrence.prev = radixNode;
                        } else {
                            this.mayorOcurrence = radixNode;
                        }
                        this.minnorOcurrence = radixNode;

                    } else {
                        radixNode.count++;
                        var nextRadixNode = radixNode.next;
                        while (nextRadixNode !== undefined && radixNode.count > nextRadixNode.count){
                            var newNext= nextRadixNode.next;
                            nextRadixNode.next = radixNode;
                            nextRadixNode.prev = radixNode.prev;
                            radixNode.prev = nextRadixNode;
                            radixNode.next = newNext;
                            if (nextRadixNode.prev != undefined) {
                                nextRadixNode.prev.next = nextRadixNode;
                            } else {
                                this.minnorOcurrence = nextRadixNode;
                            }
                            if (radixNode.next == undefined) {
                                this.mayorOcurrence = radixNode;
                            } else {
                                radixNode.next.prev = radixNode;
                            }
                            nextRadixNode = radixNode.next;
                        }
                        if (nextRadixNode === undefined){

                        }
                    }
//                    Debug!
//                    printOrder(this.minnorOcurrence)
                    printOrderInvert(this.mayorOcurrence)
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

function printOrder(node){
    var cad = "";
    while (node !== undefined){
        cad +=node.name+":"+node.count+"|";
        node = node.next;
    }
    console.log(cad);
}

function printOrderInvert(node){
    var cad = "";
    while (node !== undefined){
        cad +=node.name+":"+node.count+"|";
        node = node.prev;
    }
    console.log(cad);
}