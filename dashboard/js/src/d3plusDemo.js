/*
 * Created by paco on 23/10/14.
 */

var PRE = demoViews[0][0].constantsPrefix;
var ID_EXAMPLE = PRE +"-example"
var D3P_FOOTER = PRE + "-footer"
var D3P_FOOTER_CODE = PRE + "-footer-code"
var D3P_BUTTONS_LIST = PRE + "-buttons-list"
var d3pExamples = {}

var D3P_TEMPLATE_DIR = "/js/templates/d3pDemo/"
//var ID_EXAMPLE_1 = PRE +"-example-1"
//var ID_EXAMPLE_3 = PRE +"-example-3"
//var ID_EXAMPLE_4 = PRE +"-example-4"
//var ID_EXAMPLE_5 = PRE +"-example-5"
//var ID_EXAMPLE_6 = PRE +"-example-6"

var active = undefined;

var d3plusDemoResizeFunction = function (){
    if (active !== undefined){
        $("#viz").css('width','100%');
        $("#viz").css('height','100%');
//        $("#viz1").css('width','100%');
        changeExample(active)
    }
}

var d3plusSetFooter = function (content) {
    $("#"+FOOTER_CONTENT_ID).empty();
    $('<div/>',{
        id : D3P_FOOTER
    }).appendTo("#"+FOOTER_CONTENT_ID)
    $('<h3>'+d3pExamples[active].title+'</h3>').appendTo("#"+D3P_FOOTER);
    $('<p id="'+D3P_FOOTER+'">'+content+'</p>').appendTo("#"+D3P_FOOTER)
    $(function (){
        if (d3pExamples[active].codeRef !== undefined && d3pExamples[active].codeRef !== ""){
            $('<h4>Code:</h4>').appendTo("#"+D3P_FOOTER);
            $('<div/>',{
                id: D3P_FOOTER_CODE
            }).appendTo("#"+D3P_FOOTER)
            $("#"+D3P_FOOTER_CODE).html(new EJS({url: D3P_TEMPLATE_DIR + d3pExamples[active].codeRef}).render());

        }
    })
}

var d3pStartRoutine = function () {
    enableLeftColumn();
    enableFooter();
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
//    main.css('overflow','auto')
//    main.css('height','100px')
    main.append('<h4>Examples</h4><div class="hr"/>')
//    style="
//    height: 100%;
//    "
    var buttonsDiv = $('<div/>',{
        class: "btn-toolbar lg-col-12",
        role:"toolbar",
        "data-toggle":  "buttons",
        id : D3P_BUTTONS_LIST,
//        style: 'height: 100px'
        style: 'height: 100%'
        }).appendTo(main);
    $.each(d3pExamples,function(key,value){
        $('<label class="d3p-buttons btn btn-default" title="'+value.title+'"><input type="radio" name="d3pExample" value="'+key+'"/>'+value.title+"</label><br>").appendTo(buttonsDiv).click(function(){
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
    d3plusSetFooter('<p>This visualization accompanies <a href="http://d3plus.org/blog/advanced/2014/09/28/new-visualization-guide/">this blog post</a> by Alexander Simoes, which is a guide to creating new visualization types. It is a table, or more descriptively, a visual representation of a table.</p>');
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
     d3plusSetFooter('<p>Data can be drawn using a Box and Whisker Plot, which helps highlight outliers and give a quick snapshot of the different quartiles of the dataset.</p>')

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
    d3plusSetFooter('<p>In this advanced Bar Chart example, there are both negative and positive values in the data and they are being displayed on a stacked <a href="https://github.com/alexandersimoes/d3plus/wiki/Visualizations#x">x axis</a>. Additionally, <a href="https://github.com/alexandersimoes/d3plus/wiki/Visualizations#time">.time( )</a> is being declared in order to enable a timeline that allows changing the scope of the data being displayed.</p>')
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
    d3plusSetFooter('<p><strong>D3plus</strong> has the ability to create all sorts of Bar Charts. Each axis is chosen independently from one another, and data defaults to grouping along the <a href="https://github.com/alexandersimoes/d3plus/wiki/Visualizations#x">x axis</a>.</p>')
}
var d3pExample4 = function () {
    d3plusSetFooter('<p>Pie Charts are really easy to make with <strong>d3plus</strong>. The data only needs to have <a href="https://github.com/alexandersimoes/d3plus/wiki/Visualizations#id">.id()</a> and <a href="https://github.com/alexandersimoes/d3plus/wiki/Visualizations#size">.size()</a> values. In general, it operates very similar to <a href="http://d3plus.org/examples/basic/9029130/">tree maps</a>, including <a href="http://d3plus.org/examples/advanced/9860411/">data nesting and grouping</a>.</p>')
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
    d3plusSetFooter('<p>By using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Custom-Aggregations">.aggs( )</a> method, the aggregation method of different variables can be modified. In this example, the aggregation method for the "value" key is changed to "mean" (the default is "sum").</p>' +
        '<p>In addition to supporting all of the standard D3 <a href="https://github.com/mbostock/d3/wiki/Arrays#d3_min">array comparators</a>, this method also accepts custom functions.</p>')

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
    d3plusSetFooter('<p>Enclosure diagrams use containment (nesting) to represent the hierarchy. The size of each leaf node’s circle reveals a quantitative dimension of each data point. The enclosing circles show the approximate cumulative size of each subtree, but note that because of wasted space there is some distortion between levels; only the leaf nodes can be compared accurately. Although circle packing does not use space as efficiently as a treemap, the “wasted” space more prominently reveals the hierarchy.</p>')

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
    d3plusSetFooter('<p>It is possible to add custom HTML content to large tooltips by passing an HTML-formatted string to the "html" key in <a href="https://github.com/alexandersimoes/d3plus/wiki/Tooltip-Parameters#object">.tooltip( )</a>. In this example, a custom link to Google.com is inserted into the large tooltip that appears when clicking on a square in the Tree Map.')

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
    d3plusSetFooter('<p>Sometimes, data may already have inherit color values that you may wish to use.</p>' +
        '<p>In this example, we pass an attribute list to <a href="https://github.com/alexandersimoes/d3plus/wiki/Attribute-Data">.attrs( )</a> and tell the <a href="https://github.com/alexandersimoes/d3plus/wiki/Color-Parameters">.color( )</a> method to use the <code>"hex"</code> key for the color value. Attribute lists are beneficial when you have attributal data that matches to multiple data points, in this case each year\'s value has the same color.</p>' +
        '<p>Additionally, when a custom Color Parameters is defined, a <a href="https://github.com/alexandersimoes/d3plus/wiki/Legend">Legend</a> will display that shows each color group.</p>')

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
    d3plusSetFooter('<p>Every <a href="https://github.com/alexandersimoes/d3plus/wiki/Methods">method</a> can be modified at any time after the initial drawing of a visualization.</p>' +
        '<p>In this example, after waiting 2 seconds, a new node and edge is added to the respective array variables, passed again to the <a href="https://github.com/alexandersimoes/d3plus/wiki/Node-Positions">.nodes( )</a> and <a href="https://github.com/alexandersimoes/d3plus/wiki/Edges-List">.edges( )</a> methods, and the visualization is finally redrawn by calling the <a href="https://github.com/alexandersimoes/d3plus/wiki/Draw">.draw( )</a> method once more.</p>')

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
    d3plusSetFooter('<p>By default <strong>D3plus</strong> tries to print numbers and text in a clean, consistent way. Sometimes, customization may be required that is outside of this basic formatting.</p>' +
        '<p>The <a href="https://github.com/alexandersimoes/d3plus/wiki/Value-Formatting">.format( )</a> method provides access to override the default "text" and "number" formatting functions. Each function gets passed both the value being formatted, and the key (if applicable) associated with that value.</p>' +
        '<p>In this example, the label "usd" is being changed to "Trade Value" and all values are being prefixed with "$" and suffixed with "USD". Hover over one of the Tree Map squares to see the modified output.</p>')

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
    d3plusSetFooter('<p><a href="https://github.com/alexandersimoes/d3plus/wiki/Forms">D3plus Forms</a> support nesting just like Visualizations.</p>')
    var sampleData = [
        {"group": "fruits", "food": "apple"},
        {"group": "fruits", "food": "banana"},
        {"group": "vegetables", "food": "broccoli"},
        {"group": "vegetables", "food": "carrot"},
        {"group": "grains"}
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
    d3plusSetFooter('<p>Using <a href="https://github.com/alexandersimoes/d3plus/wiki/Color-Utilities#text">d3plus.color.text</a> provides the ability to dynamically assign a text color (either light or dark) depending on a background color.</p>')
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
    d3plusSetFooter('<p>Using <a href="https://github.com/alexandersimoes/d3plus/wiki/Text-Wrapping">d3plus.textwrap</a>, SVG <code>&lt;text&gt;</code> elements can be broken into separate lines, as HTML does with <code>&lt;div&gt;</code> elements. In this example, the first column shows normal wrapped text, the second column shows text that is resized to fill the available space, and the third column shows the default SVG behavior.</p>' +
        '<p>If the user has not specified <a href="https://github.com/alexandersimoes/d3plus/wiki/Text%20Wrapping#width">.width( )</a> and <a href="https://github.com/alexandersimoes/d3plus/wiki/Text%20Wrapping#height">.height( )</a> restrictions, D3plus tries to infer this information from any SVG <code>&lt;rect&gt;</code> or <code>&lt;circle&gt;</code> element place directly before it in DOM.</p>')
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
    d3plusSetFooter('<p>Using <a href="https://github.com/alexandersimoes/d3plus/wiki/Color-Utilities#legible">d3plus.color.legible</a>, a color\'s luminosity and saturation can be tweaked so that it is much easier to read on a white background, while still retaining as much of the original color as possible.</p>' +
        '<p>This example shows how various colors are modified using this function. The lighter colors are darkened the most.</p>')

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
var d3pExample15 = function () {
    d3plusSetFooter('<p>Using <a href="https://github.com/alexandersimoes/d3plus/wiki/Color-Utilities#lighter">d3plus.color.lighter( )</a>, a color\'s luminosity can be increased based on a specified increment. In this example, each color in the default <strong>D3plus</strong> color scale is shown at various ligher states, by increments of <code>0.1</code>. </p>')

}
var d3pExample16 = function () {
    d3plusSetFooter('<p>Visualizations that support setting a <a href="https://github.com/alexandersimoes/d3plus/wiki/Focus-Element">Focus Element</a> automatically create a tooltip on the right side of the visualization for that element (if there is data to show).</p>' +
        '<p>To disable this tooltip from displaying, we simply set the "tooltip" parameter of .focus( ) to <code>false</code>.</p>')

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
    d3plusSetFooter('<p>The <a href="https://github.com/alexandersimoes/d3plus/wiki/Value-Formatting">formatting</a> method allows the localization of common interface words, such as the "Back" button and the "Share" label in this visualization.</p>' +
        '<p>A list of currently supported localizations (and how to contribute) can be found <a href="https://github.com/alexandersimoes/d3plus/wiki/Localization">here</a>.</p>')

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
    d3plusSetFooter('<p><a href="https://github.com/alexandersimoes/d3plus/wiki/Custom-Interface">Custom Interface Elements</a> can be created by passing the .ui( ) method an <em>array</em> of <em>obejcts</em>.</p>' +
        '<p>Each <em>object</em> needs to contain both the <a href="https://github.com/alexandersimoes/d3plus/wiki/Methods">method</a> that it corresponds with, and the values that the user should be able to toggle between.</p>')

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
    d3plusSetFooter('<p>When passing the <a href="https://github.com/alexandersimoes/d3plus/wiki/Time-Parameters">.time( )</a> method a key, <strong>D3plus</strong> will map the associated values to a timeline, and display that timeline on the bottom of the visualization.</p>' +
        '<p>The timeline can be hidden by toggling the <a href="https://github.com/alexandersimoes/d3plus/wiki/Timeline">.timeline( )</a> method.</p>')

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
    d3plusSetFooter('<p>The default color heatmap used by the <a href="https://github.com/alexandersimoes/d3plus/wiki/Color-Parameters#object">.color( )</a> method when coloring by a range of positive numbers can be changed using the "heatmap" key inside of the method\'s object.</p>')

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
    d3plusSetFooter('<p>When passing the <a href="https://github.com/alexandersimoes/d3plus/wiki/Color-Parameters">.color( )</a> method a key, <strong>D3plus</strong> will map the associated values to a color scale, and display that scale on the bottom of the visualization.</p>' +
        '<p>The legend for the color scale can be hidden by toggling the <a href="https://github.com/alexandersimoes/d3plus/wiki/Legend">.legend( )</a> method.</p>')

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
var d3pExample24 = function () {
    d3plusSetFooter('<p>The order and sorting of the squares displayed by the <a href="https://github.com/alexandersimoes/d3plus/wiki/Legend#object">.legend( )</a> can be changed by accessing the inner object of the method.</p>')
    var sample_data = [
        {"value": 70, "name": "alpha"},
        {"value": 100, "name": "beta"},
        {"value": 15, "name": "gamma"},
        {"value": 50, "name": "delta"},
        {"value": 5, "name": "epsilon"},
        {"value": 10, "name": "zeta"}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("tree_map")
        .id("name")
        .color("name")
        .size("value")
        .legend({
            "order": {
                "sort": "desc",
                "value": "size"
            }
        })
        .draw()
}
var d3pExample25 = function () {
    d3plusSetFooter('<p>Setting the "label" key available in the <a href="https://github.com/alexandersimoes/d3plus/wiki/Edges-List#object">.edges( )</a> method enables the edges to be labeled by a value in the data.</p>')
    var connections = [
        {"source": "alpha", "target": "beta", "strength": 1.25},
        {"source": "alpha", "target": "gamma", "strength": 2.463},
        {"source": "beta", "target": "delta", "strength": 0.823},
        {"source": "beta", "target": "epsilon", "strength": 1.563},
        {"source": "zeta", "target": "gamma", "strength": 3.125},
        {"source": "theta", "target": "gamma", "strength": 0.732},
        {"source": "eta", "target": "gamma", "strength": 2.063}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .type("rings")
        .edges({
            "label": "strength",
            "value": connections
        })
        .focus("alpha")
        .draw()
}
var d3pExample26 = function () {
    d3plusSetFooter('<p>Setting the "size" key available in the <a href="https://github.com/alexandersimoes/d3plus/wiki/Edges-List#object">.edges( )</a> method enables the edge widths to be sized by a value in the data.</p>')
    var connections = [
        {"source": "alpha", "target": "beta", "strength": 1.25},
        {"source": "alpha", "target": "gamma", "strength": 2.463},
        {"source": "beta", "target": "delta", "strength": 0.823},
        {"source": "beta", "target": "epsilon", "strength": 1.563},
        {"source": "zeta", "target": "gamma", "strength": 3.125},
        {"source": "theta", "target": "gamma", "strength": 0.732},
        {"source": "eta", "target": "gamma", "strength": 2.063}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .type("rings")
        .edges({
            "size": "strength",
            "value": connections
        })
        .focus("alpha")
        .draw()
}
var d3pExample27 = function () {
    d3plusSetFooter('<p>The <a href="https://github.com/alexandersimoes/d3plus/wiki/Font-Styles">.font( )</a> method gives access to overwrite all of the fonts used in a visualization. In this example, the global font family is being modified.</p>')
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
        .font({ "family": "Times" })
        .draw()
}
var d3pExample28 = function () {
    d3plusSetFooter('<p>Using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Legend">.legend( )</a> method, the size of the squares displayed by the can be changed.</p>' +
        '<p>Size accepts either a single <em>number</em> or an <em>array</em> of 2 <em>numbers</em>, which defines a min/max to use when making the squares based on available space.</p>')
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
        .color("name")
        .legend({"size": 50})
        .size("value")
        .draw()
}
var d3pExample29 = function () {
    d3plusSetFooter('<p>The <a href="https://github.com/alexandersimoes/d3plus/wiki/Custom-Titles">.title( )</a> method allows enabling a large title, a sub-title, and a "total" title which totals up the available values being displayed.</p>' +
        '<p>The <a href="https://github.com/alexandersimoes/d3plus/wiki/Custom-Footer">.footer( )</a> method enables a smaller footer at the bottom of the visualization. This, along with all of the various <a href="https://github.com/alexandersimoes/d3plus/wiki/Custom-Titles#object">.title( )</a> objects, can also include a URL "link" for the user to click.</p>')
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

var d3pExample30 = function () {
    d3plusSetFooter('<p>Using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Size-Parameters">.size( )</a> method enables the nodes in Rings to be sized by a value in the data.</p>')
    var sample_data = [
        {"name": "alpha", "value": 20},
        {"name": "beta", "value": 12},
        {"name": "gamma", "value": 30},
        {"name": "delta", "value": 26},
        {"name": "epsilon", "value": 30},
        {"name": "zeta", "value": 30},
        {"name": "theta", "value": 11},
        {"name": "eta", "value": 24}
    ]

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
        .data(sample_data)
        .id("name")
        .size("value")
        .edges(connections)
        .focus("alpha")
        .draw()
}
var d3pExample31 = function () {
    d3plusSetFooter('<p>The "arrows" property of the <a href="https://github.com/alexandersimoes/d3plus/wiki/Edges-List">.edges( )</a> method toggles the visibility of edge directional arrows. The directionality defaults to pointing at the "target" node.</p>')
    var sample_data = [
        {"name": "alpha", "size": 10},
        {"name": "beta", "size": 12},
        {"name": "gamma", "size": 30},
        {"name": "delta", "size": 26},
        {"name": "epsilon", "size": 12},
        {"name": "zeta", "size": 26},
        {"name": "theta", "size": 11},
        {"name": "eta", "size": 24}
    ]

    var positions = [
        {"name": "alpha", "x": 10, "y": 15},
        {"name": "beta", "x": 12, "y": 24},
        {"name": "gamma", "x": 16, "y": 18},
        {"name": "delta", "x": 26, "y": 21},
        {"name": "epsilon", "x": 13, "y": 4},
        {"name": "zeta", "x": 31, "y": 13},
        {"name": "theta", "x": 19, "y": 8},
        {"name": "eta", "x": 24, "y": 11}
    ]

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
        .type("network")
        .data(sample_data)
        .nodes(positions)
        .edges(connections)
        .edges({"arrows": true})
        .size("size")
        .id("name")
        .draw()
}
var d3pExample32 = function () {
    d3plusSetFooter('<p>With the Network visualization, if <a href="https://github.com/alexandersimoes/d3plus/wiki/Node-Positions">Node Positions</a> are not specified, <strong>D3plus</strong> will determine a layout that aims to reduce node and edge overlapping. This layout happens dynamically, on the fly, and you will see this if you refresh the page.</p>')
    var sample_data = [
        {"name": "alpha", "size": 10},
        {"name": "beta", "size": 12},
        {"name": "gamma", "size": 30},
        {"name": "delta", "size": 26},
        {"name": "epsilon", "size": 12},
        {"name": "zeta", "size": 26},
        {"name": "theta", "size": 11},
        {"name": "eta", "size": 24}
    ]

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
        .type("network")
        .data(sample_data)
        .edges(connections)
        .size("size")
        .id("name")
        .draw()
}
var d3pExample33 = function () {
    d3plusSetFooter('<p>The Stacked Area Chart, along with the other Chart Visualizations, has access to the various keys offered by the <a href="https://github.com/alexandersimoes/d3plus/wiki/Axis-Parameters">.x( )</a> and <a href="https://github.com/alexandersimoes/d3plus/wiki/Axis-Parameters">.y( )</a> methods. In this example, the <a href="https://github.com/alexandersimoes/d3plus/wiki/Axis-Parameters">.x( )</a> scale is changed to "share" after 2 seconds.</p>')
    var sample_data = [
        {"year": 1993, "name":"alpha", "value": 20},
        {"year": 1994, "name":"alpha", "value": 30},
        {"year": 1995, "name":"alpha", "value": 60},
        {"year": 1993, "name":"beta", "value": 40},
        {"year": 1994, "name":"beta", "value": 60},
        {"year": 1995, "name":"beta", "value": 10},
        {"year": 1994, "name":"gamma", "value": 10},
        {"year": 1995, "name":"gamma", "value": 40}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("stacked")
        .id("name")
        .text("name")
        .y("value")
        .x("year")
        .draw()

    setTimeout(function(){

        visualization
            .y({"scale": "share"})
            .draw()

    },2000)
}
var d3pExample34 = function () {
    d3plusSetFooter('<p>When creating a Geo Map, it is possible to initiate the visualization using only a subset of the available geographies passed to <a href="https://github.com/alexandersimoes/d3plus/wiki/Visualization-Methods#Geography-Data">.coords( )</a>. Similar to many of the other methods, the <a href="https://github.com/alexandersimoes/d3plus/wiki/Visualization-Methods#Geography-Data#object">.coords( )</a> method allows you to <a href="https://github.com/alexandersimoes/d3plus/wiki/Data-Filtering">Filter Data</a> by it\'s <a href="https://github.com/alexandersimoes/d3plus/wiki/Unique-ID">.id( )</a> key. In our example here, we are "<a href="https://github.com/alexandersimoes/d3plus/wiki/Data-Filtering#solo">soloing</a>" a few countries in Europe.</p>')
    var sample_data = [
        {"value": 2315987123, "country": "eufra", "name": "France"},
        {"value": 38157121349, "country": "euprt", "name": "Portugal"},
        {"value": 21891735098, "country": "euesp", "name": "Spain"},
        {"value": 9807134982, "country": "euita", "name": "Italy"}
    ]
    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("geo_map")
        .coords({
            "solo": ["euesp","euita","eufra","euprt"],
            "value": "/data/d3pDemo/countries.json"
        })
        .id("country")
        .text("name")
        .color("value")
        .tooltip("value")
        .draw()
}
var d3pExample35 = function () {
    d3plusSetFooter('<p>When passing the <a href="https://github.com/alexandersimoes/d3plus/wiki/Color-Parameters">.color( )</a> method a key, <strong>D3plus</strong> will map the associated values to a color scale, and display that scale on the bottom of the visualization.</p>' +
        '<p>The legend for the color scale can be hidden by toggling the <a href="https://github.com/alexandersimoes/d3plus/wiki/Legend">.legend( )</a> method.</p>')
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
        .color("growth")
        .draw()
}

var d3pExample36 = function () {
    d3plusSetFooter('<p>When passing the <a href="https://github.com/alexandersimoes/d3plus/wiki/Unique-ID#array">.id( )</a> method an <em>array</em> instead of a single key, the Line Chart visualization will group lines based on the keys (and order) you pass it in the <em>array</em>.</p>' +
        '<p>The Y values for the lines are averaged, by default. This aggregation can be changed using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Custom-Aggregations">.aggs( )</a> method.</p>' +
        '<p>When clicking on a grouped line, the visusalization will automatically zoom into that group, showing the items within it. This feature can be toggled using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Zooming">.zoom( )</a> method.</p>')
    var sample_data = [
        {"year": 1991, "name":"alpha", "value": 15, "parent": "parent 1"},
        {"year": 1992, "name":"alpha", "value": 20, "parent": "parent 1"},
        {"year": 1993, "name":"alpha", "value": 30, "parent": "parent 1"},
        {"year": 1994, "name":"alpha", "value": 60, "parent": "parent 1"},
        {"year": 1991, "name":"beta", "value": 10, "parent": "parent 1"},
        {"year": 1992, "name":"beta", "value": 10, "parent": "parent 1"},
        {"year": 1993, "name":"beta", "value": 40, "parent": "parent 1"},
        {"year": 1994, "name":"beta", "value": 60, "parent": "parent 1"},
        {"year": 1991, "name":"gamma", "value": 5, "parent": "parent 2"},
        {"year": 1992, "name":"gamma", "value": 10, "parent": "parent 2"},
        {"year": 1993, "name":"gamma", "value": 20, "parent": "parent 2"},
        {"year": 1994, "name":"gamma", "value": 25, "parent": "parent 2"},
        {"year": 1991, "name":"delta", "value": 50, "parent": "parent 2"},
        {"year": 1992, "name":"delta", "value": 43, "parent": "parent 2"},
        {"year": 1993, "name":"delta", "value": 17, "parent": "parent 2"},
        {"year": 1994, "name":"delta", "value": 32, "parent": "parent 2"}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("line")
        .id(["parent","name"])
        .y("value")
        .x("year")
        .draw()
}
var d3pExample37 = function () {
    d3plusSetFooter('<p>When passing the <a href="https://github.com/alexandersimoes/d3plus/wiki/Unique-ID#array">.id( )</a> method an <em>array</em> instead of a single key, the Scatter Plot visualization will group data nodes based on the keys (and order) you pass it in the <em>array</em>.</p>' +
        '<p>The values for the groups are averaged, by default. This aggregation can be changed using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Custom-Aggregations">.aggs( )</a> method.</p>' +
        '<p>When clicking on a grouped node, the visusalization will automatically zoom into that group, showing the items within it. This feature can be toggled using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Zooming">.zoom( )</a> method.</p>')
    var sample_data = [
        {"value": 100, "weight": .45, "name": "alpha", "group": "group 1"},
        {"value": 70, "weight": .60, "name": "beta", "group": "group 2"},
        {"value": 40, "weight": -.2, "name": "gamma", "group": "group 2"},
        {"value": 15, "weight": .1, "name": "delta", "group": "group 2"},
        {"value": 5, "weight": -.43, "name": "epsilon", "group": "group 1"},
        {"value": 1, "weight": 0, "name": "zeta", "group": "group 1"}
    ]

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("chart")
        .id(["group","name"])
        .x("value")
        .y("weight")
        .draw()

}
var d3pExample38 = function () {
    d3plusSetFooter('<p class="example"><p>A common request with Tree Maps is to show the Share Percentage of the square inside the actual square. By default, <strong>D3plus</strong> centers all labels for all visualizations, but in some cases, like this Tree Map, we could move the labels to the upper-left of the square and have a nice place to place those percentages.</p>' +
        '<p>The <a href="https://github.com/alexandersimoes/d3plus/wiki/Data-Labels">.labels( )</a> method provides access to variety of different styles used by the text labels. In particular, the "align" style can be changed using this method.</p></p>')
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
        .labels({"align": "start"})
        .draw()
}
var d3pExample39 = function () {
    d3plusSetFooter('<p>When passing the <a href="https://github.com/alexandersimoes/d3plus/wiki/Unique-ID#array">.id( )</a> method an <em>array</em> instead of a single key, the Tree Map visualization will group squares based on the keys (and order) you pass it in the <em>array</em>. The <a href="https://github.com/alexandersimoes/d3plus/wiki/Visible-Depth">.depth( )</a> method can then be set to chose which nesting level to display.</p>')
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
        .depth(1)
        .size("value")
        .draw()
}
var d3pExample40 = function () {
    d3plusSetFooter('<p>When passing the <a href="https://github.com/alexandersimoes/d3plus/wiki/Unique-ID#array">.id( )</a> method an <em>array</em> instead of a single key, the Tree Map visualization will group squares based on the keys (and order) you pass it in the <em>array</em>.</p>' +
        '<p>The values of the new grouped squares are averaged, by default. This aggregation can be changed using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Custom-Aggregations">.aggs( )</a> method.</p>' +
        '<p>When clicking on a grouped square, the visusalization will automatically zoom into that group, showing the items within it. This feature can be toggled using the <a href="https://github.com/alexandersimoes/d3plus/wiki/Zooming">.zoom( )</a> method.</p>')
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
        .draw()
}
var d3pExample41 = function () {
    d3plusSetFooter('<p>By passing D3plus a list of node positions and connections, a Network can be created and data can be mapped to the size of each node.</p>')
    // create sample dataset
    var sample_data = [
        {"name": "alpha", "size": 10},
        {"name": "beta", "size": 12},
        {"name": "gamma", "size": 30},
        {"name": "delta", "size": 26},
        {"name": "epsilon", "size": 12},
        {"name": "zeta", "size": 26},
        {"name": "theta", "size": 11},
        {"name": "eta", "size": 24}
    ]

// create list of node positions
    var positions = [
        {"name": "alpha", "x": 10, "y": 15},
        {"name": "beta", "x": 12, "y": 24},
        {"name": "gamma", "x": 16, "y": 18},
        {"name": "delta", "x": 26, "y": 21},
        {"name": "epsilon", "x": 13, "y": 4},
        {"name": "zeta", "x": 31, "y": 13},
        {"name": "theta", "x": 19, "y": 8},
        {"name": "eta", "x": 24, "y": 11}
    ]

// create list of node connections
    var connections = [
        {"source": "alpha", "target": "beta"},
        {"source": "alpha", "target": "gamma"},
        {"source": "beta", "target": "delta"},
        {"source": "beta", "target": "epsilon"},
        {"source": "zeta", "target": "gamma"},
        {"source": "theta", "target": "gamma"},
        {"source": "eta", "target": "gamma"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .type("network") // visualization type
        .data(sample_data) // sample dataset to attach to nodes
        .nodes(positions) // x and y position of nodes
        .edges(connections) // list of node connections
        .size("size") // key to size the nodes
        .id("name") // key for which our data is unique on
        .draw()
}
var d3pExample42 = function () {
    d3plusSetFooter('<p>An easy way to map data to locations around the world. The <a href="https://github.com/alexandersimoes/d3plus/wiki/Unique-ID">.id( )</a> key in your data must match the "id" key in the topojson that you import.</p>')
    var sample_data = [
        {"value": 2315987123, "country": "nausa", "name": "United States"},
        {"value": 38157121349, "country": "aschn", "name": "China"},
        {"value": 21891735098, "country": "euesp", "name": "Spain"},
        {"value": 9807134982, "country": "sabra", "name": "Brazil"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .data(sample_data) // data to use with the visualization
        .coords("/data/d3pDemo/countries.json") // pass topojson coordinates
        .type("geo_map") // visualization type
        .id("country") // key for which our data is unique on
        .text("name") // key to use for display text
        .color("value") // key for coloring countries
        .tooltip("value") // keys to place in tooltip
        .draw()
}
var d3pExample43 = function () {
    d3plusSetFooter('<p>The Line Plot shows data points as lines that change y-value over a continuous x-axis. Lines will ' +
        'be segmented if data points are not present for a give x value</p>')
    var sample_data = [
        {"year": 1991, "name":"alpha", "value": 17},
        {"year": 1992, "name":"alpha", "value": 20},
        {"year": 1993, "name":"alpha", "value": 25},
        {"year": 1994, "name":"alpha", "value": 33},
        {"year": 1995, "name":"alpha", "value": 52},
        {"year": 1991, "name":"beta", "value": 36},
        {"year": 1992, "name":"beta", "value": 32},
        {"year": 1993, "name":"beta", "value": 40},
        {"year": 1994, "name":"beta", "value": 58},
        {"year": 1995, "name":"beta", "value": 13},
        {"year": 1991, "name":"gamma", "value": 24},
        {"year": 1992, "name":"gamma", "value": 27},
        {"year": 1994, "name":"gamma", "value": 35},
        {"year": 1995, "name":"gamma", "value": 40}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .data(sample_data) // data to use with the visualization
        .type("line") // visualization type
        .id("name") // key for which our data is unique on
        .text("name") // key to use for display text
        .y("value") // key to use for y-axis
        .x("year") // key to use for x-axis
        .draw()
}
var d3pExample44 = function () {
    d3plusSetFooter('<p>Rings is a way to view network connections focused on 1 node in the network. It displays primary ' +
        'and secondary connections of a specific node, as well allowing the user to click on a node to recenter the ' +
        'visualization on that selected node.</p>')
    // create list of node connections
    var connections = [
        {"source": "alpha", "target": "beta"},
        {"source": "alpha", "target": "gamma"},
        {"source": "beta", "target": "delta"},
        {"source": "beta", "target": "epsilon"},
        {"source": "zeta", "target": "gamma"},
        {"source": "theta", "target": "gamma"},
        {"source": "eta", "target": "gamma"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .type("rings") // visualization type
        .edges(connections) // list of node connections
        .focus("alpha") // ID of the initial center node
        .draw()
}
var d3pExample45 = function () {
    d3plusSetFooter('<p>A simple Scatter Plot visualization that displays data across an X and Y axis.</p>')
    var sample_data = [
        {"value": 100, "weight": .45, "type": "alpha"},
        {"value": 70, "weight": .60, "type": "beta"},
        {"value": 40, "weight": -.2, "type": "gamma"},
        {"value": 15, "weight": .1, "type": "delta"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .data(sample_data) // data to use with the visualization
        .type("chart") // visualization type
        .id("type") // key for which our data is unique on
        .x("value") // key for x-axis
        .y("weight") // key for y-axis
        .draw()
}
var d3pExample46 = function () {
    d3plusSetFooter('<p>The Stacked Area chart is a variation of the Chart Visualization with values drawn as areas stacked ' +
        'on top of one another with a continuous x-axis. This visualization allows a quick assessment of how the data ' +
        'breaks up by share of the whole over a specified variable, most commonly "time".</p>')
    // sample data array
    var sample_data = [
        {"year": 1993, "name":"alpha", "value": 20},
        {"year": 1994, "name":"alpha", "value": 30},
        {"year": 1995, "name":"alpha", "value": 60},
        {"year": 1993, "name":"beta", "value": 40},
        {"year": 1994, "name":"beta", "value": 60},
        {"year": 1995, "name":"beta", "value": 10},
        {"year": 1994, "name":"gamma", "value": 10},
        {"year": 1995, "name":"gamma", "value": 40}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .data(sample_data) // data to use with the visualization
        .type("stacked") // visualization type
        .id("name") // key for which our data is unique on
        .text("name") // key to use for display text
        .y("value") // key to use for y-axis
        .x("year") // key to use for x-axis
        .draw()
}
var d3pExample47 = function () {
    d3plusSetFooter('<p>Tree Maps are a great way to show your dataset as shares of a whole. Unlike Pie Charts, which have ' +
        'a lot of unused white space along the edges of the visualization, Tree Maps allow for smaller data points to ' +
        'become much more visible because the visualization is allowed to take up the entirity of the screen space.</p>')
    // sample data array
    var sample_data = [
        {"value": 100, "name": "alpha"},
        {"value": 70, "name": "beta"},
        {"value": 40, "name": "gamma"},
        {"value": 15, "name": "delta"},
        {"value": 5, "name": "epsilon"},
        {"value": 1, "name": "zeta"}
    ]

// instantiate d3plus
    var visualization = d3plus.viz()
        .container("#viz") // container DIV to hold the visualization
        .data(sample_data) // data to use with the visualization
        .type("tree_map") // visualization type
        .id("name") // key for which our data is unique on
        .size("value") // sizing of blocks
        .draw() // finally, draw the visualization!
}
var d3pExample48 = function () {
    d3plusSetFooter('<p>In D3plus, all methods support passing a function that will handle the logic of fetching a given attribute. By passing <a href="https://github.com/alexandersimoes/d3plus/wiki/Visualizations#color">.color( )</a> a function, the returned color can be determined based off special conditions that the data may meet.</p>')
    var sample_data = [
        {"value": 100, "name": "alpha", "growth": 0.9},
        {"value": 70, "name": "beta", "growth": 0.4},
        {"value": 40, "name": "gamma", "growth": -0.3},
        {"value": 15, "name": "delta", "growth": -0.65},
        {"value": 5, "name": "epsilon", "growth": 0.7},
        {"value": 1, "name": "zeta", "growth": 0.2}
    ];

    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("tree_map")
        .id("name")
        .size("value")
        .color(function(d){
            return d.growth > 0 ? "#008800" : "#880000";
        })
        .draw();
}


var pos = 0;

d3pExamples[pos] = {title: (pos++)+") Simple Table",function:d3pExample0/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "0.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Box and Whisker", function:d3pExample1/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "1.ejs"}
d3pExamples[pos] = {title: (pos++)+") Stacked Bar Chart",function:d3pExample2/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "2.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Bar Chart",function:d3pExample3/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "3.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Pie Chart",function:d3pExample4/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "4.ejs"}
d3pExamples[pos] = {title: (pos++)+") Custom Data Aggregations",function:d3pExample5/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "5.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Bubbles",function:d3pExample6/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "6.ejs"}
d3pExamples[pos] = {title: (pos++)+") Adding Static HTML Content",function:d3pExample7/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "7.ejs"}
d3pExamples[pos] = {title: (pos++)+") Assigning Custom Color",function:d3pExample8/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "8.ejs"}
d3pExamples[pos] = {title: (pos++)+") Adding Nodes and Edges to a Network",function:d3pExample9/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "9.ejs"}
d3pExamples[pos] = {title: (pos++)+") Custom Text and Number Formatting",function:d3pExample10/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "10.ejs"}
pos++//d3pExamples[pos] = {title: (pos++)+") Multi-level Nesting in Forms",function:d3pExample11/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "11.ejs"}
d3pExamples[pos] = {title: (pos++)+") Legible Text on Colored Backgrounds",function:d3pExample12/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "12.ejs"}
d3pExamples[pos] = {title: (pos++)+") SVG Text Wrapping",function:d3pExample13/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "13.ejs"}
d3pExamples[pos] = {title: (pos++)+") Colored Text Legible on White Backgrounds",function:d3pExample14/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "14.ejs"}
pos++//d3pExamples[pos] = {title: (pos++)+") Lighten Colors",function:d3pExample15/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "15.ejs"}
d3pExamples[pos] = {title: (pos++)+") Hiding the Focus Tooltip",function:d3pExample16/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "16.ejs"}
pos++//d3pExamples[pos] = {title: (pos++)+") Forms from Javascript",function:d3pExample17/*,resize:d3pResize17,drawingContainer: 'viz1'*/,codeRef: "17.ejs"}
pos++//d3pExamples[pos] = {title: (pos++)+") Forms from HTML",function:d3pExample18/*,resize:d3pResize18,drawingContainer: 'viz1'*/,codeRef: "18.ejs"}
d3pExamples[pos] = {title: (pos++)+") Changing the Language to Portuguese",function:d3pExample19/*,resize:d3pResize19,drawingContainer: 'viz1'*/,codeRef: "19.ejs"}
d3pExamples[pos] = {title: (pos++)+") Adding Custom Interface Elements",function:d3pExample20/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "20.ejs"}
d3pExamples[pos] = {title: (pos++)+") Using a Timeline",function:d3pExample21/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "21.ejs"}
d3pExamples[pos] = {title: (pos++)+") Changing the Default Color Heatmap",function:d3pExample22/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "22.ejs"}
d3pExamples[pos] = {title: (pos++)+") Changing the Default Color Range",function:d3pExample23/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "23.ejs"}
d3pExamples[pos] = {title: (pos++)+") Change Legend Order",function:d3pExample24/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "24.ejs"}
d3pExamples[pos] = {title: (pos++)+") Labeling Edges in Rings",function:d3pExample25/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "25.ejs"}
d3pExamples[pos] = {title: (pos++)+") Sizing Edges in Rings",function:d3pExample26/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "26.ejs"}
d3pExamples[pos] = {title: (pos++)+") Changing Font Styles",function:d3pExample27/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "27.ejs"}
d3pExamples[pos] = {title: (pos++)+") Change Legend Sizing",function:d3pExample28/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "28.ejs"}
d3pExamples[pos] = {title: (pos++)+") Titles and Footers",function:d3pExample29/*,resize:d3pResize2,drawingContainer: 'viz1'*/,codeRef: "29.ejs"}
d3pExamples[pos] = {title: (pos++)+") Rings Sized by Data",function:d3pExample30/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "30.ejs"}
d3pExamples[pos] = {title: (pos++)+") Edge Directional Arrows in a Network",function:d3pExample31/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "31.ejs"}
d3pExamples[pos] = {title: (pos++)+") Automatic Node Positions in Network",function:d3pExample3/*,resize:d3pResize32,drawingContainer: 'viz1'*/,codeRef: "32.ejs"}
d3pExamples[pos] = {title: (pos++)+") Stacked Areas as Share Percentages",function:d3pExample33/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "33.ejs"}
d3pExamples[pos] = {title: (pos++)+") Filtering Geo Map Coordinates",function:d3pExample34/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "34.ejs"}
d3pExamples[pos] = {title: (pos++)+") Tree Map Colored by Values",function:d3pExample35/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "35.ejs"}
d3pExamples[pos] = {title: (pos++)+") Grouped Line Chart",function:d3pExample36/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "36.ejs"}
d3pExamples[pos] = {title: (pos++)+") Grouped Scatterplot",function:d3pExample37/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "37.ejs"}
d3pExamples[pos] = {title: (pos++)+") Share Percentage Labels on a Tree Map",function:d3pExample38/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "38.ejs"}
d3pExamples[pos] = {title: (pos++)+") Nested Tree Map",function:d3pExample39/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "39.ejs"}
d3pExamples[pos] = {title: (pos++)+") Grouped Tree Map",function:d3pExample40/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "40.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Static Network",function:d3pExample41/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "41.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Geo Map",function:d3pExample42/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "42.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Line Plot",function:d3pExample43/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "43.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Rings",function:d3pExample44/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "44.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Scatter Plot",function:d3pExample45/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "45.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Stacked Area",function:d3pExample46/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "46.ejs"}
d3pExamples[pos] = {title: (pos++)+") Simple Tree Map",function:d3pExample47/*,resize:d3pResize3,drawingContainer: 'viz1'*/,codeRef: "47.ejs"}
d3pExamples[pos] = {title: (pos++)+") Custom Colors using a Function",function:d3pExample48/*,resize:d3pResize1,drawingContainer: 'viz1'*/,codeRef: "48.ejs"}
