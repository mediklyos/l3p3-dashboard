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
    CSVContainer.TYPE_ID = "id";
    CSVContainer.TYPE_DISCRETE = "discrete";
    CSVContainer.TYPE_CONTINUOUS = "continuous";
    CSVContainer.TYPE_DATE = "type_date";
    CSVContainer.REMOVE_CONTINOUS_UNKONWN = true;


    function CSVContainer (srcFile,colsTypes) {
        this.init(srcFile,colsTypes);
    }

    /**
     * Critical function TODO
     * @param dimension
     */
    CSVContainer.prototype.loadDimension = function(dimension,type) {
        if (this.currentDimension !== undefined){
            this.currentDimension.dispose();
        }
        var newDimension = new Object;
        newDimension.type = type;
        if (type == CSVContainer.TYPE_CONTINUOUS){
            newDimension.dimension = this.data.dimension(function(d){
                if (d[dimension] == ""){
                    return null;
                } else {
                    return +d[dimension];
                }
            });
            newDimension.dimension.filter(function(d){
                if (d == null){
                    return false;
                }else {
                    return true;
                }
            });

            newDimension.keys = [newDimension.dimension.bottom(1)[0],newDimension.dimension.top(1)[0]];

        } else if (type == CSVContainer.TYPE_ID){
            // Ignored

        } else if (type == CSVContainer.TYPE_DISCRETE){
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
    CSVContainer.prototype.categorizedBy = function(col){
        this.categoryCol = col;
    }
    CSVContainer.prototype.setPrimaryCol = function(col){
        this.primaryCol = col;
    }

    CSVContainer.prototype.getPrimaryColInfo = function () {
        return this.distributions[this.primaryCol];
    }
    CSVContainer.prototype.getCategoryCol= function(){
        return this.categoryCol;
    }
    CSVContainer.prototype.getPrimaryCol= function(){
        return this.primaryCol;
    }
    CSVContainer.prototype.getCategoryColInfo= function(){
        return this.distributions[this.categoryCol];
    }

    CSVContainer.prototype.getAttributeInfo= function(attribute){
        return this.distributions[attribute];
    }

    CSVContainer.prototype.getKeys = function (){
        return this.keys;
    }


    CSVContainer.prototype.init = function (srcFile,colsTypes) {

        this.categoryCol = "";
        this.primaryCol = "";
        /*Cambiando el contexto al propio this*/
        d3.csv(srcFile,function (error, resourceData, onload){
            if (error !== undefined && error != null) {
                console.log(error);
                alert("The data can not be loaded");
                throw error;
            }

            /* Traducción!*/
            /* Reset the principal object */
            if (resourceData.length > 0){
                this.src = srcFile
                this.keys = colsTypes;
                this.distributions = new Object()
                this.data = crossfilter(resourceData);
                this.secondaries = new Array();
                if (onload !== undefined){
                    onload(this);
                }
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
        }.bind(this))

    };


    this.CSVContainer = CSVContainer;
}())