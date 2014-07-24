/**
 * Created by paco on 3/07/14.
 */

/*
 dynamicDistributionObject
 | keys (Array)
 | src
 | data
 | distributions
 |  | $keys (Object)
 |  |  | discrete (boolean)
 |  |  | values (Array)
 */
(function () {
    CSVContainerForDistributions.TYPE_ID = "Id";
    CSVContainerForDistributions.TYPE_DISCRETE = "Discrete";
    CSVContainerForDistributions.TYPE_CONTINUOUS = "Continuous";
    CSVContainerForDistributions.TYPE_DATE = "Date";
    CSVContainerForDistributions.REMOVE_CONTINOUS_UNKONWN = true;


    function CSVContainerForDistributions (srcFile) {
        if (srcFile !== undefined)
            this.init(srcFile);
    }

    /**
     * Critical function TODO
     * @param dimension
     */
    CSVContainerForDistributions.prototype.loadDimension = function(dimension,type) {
        if (this.currentDimension !== undefined){
            this.currentDimension.dispose();
        }
        var newDimension = new Object;
        newDimension.type = type;
        if (type == CSVContainerForDistributions.TYPE_CONTINUOUS){
            newDimension.dimension = this.data.dimension(function(d){
                if (d[dimension] == ""){
                    return null;
                } else {
                    return +d[dimension];
                }
            });
//            newDimension.dimension.filter([1,100]);

//            newDimension.dimension.filter(function(d){
//                if (d == null){
//                    return false;
//                }else {
//                    return true;
//                }
//            });

            newDimension.keys = [newDimension.dimension.bottom(1)[0][dimension],newDimension.dimension.top(1)[0][dimension]];

        } else if (type == CSVContainerForDistributions.TYPE_ID){
            // Ignored

        } else if (type == CSVContainerForDistributions.TYPE_DISCRETE){
            newDimension.dimension = this.data.dimension(function(d){
                return d[dimension]}
            );
            newDimension.values = newDimension.dimension.group().reduceCount();
            newDimension.keys = new Array();
            for (var key in newDimension.values.all()){
                newDimension.keys.push(newDimension.values.all()[key].key)
            }
        }
        this.currentDimension = newDimension.dimension;
        return newDimension;

    }
    CSVContainerForDistributions.prototype.categorizedBy = function(col){
        this.populationCol = col;
    }
    CSVContainerForDistributions.prototype.setCategoryCol = function(col){
        this.primaryCol = col;
    }

    CSVContainerForDistributions.prototype.getCategoryColInfo = function () {
        return this.distributions[this.primaryCol];
    }
    CSVContainerForDistributions.prototype.getPopulationCol= function(){
        return this.populationCol;
    }
    CSVContainerForDistributions.prototype.getCategoryCol= function(){
        return this.primaryCol;
    }
    CSVContainerForDistributions.prototype.getPopulationColInfo= function(){
        return this.distributions[this.populationCol];
    }

    CSVContainerForDistributions.prototype.getAttributeInfo= function(attribute){
        return this.distributions[attribute];
    }

    CSVContainerForDistributions.prototype.getKeys = function (){
        return this.keys;
    }


    CSVContainerForDistributions.prototype.init = function (srcFile) {


        /*Cambiando el contexto al propio this*/
//        var result = d3.csv.parse(filesInMemory[srcFile].data);
        processCSV.bind(this,srcFile,filesInMemory[srcFile].colsTypes,filesInMemory[srcFile].data).call()

    };


    this.CSVContainerForDistributions = CSVContainerForDistributions;
}())

function processCSV(srcFile,colsTypes, resourceData) {
    this.populationCol = "";
    this.primaryCol = "";
    /* Reset the principal object */
    if (resourceData.length > 0){
        this.src = srcFile
        this.keys = colsTypes;
        this.distributions = new Object()
        this.data = crossfilter(resourceData);
        this.secondaries = new Array();
        for (var key in resourceData[0]){
            var type = colsTypes[key];
            if (type !== undefined) {
                this.distributions[key] = new Object
                this.distributions[key].dimension = this.loadDimension.bind(this,key,type)
                this.distributions[key].keys = this.loadDimension(key,type).keys;
                this.distributions[key].key = key;
                this.distributions[key].type = type;
            }
        }
        this.loaded = true;

    }
}