L3P3-Dashboard
==============

## Overview

L3p3-Dashboard is a visual web framework and it is a part of L3P3 project (Online failure prediction) that belongs to the 
projects developed in [Center for Open Middleware](http://www.centeropenmiddleware.com).  

The goal of this visual web framework is create a set of representations using the best visual techniques 
and technologies for each representation type. This representations are using to support the data analysis 
in the rest of project, but also investigates the current analysis and visualization techniques.   

The principal responsible of this framework is Francisco Huertas (@fhuertas)  

## Repository structure

The repository is divided in three principal branches two stables branch and one for developer. 

The [master](https://github.com/centeropenmiddleware/l3p3-dashboard/tree/master) branch contains a stable version 
with the views that can be used by anybody without code modifications. This views are ready to use and It have 
routines to configure the view. 
  
The [master-all-views](https://github.com/centeropenmiddleware/l3p3-dashboard/tree/master-all-views) branch contains a 
stable version with all views. This branch contains, in addiction to the views of the master branch, a set of views 
that need modification to use with the other data-set.
 
The [devel](https://github.com/centeropenmiddleware/l3p3-dashboard/tree/devel) contains all views, the stable and under develop views

  

## Framework

### Framework design

The base framework design uses bootstrap to create the visual aspect. It is designed as unique web page that load 
in the main tag in the body the different views. The views are loaded dynamically using javascript template (*.ejs). 
Furthermore, the framework uses three party libraries to manipulate the visual aspect of the web. These are jQuery and 
some of its extensions

![Start page](images/principal.png)

The views loaded are divided in two times. The first type is views of general generic use views. These views can be 
used with the data that fit the view requirements. This views has routines to configure the data origins without code 
modifications. These are "Distribution charts" and "Online data viewer". The views of the second type are  not 
oriented to generic use, but for its internal use because these views are linked to a specific data. To use these 
views is needed to modify the code. These views are "Single Node Viewer" and "Global Events Viewer". 

### Views

#### Dynamic Distribution Charts

The objective of this view is represent in a chart the population distribution of a data-set. 

![population](images/population.png)

The view can load databases, the only requirement is that the database must be in csv format. When a new database is 
loaded, the system ask to the user what are the type of the attributes (continuous, discrete, id or date). In this 
moment discrete and continuous are supported and date will be supported too.
  
![type-selector](images/upload.png)

The distribution chart is shown when a database and population attribute are selected. The chart type depends on type 
of the attribute. If the type is discrete the representation is bar chart type, however, if the type is continuous the 
representation is a density function (line chart). Furthermore, the continuous attribute can be represented as 
probability density function or cumulative density function.     

![probability1](images/probability1.png)

Optionally the population can be categorized by a discrete attribute. If a category is selected, the chart (line or bar) 
is divided by the category values.

![probability2](images/probability2.png)

 
The database can be filtered The values of the database can be filtered, this filters has been applied in the population 
and category attribute,

The database can be filtered by population and category attributes; furthermore, secondary filters of other attributes 
can be added. 

The principal developer of this view has been Francisco Huertas (@fhuertas)

##### Technologies and libraries 

This view has been created with javascript language and uses three party libraries to render the charts. These 
libraries have been: 

* [d3.js](https://github.com/mbostock/d3): this library has been the principal library to create SVG images in 
javascript.    

* [dc.js](https://github.com/dc-js/dc.js): this library is used to manipulate d3.js and create the charts. This library 
 and crossfilter.js have been selected because it supports the largest amount of data. 

* [crossfilter.js](https://github.com/square/crossfilter): This library is used to manipolation of data. This library
 and dc.js has been selected because it supports the largest amount of data.

* [science.js](https://github.com/jasondavies/science.js): This library is used to calculate the accumulated 
density function from a set of points.   
 

#### Online Data Viewer

#### Single node Viewer

#### Global Events Viewer


<!--Type of view and its objectives, View, Implementation details and technologies used, Dataset format, principal Developers and contributions ventajas y desventajas de las librerías utilizadas)-->

 
## Technologies summary 

This chapter summarize the libraries and technologies used in the views to represent the data
 
| Library | views | Description | Good Points | Bad points |
|---------|-------|-------------|-------------|------------|
| [d3.js](https://github.com/mbostock/d3) | Dynamic Distribution Charts, Single Node viewer and Global Events viewer | | | |

## Acknowledgment
	
contributors.


dc.js and boostrap dashboard for L3P3.




 
