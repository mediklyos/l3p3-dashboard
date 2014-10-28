/*
 * Created by paco on 23/10/14.
 */

var PRE = demoViews[0][0].constantsPrefix;
var ID_EXAMPLE = PRE +"-example"
var d3pExamples = {}

//var ID_EXAMPLE_1 = PRE +"-example-1"
//var ID_EXAMPLE_3 = PRE +"-example-3"
//var ID_EXAMPLE_4 = PRE +"-example-4"
//var ID_EXAMPLE_5 = PRE +"-example-5"
//var ID_EXAMPLE_6 = PRE +"-example-6"

var active = undefined;

var d3plusDemoResizeFunction = function (){
    if (active !== undefined){
        $("#viz").css('width','100%');
//        $("#viz1").css('width','100%');
        d3pExamples[active].function()
    }
}



var d3pStartRoutine = function () {
    enableLeftColumn();
    $(window).resize(d3plusDemoResizeFunction)
    clear  = function (){
        $(window).unbind('resize',d3plusDemoResizeFunction)
    }
    if (GLOBAL_DEBUG){
        changeExample(0)
    }
    initLeftColumn();

}

var initLeftColumn = function (){
    var main = $('<div/>',{

    }).appendTo("#"+LEFT_COLUMN_CONTENT)
    main.append('<h4>Examples</h4><div class="hr"/>')
    var buttonsDiv = $('<div/>',{
        class: "btn-toolbar",
        role:"toolbar",
        class: "lg-col-12",
        "data-toggle":  "buttons"

        }).appendTo(main);
    $.each(d3pExamples,function(key,value){
        $('<label class="d3p-buttons btn btn-default"><input type="radio" name="d3pExample" value="'+value.title+'"/>'+value.title+"</label><br>").appendTo(buttonsDiv).click(function(){
            changeExample(key);
        });
    })
}

var changeExample = function (example){
    active = example;
    $("#viz").empty();
    d3pExamples[example].function();
}

var d3pExample0 = function (){
    var data = [
        {"index":"a", "foo":20, "bar":5, "baz":77},
        {"index":"b", "foo":2, "bar":20},
        {"index":"c", "foo":94, "bar":55, "baz":101},
        {"index":"d", "bar":95, "baz":82}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(data)
        .type("table")
        .id("index")
        .shape("check")
        .cols(["foo", "bar", "baz"])
        .draw()
}

 var d3pExample1 = function (){
    var data = [
        {"year": 1991, "name":"alpha", "value": 15},
        {"year": 1992, "name":"alpha", "value": 34},
        {"year": 1991, "name":"alpha2", "value": 17},
        {"year": 1992, "name":"alpha2", "value": 65},
        {"year": 1991, "name":"beta", "value": 10},
        {"year": 1992, "name":"beta", "value": 10},
        {"year": 1991, "name":"beta2", "value": 40},
        {"year": 1992, "name":"beta2", "value": 38},
        {"year": 1991, "name":"gamma", "value": 5},
        {"year": 1992, "name":"gamma", "value": 10},
        {"year": 1991, "name":"gamma2", "value": 20},
        {"year": 1992, "name":"gamma2", "value": 34},
        {"year": 1991, "name":"delta", "value": 50},
        {"year": 1992, "name":"delta", "value": 43},
        {"year": 1991, "name":"delta2", "value": 17},
        {"year": 1992, "name":"delta2", "value": 35}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(data)
        .type("box")
        .id("name")
        .x("year")
        .y("value")
        .time("year")
        .draw()

}

var d3pExample2 = function () {
    var data = [
        {"year": 1991, "name":"alpha", "value": 15},
        {"year": 1991, "name":"beta", "value": -10},
        {"year": 1991, "name":"gamma", "value": 5},
        {"year": 1991, "name":"delta", "value": -50},
        {"year": 1992, "name":"alpha", "value": 20},
        {"year": 1992, "name":"beta", "value": -10},
        {"year": 1992, "name":"gamma", "value": 10},
        {"year": 1992, "name":"delta", "value": -43},
        {"year": 1993, "name":"alpha", "value": 30},
        {"year": 1993, "name":"beta", "value": -40},
        {"year": 1993, "name":"gamma", "value": 20},
        {"year": 1993, "name":"delta", "value": -17},
        {"year": 1994, "name":"alpha", "value": 60},
        {"year": 1994, "name":"beta", "value": -60},
        {"year": 1994, "name":"gamma", "value": 25},
        {"year": 1994, "name":"delta", "value": -32}
    ]

     var visualization = d3plus.viz()
         .container("#viz")
         .data(data)
         .type("bar")
         .id("name")
         .x({"stacked": true, "value": "value"})
         .y("year")
         .time("year")
         .draw()
}
var d3pExample3 = function () {
    var data = [
        {"year": 1991, "name":"alpha", "value": 15},
        {"year": 1991, "name":"beta", "value": 10},
        {"year": 1991, "name":"gamma", "value": 5},
        {"year": 1991, "name":"delta", "value": 50},
        {"year": 1992, "name":"alpha", "value": 20},
        {"year": 1992, "name":"beta", "value": 10},
        {"year": 1992, "name":"gamma", "value": 10},
        {"year": 1992, "name":"delta", "value": 43},
        {"year": 1993, "name":"alpha", "value": 30},
        {"year": 1993, "name":"beta", "value": 40},
        {"year": 1993, "name":"gamma", "value": 20},
        {"year": 1993, "name":"delta", "value": 17},
        {"year": 1994, "name":"alpha", "value": 60},
        {"year": 1994, "name":"beta", "value": 60},
        {"year": 1994, "name":"gamma", "value": 25},
        {"year": 1994, "name":"delta", "value": 32}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(data)
        .type("bar")
        .id("name")
        .x("year")
        .y("value")
        .draw()
}
var d3pExample4 = function () {
    var data = [
        {"value": 100, "name": "alpha"},
        {"value": 70, "name": "beta"},
        {"value": 40, "name": "gamma"},
        {"value": 15, "name": "delta"},
        {"value": 5, "name": "epsilon"},
        {"value": 1, "name": "zeta"}
    ]

    d3plus.viz()
        .container("#viz")
        .data(data)
        .type("pie")
        .id("name")
        .size("value")
        .draw()
}
var d3pExample5 = function () {
    var sample_data = [
        {"value": 100, "name": "alpha", "group": "group 1"},
        {"value": 70, "name": "beta", "group": "group 2"},
        {"value": 40, "name": "gamma", "group": "group 2"},
        {"value": 15, "name": "delta", "group": "group 2"},
        {"value": 5, "name": "epsilon", "group": "group 1"},
        {"value": 1, "name": "zeta", "group": "group 1"}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("tree_map")
        .id(["group","name"])
        .size("value")
        .aggs({"value": "mean"})
        .draw()
}
var d3pExample6 = function () {
    var sample_data = [
        {"value": 100, "name": "alpha", "group": "group 1"},
        {"value": 70, "name": "beta", "group": "group 2"},
        {"value": 40, "name": "gamma", "group": "group 2"},
        {"value": 15, "name": "delta", "group": "group 2"},
        {"value": 5, "name": "epsilon", "group": "group 1"},
        {"value": 1, "name": "zeta", "group": "group 1"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .data(sample_data) // data to use with the visualization
        .type("bubbles") // visualization type
        .id(["group", "name"]) // nesting keys
        .depth(1) // 0-based depth
        .size("value") // key name to size bubbles
        .color("group") // color by each group
        .draw()
}
var d3pExample7 = function () {
    var sample_data = [
        {"value": 100, "name": "alpha"},
        {"value": 70, "name": "beta"},
        {"value": 40, "name": "gamma"},
        {"value": 15, "name": "delta"},
        {"value": 5, "name": "epsilon"},
        {"value": 1, "name": "zeta"}
    ]

    var htmlButton = "<a id='google' href='http://www.google.com' target='_blank'>Click here to go to Google</a>"

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .id("name")
        .size("value")
        .tooltip({"html": htmlButton})
        .type("tree_map")
        .draw()
}
var d3pExample8 = function () {
    var sample_data = [
        {"year": 1991, "name":"alpha", "value": 29},
        {"year": 1992, "name":"alpha", "value": 18},
        {"year": 1993, "name":"alpha", "value": 2},
        {"year": 1994, "name":"alpha", "value": 7},
        {"year": 1991, "name":"beta", "value": 11},
        {"year": 1992, "name":"beta", "value": 15},
        {"year": 1993, "name":"beta", "value": 37},
        {"year": 1994, "name":"beta", "value": 54}
    ]
    var attributes = [
        {"name": "alpha", "hex": "#CC0000"},
        {"name": "beta", "hex": "#00CC00"}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("line")
        .id("name")
        .y("value")
        .x("year")
        .attrs(attributes)
        .color("hex")
        .draw()
}
var d3pExample9 = function () {
    var positions = [
        {"name": "alpha", "x": 10, "y": 4},
        {"name": "beta", "x": 12, "y": 24},
        {"name": "gamma", "x": 17, "y": 14}
    ]

// create list of node connections
    var connections = [
        {"source": "alpha", "target": "beta"},
        {"source": "alpha", "target": "gamma"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz")
        .type("network")
        .nodes(positions)
        .edges(connections)
        .id("name")
        .draw()

// After 2 seconds, add another node and connection!
    setTimeout(function(){

        positions.push({"name": "delta", "x": 26, "y": 21})
        connections.push({"source": "beta", "target": "delta"})

        visualization
            .nodes(positions)
            .edges(connections)
            .draw()

    },2000)
}
var d3pExample10 = function () {
    var trade_data = [
        {"usd": 34590873460, "product": "Oil"},
        {"usd": 12897429187, "product": "Cars"},
        {"usd": 8974520985, "product": "Airplanes"},
        {"usd": 9872342, "product": "Apples"},
        {"usd": 6897234098, "product": "Shoes"},
        {"usd": 590834587, "product": "Glass"},
        {"usd": 987234261, "product": "Horses"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz")
        .data(trade_data)
        .type("tree_map")
        .id("product")
        .size("usd")
        .format({
            "text": function(text, key) {
                if (text === "usd") {
                    return "Trade Value";
                }
                else {
                    return d3plus.string.title(text, key);
                }
            },
            "number": function(number, key) {
                var formatted = d3plus.number.format(number, key)
                if (key === "usd") {
                    return "$" + formatted + " USD"
                }
                else {
                    return formatted
                }
            }
        })
        .draw()
}
var d3pExample11 = function () {
    var sampleData = [
        {"group": "fruits", "food": "apple"},
        {"group": "fruits", "food": "banana"},
        {"group": "vegetables", "food": "broccoli"},
        {"group": "vegetables", "food": "carrot"},
        {"group": "grains"},
    ]

    var toggles = d3plus.form()
        .data(sampleData)
        .focus("carrot")
        .id(["group","food"])
        .title("Nested Toggle")
        .type("toggle")
        .draw()

    var dropdown = d3plus.form()
        .data(sampleData)
        .focus("carrot")
        .id(["group","food"])
        .title("Nested Drop Down")
        .type("drop")
        .draw()
}
var d3pExample12 = function () {
    var colors = d3plus.color.scale.range()

    colors = colors.concat(["#525252", "#737373", "#969696", "#bdbdbd", "#d9d9d9", "#f7f7f7"])

    var squares = d3.select("#viz").selectAll("div.color")
        .data( colors )
        .enter().append("div")
        .attr("class","color")
        .attr("id", String)
        .style("background-color", String)
        .style("color", function(d){
            return d3plus.color.text(d)
        })
        .text(String)
    $("#viz").children(".color").css("display","inline-block")
    $("#viz").children(".color").css("font",'15px "Helvetica", "Arial", sans-serif')
    $("#viz").children(".color").css("margin","15px")
    $("#viz").children(".color").css("padding","25px 10px")
    $("#viz").children(".color").css("width","100px")
}
var d3pExample13 = function () {
    $("#viz").append('' +
        '<style>' +
        'svg {' +
        'font-family: "Helvetica", "Arial", sans-serif;' +
        'height: 425px;' +
        'margin: 25px;' +
        'width: 900px;' +
        '}' +
        '.type {' +
        'fill: #888;' +
        'text-anchor: middle;' +
        '}' +
        '.shape {' +
        'fill: #eee;' +
        'stroke: #ccc;' +
        '}'+

         '</style>' +
        '<svg>' +
        '<text class="type" dy="15px" x="75px">Wrapped</text>' +
        '<rect class="shape" height="150px" width="150px" y="50px"></rect>' +
        '<text id="rectWrap" class="wrap" dy="12" y="50px" font-size="12">' +
        'Here is a long text string that SVG should wrap by default, but it does not.' +
        '</text>' +
        '<circle class="shape" r="75px" cx="75px" cy="300px"=></circle>' +
        '<text id="circleWrap" class="wrap" y="225px" x="75px" font-size="12">' +
        'Here is a long text string that SVG should wrap by default, but it does not.' +
        '</text>' +
        '<text class="type" dy="15px" x="275px">Resized</text>' +
        '<rect class="shape" height="150px" width="150px" y="50px" x="200px"></rect>' +
        '<text id="rectResize" class="wrap" dy="12" y="50px" x="200px" font-size="12">' +
        'Here is a long text string that SVG should wrap by default, but it does not.' +
        '</text>' +
        '<circle class="shape" r="75px" cx="275px" cy="300px"=></circle>' +
        '<text id="circleResize" class="wrap" y="225px" x="275px" font-size="12">' +
        'Here is a long text string that SVG should wrap by default, but it does not.' +
        '</text>' +
        '<text class="type" dy="15px" x="475px">Original</text>' +
        '<rect class="shape" height="150px" width="150px" y="50px" x="400px"></rect>' +
        '<text class="wrap" dy="12" y="50px" x="400px" font-size="12">' +
        'Here is a long text string that SVG should wrap by default, but it does not.' +
        '</text>' +
        '<circle class="shape" r="75px" cx="475px" cy="300px"=></circle>' +
        '<text class="wrap" y="225px" x="475px" font-size="12">' +
        'Here is a long text string that SVG should wrap by default, but it does not.' +
        '</text>' +
        '</svg>')
    d3plus.textwrap()
        .container(d3.select("#rectWrap"))
        .draw();

// Wrap text in a rectangle, and size the text to fit.
    d3plus.textwrap()
        .container(d3.select("#rectResize"))
        .resize(true)
        .draw();

// Wrap text in a circle.
    d3plus.textwrap()
        .container(d3.select("#circleWrap"))
        .shape("circle")
        .draw();

// Wrap text in a circle, and size the text to fit.
    d3plus.textwrap()
        .container(d3.select("#circleResize"))
        .resize(true)
        .shape("circle")
        .draw();
}
var d3pExample14 = function () {

    var colors = d3plus.color.scale.range()

    colors = colors.concat(["#525252", "#737373", "#969696", "#bdbdbd", "#d9d9d9", "#f7f7f7"])
    $("#viz").append('' +
        '<style>' +
        'div#grid {' +
        'margin: 25px auto;' +
        'text-align: center;' +
        'width: 700px;' +
        '}' +
        'div.color {' +
        'border-left: 25px solid;' +
        'display: inline-block;' +
        'margin: 10px;' +
        'padding: 0px 10px;' +
        'width: 75px;' +
        '}' +
        'div.text {' +
        'font: 15px "Helvetica", "Arial", sans-serif;' +
        'margin: 5px 0px;' +
        '}' +
        '</style>')
    var squares = d3.select("#viz").selectAll("div.color")
        .data( colors )
        .enter().append("div")
        .attr("class","color")
        .attr("id", String)
        .style("border-color", String)

    squares.selectAll(".text")
        .data([ "Original" , "Legible" ])
        .enter().append("div")
        .attr("class","text")
        .style("color", function(d) {
            var color = this.parentNode.id
            return d === "Legible" ? d3plus.color.legible(color) : color
        })
        .text(String)
}
var d3pExample15 = function () {}
var d3pExample16 = function () {
    var connections = [
        {"source": "alpha", "target": "beta"},
        {"source": "alpha", "target": "gamma"},
        {"source": "beta", "target": "delta"},
        {"source": "beta", "target": "epsilon"},
        {"source": "zeta", "target": "gamma"},
        {"source": "theta", "target": "gamma"},
        {"source": "eta", "target": "gamma"}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .type("rings")
        .edges(connections)
        .focus({
            "tooltip" : false,
            "value" : "alpha"
        })
        .draw()
}
//var d3pExample17 = function () {}
//var d3pExample18 = function () {}
var d3pExample19 = function () {
    var sample_data = [
        {"valor": 100, "nome": "alpha", "grupo": "Grupo A"},
        {"valor": 70, "nome": "beta", "grupo": "Grupo B"},
        {"valor": 40, "nome": "gamma", "grupo": "Grupo B"},
        {"valor": 15, "nome": "delta", "grupo": "Grupo A"},
        {"valor": 5, "nome": "epsilon", "grupo": "Grupo B"},
        {"valor": 1, "nome": "zeta", "grupo": "Grupo A"}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("tree_map")
        .id([ "grupo" , "nome" ])
        .size("valor")
        .format("pt_BR")
        .draw()
}
var d3pExample20 = function () {
    var sample_data = [
        {"value": 100, "name": "alpha", "weight": 80},
        {"value": 70, "name": "beta", "weight": 43},
        {"value": 40, "name": "gamma", "weight": 64},
        {"value": 15, "name": "delta", "weight": 20},
        {"value": 5, "name": "epsilon", "weight": 92},
        {"value": 1, "name": "zeta", "weight": 35}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("tree_map")
        .id("name")
        .color("name")
        .size("value")
        .ui([
            {
                "method" : "size",
                "value" : [ "value" , "weight" ]
            },
            {
                "method" : "color",
                "value" : [ "name" , "weight" ]
            }
        ])
        .draw()
}
var d3pExample21 = function () {
    var sample_data = [
        {"year": 1991, "name":"alpha", "value": 15},
        {"year": 1992, "name":"alpha", "value": 20},
        {"year": 1994, "name":"alpha", "value": 30},
        {"year": 1995, "name":"alpha", "value": 60},
        {"year": 1993, "name":"beta", "value": 40},
        {"year": 1994, "name":"beta", "value": 60},
        {"year": 1995, "name":"beta", "value": 10},
        {"year": 1994, "name":"gamma", "value": 35},
        {"year": 1995, "name":"gamma", "value": 40}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("tree_map")
        .id("name")
        .size("value")
        .time({"value": "year", "solo": 1994})
        .draw()
}

var d3pExample22 = function () {
    var sample_data = [
        {"value": 2315987123, "country": "nausa", "name": "United States"},
        {"value": 38157121349, "country": "aschn", "name": "China"},
        {"value": 21891735098, "country": "euesp", "name": "Spain"},
        {"value": 9807134982, "country": "sabra", "name": "Brazil"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz")
        .type("geo_map")
        .data(sample_data)
        .coords("/data/d3pDemo/countries.json")
        .id("country")
        .text("name")
        .color({
            "heatmap": [ "grey" , "purple" ],
            "value": "value"
        })
        .draw()
}
var d3pExample23 = function () {
    var sample_data = [
        {"value": 100, "name": "alpha", "growth": .9},
        {"value": 70, "name": "beta", "growth": .4},
        {"value": 40, "name": "gamma", "growth": -.3},
        {"value": 15, "name": "delta", "growth": -.65},
        {"value": 5, "name": "epsilon", "growth": .7},
        {"value": 1, "name": "zeta", "growth": .2}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("tree_map")
        .id("name")
        .size("value")
        .color({
            "range": [ "blue" , "white" , "yellow" ],
            "value": "growth"
        })
        .draw()
}
//var d3pExample2 = function () {}
//var d3pExample2 = function () {}
//var d3pExample2 = function () {}
//var d3pExample2 = function () {}
//var d3pExample2 = function () {}
var d3pExample29 = function () {
    var sample_data = [
        {"value": 100, "name": "alpha"},
        {"value": 70, "name": "beta"},
        {"value": 40, "name": "gamma"},
        {"value": 15, "name": "delta"},
        {"value": 5, "name": "epsilon"},
        {"value": 1, "name": "zeta"}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("tree_map")
        .id("name")
        .size("value")
        .title("Titles and Footers Example")
        .title({
            "sub": "Subtitles are smaller than titles.",
            "total": true
        })
        .footer({
            "link": "http://www.google.com",
            "value": "Click here to search Google"
        })
        .draw()
}
d3pExamples[0] = {title: "Simple Table",function:d3pExample0/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[1] = {title: "Simple Box and Whisker", function:d3pExample1/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[2] = {title: "Stacked Bar Chart",function:d3pExample2/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[3] = {title: "Simple Bar Chart",function:d3pExample3/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[4] = {title: "Simple Pie Chart",function:d3pExample4/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[5] = {title: "Custom Data Aggregations",function:d3pExample5/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[6] = {title: "Simple Bubbles",function:d3pExample6/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[7] = {title: "Adding Static HTML Content",function:d3pExample7/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[8] = {title: "Assigning Custom Color",function:d3pExample8/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[9] = {title: "Adding Nodes and Edges to a Network",function:d3pExample9/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[10] = {title: "Custom Text and Number Formatting",function:d3pExample10/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
//d3pExamples[11] = {title: "Multi-level Nesting in Forms",function:d3pExample11/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[12] = {title: "Legible Text on Colored Backgrounds",function:d3pExample12/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[13] = {title: "SVG Text Wrapping",function:d3pExample13/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[14] = {title: "Colored Text Legible on<br> White Backgrounds",function:d3pExample14/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
//d3pExamples[15] = {title: "Lighten Colors",function:d3pExample15/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
d3pExamples[16] = {title: "Hiding the Focus Tooltip",function:d3pExample16/*,resize:d3pResize1,drawingContainer: 'viz1'*/}
//d3pExamples[17] = {title: "Forms from Javascript",function:d3pExample17/*,resize:d3pResize17,drawingContainer: 'viz1'*/}
//d3pExamples[18] = {title: "Forms from HTML",function:d3pExample18/*,resize:d3pResize18,drawingContainer: 'viz1'*/}
d3pExamples[19] = {title: "Changing the Language to Portuguese",function:d3pExample19/*,resize:d3pResize19,drawingContainer: 'viz1'*/}
d3pExamples[20] = {title: "Adding Custom Interface Elements",function:d3pExample20/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
d3pExamples[21] = {title: "Using a Timeline",function:d3pExample21/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
d3pExamples[22] = {title: "Changing the Default Color Heatmap",function:d3pExample22/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
d3pExamples[23] = {title: "Changing the Default Color Range",function:d3pExample23/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
// d3pExamples[2] = {title: "",function:d3pExample2/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
// d3pExamples[2] = {title: "",function:d3pExample2/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
// d3pExamples[2] = {title: "",function:d3pExample2/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
// d3pExamples[2] = {title: "",function:d3pExample2/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
// d3pExamples[2] = {title: "",function:d3pExample2/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
//d3pExamples[29] = {title: "Titles and Footers",function:d3pExample29/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
// d3pExamples[2] = {title: "",function:d3pExample2/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
// d3pExamples[2] = {title: "",function:d3pExample2/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
// d3pExamples[2] = {title: "",function:d3pExample2/*,resize:d3pResize2,drawingContainer: 'viz1'*/}
