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
in the main tag in the body the different views. The views are loaded dynamically using javascript template (*.ejs)

![Start page](images/principal.png)

The views loaded are divided in two times. The first type is views of general generic use views. These views can be 
used with the data that fit the view requirements. This views has routines to configure the data origins without code 
modifications. These are "Distribution charts" and "Online data viewer". The views of the second type are  not 
oriented to generic use, but for its internal use because these views are linked to a specific data. To use these 
views is needed to modify the code. These views are "Single Node Viewer" and "Global Events Viewer". 

### Views

#### Dynamic Distribution Charts

The objective of this view is represent a population distribution of a data-set. This representation can be categorized by a 

#### Online Data Viewer

#### Single node Viewer

#### Global Events Viewer




Type of view and its objectives, View, Implementation details and technologies used, Dataset format, principal Developers and contributions ventajas y desventajas de las librerías utilizadas
 
## Technologies summary 

## Acknowledgment
	
contributors.


dc.js and boostrap dashboard for L3P3.




 
