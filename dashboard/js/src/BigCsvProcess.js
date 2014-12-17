/**
 * Created by paco on 8/09/14.
 */
/* Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
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
        this.occurrenceLists = [];

        this.timeColumn = timeColumn;
        this.sort = sort;
        this.time1 = 0;
        this.time2 = 0;
        this.time3 = 0;
        this.time4 = 0;
        this.time5 = 0;
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
        var tt3 = Date.now();

        var list = []
        list.push (this.radixTree);
        while (!list.isEmpty()){
            var radixNode = list.pop();
            var self = this;
            $.each(radixNode, function(key){
                if (key.length == 1){
                    list.push(this);
                    if (this.hasElement) {
                        if (self.occurrenceLists[this.count] === undefined){
                            for (var i = self.occurrenceLists.length; i <= this.count;i++){

                                self.occurrenceLists.push({list:[],occurrences: 0});

                            }
                        }
                        self.occurrenceLists[this.count].list.push(this);
                        self.occurrenceLists[this.count].occurrences++;
                    }
                }

            })
        }
        this.time3 = Date.now() - tt3;

    }



    BigCsvProcess.prototype.alphabeticalSort = function (string){

        var tt1, tt2, tt3, tt4, tt5 = 0;
        var lines = 0;
        var pos = string.indexOf("\n",this.lastPosition);
//        return;
        tt1 = Date.now();
        while (pos != -1){
            lines++;

            var data = string.substring(this.lastPosition,pos).split(",")
            var actualTime = undefined;
            if (this.timeColumn !== undefined) actualTime = data[this.timeColumn];
            for (var i = 0; i < data.length;i++){
                if (this.timeColumn != i) {
                    var j = 0;
                    var radixNode = this.radixTree
                    tt2 = Date.now();
                    /* Crea las ramas radix si no existen*/
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
                    this.time2 += (tt2 = Date.now() - tt2);
                    /*Introducen los valores en las ramas radix, si existen aumentan el contador*/
                    if (!radixNode.hasElement) {
                        radixNode.hasElement = true;
                        radixNode.count = 0;

                    } else {
                        radixNode.count++;
                    }
//                    Debug!
//                    printOrder(this.minnorOcurrence)
//                    printOrderInvert(this.mayorOcurrence)
                }
            }
            this.lastPosition = pos +1;
            pos = string.indexOf("\n",this.lastPosition);
        }
        this.totalLines  += lines;
        this.time1 += (tt1 = Date.now() -tt1);
        console.debug("Lines in this step: "+lines+", accumulated lines: "+this.totalLines);//+", nodes processed="+(lines*4)+ ", Sort While steps="+tt5);
        console.debug("Parcial: Time1="+tt1+" ,Time2="+tt2);//+" ,Time3="+tt3+" ,Time4="+tt4+" ,Time5="+0+" ,")

        return this.lastPosition;
    }

    var _applyRules = function(){

    }

    var _applyFilters = function () {

    }

    BigCsvProcess.prototype.printTimes = function(){

        console.log("Time1="+this.time1+" ,Time2="+this.time2+" ,Time3="+this.time3);//+" ,Time4="+this.time4+" ,Time5="+this.time5+" ,")
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