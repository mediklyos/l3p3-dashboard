L3P3-Dashboard
==============

## Overview

L3p3-Dashboard is a visual web framework and it is a part of the L3P3 project (Online failure prediction), one of the projects developed in the [Center for Open Middleware](http://www.centeropenmiddleware.com).  

The goal of this visual web framework is to create a set of representations using the best visual techniques 
and technologies for each representation type. These representations are used to support data analysis 
in the rest of project, but also test current analysis and visualization techniques.   

The main committer of this framework is Francisco Huertas (@fhuertas)  

## Repository structure

The repository is divided into three branches: two stable branches and one for development. 

The [master](https://github.com/centeropenmiddleware/l3p3-dashboard/tree/master) branch contains a stable version 
with views that can be used by anyone without code modifications. These views are ready to use and there are routines to configure them. 
  
The [master-all-views](https://github.com/centeropenmiddleware/l3p3-dashboard/tree/master-all-views) branch contains a stable version with all views. This branch contains, in addition to the master branch views, a set of views 
that need modification to be used with another data set.
 
The [devel](https://github.com/centeropenmiddleware/l3p3-dashboard/tree/devel) contains all views, both stable and under development views.

  

## Framework

### Framework design

The base framework design uses bootstrap to create the visual aspect. It is designed as a web page that loads the different views in the main tag of the body. The views are loaded dynamically using a javascript template (*.ejs). 
Furthermore, the framework uses third party libraries to manipulate the visual aspect of the web page. These are jQuery and some of its extensions

![Start page](images/principal.png)

The loaded views are divided in two types. The first type are generic use views. These views can be 
used with data that fit the view requirements. These views have routines to configure data origins without code 
modifications. They are "Distribution charts" and "Online data viewer". The second type views are not 
oriented towards generic use, but COM internal use instead because they are linked to specific data. To use these 
views, code modification is needed. These views are "Single Node Viewer" and "Global Events Viewer". 

### Views

#### Dynamic Distribution Charts

The objective of this view is to represent in a chart the population distribution of a data set. 

![population](images/population.png)

The view can load databases, the only requirement is that the database must be in csv format. When a new database is 
loaded, the system asks what the type of the attributes (continuous, discrete, id or date) are. At this 
moment, discrete and continuous types are supported and date will be supported in the future.
  
![type-selector](images/upload.png)

The distribution chart is shown when a database and population attribute are selected. The chart type depends on the type of the attribute. If the type is discrete, the representation is a bar chart, however, if the type is continuous, the representation is a density function (line chart). Furthermore, the continuous attribute can be represented as a probability density function or a cumulative density function.     

![probability1](images/probability1.png)

Optionally the population can be categorized by a discrete attribute. If a category is selected, the chart (line or bar) is divided in category values.

![probability2](images/probability2.png)

 
The database values can be filtered, these filters have been applied to the population and category attributes,

The database can be filtered by population and category attributes; furthermore, secondary filters for other attributes can be added. 

The main committer of this view has been Francisco Huertas (@fhuertas)

##### Technologies and libraries 

This view has been created with javascript and it uses third party libraries to render the charts. These 
libraries are: 

* [d3.js](https://github.com/mbostock/d3): This has been the main library, used to create SVG images in 
javascript.    

* [dc.js](https://github.com/dc-js/dc.js): This library is used to manipulate d3.js and create the charts. This library and crossfilter.js have been selected because they support the largest amount of data of all alternatives. 

* [crossfilter.js](https://github.com/square/crossfilter): This library is used to manipulate data. This library
 and dc.js have been selected because they support the largest amount of data of all alternatives.

* [science.js](https://github.com/jasondavies/science.js): This library is used to calculate the accumulated 
density function from a set of points.   
 

#### Online Data Viewer

The objective of this view is show data served online.  

The view connects to a server using web-socket technology. The controls permits set the web socket url, 
the number of graphs per line, the data refresh time, the alarm threshold and the height of the graphs 
 
![OnlineDataViewer](images/odv-1.png)

Each graph show the timeline of each group of resources and its name with the current value. The controls attached to 
the graphs can pause, resume and save the current state, allow you to dynamically represent the range of values 
​​represented and set how many data is shown in the graph. 
 
The alarm column shows the alerts produced by the system. A alarm is generated when a resource exceeds the threshold 
set. The alarms can be shown in the graphs and they can be deleted from the list. 

The communication between client and server is done using web-sockets, this technology allows to send messages from the 
server to the client. The client start the communication to establish a connection, then the server send the messages. They 
must be following these rules: 

* The first message must be the description of the sources, the format is \[\<sourceName\>.\<sourceNodeName\>\[$\[\<minValue\>@]\<maxValue\>\] \]+. 
E.g: for 4 nodes (node1, node2, node3 and node4) and tree sources per node (src1, src2 and scr3) the message sent must be 
```node1.src1$0@100 node1.src2$0@100 node1.src3$0@100 node2.src1$0@100 node2.src1$100 node2.src3 node3.src1 node3.src3$0@100 node3.src2$0@100 node4.src1$0@100 node4.src3$0@100 node4.src2$0@100```

* The following messages must be the values for each source. Must have values for all 
sources and they must be separated by spaces. E.g: ```3 1 30 9 0 17 18 0 35 21 0 37``` 

The communication technology used to communicate the client and server is web socket. This technology allows to send a 
a line for time step. The format of the messages sent from server to client must be:
 
The first message must be the description of the sources. the format of this line

#### Single node Viewer

#### Global Events Viewer

#### Creating a new view

The clear routines must be implemented in the clear function, it is called when the view is changed. The content div resizes when the containing window resizes. The resizing routines of the view are delegated to the template. 

Each view has a entry in the views array. (routines.js-> views) Each entry is a object whose attributes are ref 
(the reference to the template), id (id of the view), title (the title of the view), constantPrefix (the string prefix used to identify the view constants) and js (the reference to the main javascript file).   
 

The content view 


<!--Type of view and its objectives, View, Implementation details and technologies used, Dataset format, principal Developers and contributions ventajas y desventajas de las librerías utilizadas)-->

## known bugs

Dynamic distribution does not show the database content when loaded in firefox
 
## Technology summary 

This chapter summarizes the libraries and technologies used in the views to represent the data
 
### [d3.js](https://github.com/mbostock/d3)

* Description: It is a JavaScript library for manipulating documents based on data.

* Views: Dynamic Distribution Charts, Single Node viewer, Global Events viewer and Online Data Viewer 

* Good points:

* Bad points:

## Acknowledgment
	
contributors.


dc.js and boostrap dashboard for L3P3.




 
