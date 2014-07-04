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
    function CSVContainer (srcFile) {
        /*Cambiando el contexto al propio this*/
        d3.csv(srcFile,function (error, resourceData, onload){
            if (error !== undefined && error != null) {
                console.log(error);
                alert("The data can not be loaded");
                throw error;
            }
            /* Reset the principal object */
            if (resourceData.length > 0){
                this.src = srcFile
                this.keys = new Array();
                for (var key in resourceData[0]){
                    this.keys.push(key);
                }
                this.distributions = new Object()
                // TODO hacer para todo
                {
                    this.distributions["Pclass"] = new Object;
                    this.distributions["Pclass"].discrete = true;
                    this.distributions["Pclass"].values = new Array;
                    this.distributions["Pclass"].values.push(1);
                    this.distributions["Pclass"].values.push(2);
                    this.distributions["Pclass"].values.push(3);

                    this.distributions["Survived"] = new Object;
                    this.distributions["Survived"].discrete = true;
                    this.distributions["Survived"].values = new Array;
                    this.distributions["Survived"].values.push(0);
                    this.distributions["Survived"].values.push(1);
                }

                this.data = crossfilter(resourceData);
                this.dimensionsLoaded = new Object();
                this.secondaries = new Array();
                this.loaded = true;
                if (onload !== undefined){
                    onload(this);
                }
            }
        }.bind(this))
    }

    /**
     * Critical function TODO
     * @param dimension
     */
    CSVContainer.prototype.preLoadDimension = function(dimension) {
        var newDimension = new Object;
        newDimension.dimension = this.data.dimension(function(d){return d[dimension]});
        newDimension.values = newDimension.dimension.group().reduceCount();
        newDimension.keys = new Array();
        for (var key in newDimension.values.all()){
            newDimension.keys.push(newDimension.values.all()[key].key)
        }
        this.dimensionsLoaded[dimension] = newDimension;

    }

    CSVContainer.prototype.getPrimaryDimension = function(){
        return this.dimensionsLoaded[this.primary].dimension;
    }

    CSVContainer.prototype.getKeysForPrimaryDimension = function(){
        return this.dimensionsLoaded[this.primary].keys;
    }
    CSVContainer.prototype.getKeysForLoadedDimension = function (dimension){
        if (this.dimensionsLoaded[dimension] === undefined) {
            return undefined;
        }
        return dimensionsLoaded[dimension].keys;
    }

    CSVContainer.prototype.getDistribution = function (dimension){
        return newDimension.values.all();
    }

    CSVContainer.prototype.preLoadedDimension = function(dimension) {
        return this.dimensionsLoaded[dimension];
    }

    CSVContainer.prototype.getCategories = function() {

    }

    CSVContainer.prototype.getValuesOfCategory = function(category){

    }

    CSVContainer.prototype.isDiscrete = function (category) {
        return dynamicDistributionObject.distributions[category].discrete;
    };

    CSVContainer.prototype.possiblesValues = function (category){
        return dynamicDistributionObject.distributions[category].values;
    }
    /**
     * Call to a critical function
     * @param row
     */
    CSVContainer.prototype.setPrimary = function (row){
        this.primary = row;
        this.preLoadDimension(this.primary);
    }

    CSVContainer.prototype.categorizedBy = function (row){
        this.categoryRow = row;
    }


    this.CSVContainer = CSVContainer;
}())