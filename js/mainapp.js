require([
  "esri/Map",
  "esri/WebScene",
  "esri/layers/FeatureLayer",
  "esri/views/SceneView",
  "esri/layers/SceneLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/tasks/support/StatisticDefinition",
  "esri/widgets/LayerList",
  "esri/widgets/Home",
  "esri/widgets/Legend",
  "esri/widgets/Search",
  "esri/geometry/geometryEngine",
  "esri/geometry/Point",


  "dojo/dom-construct",
  "dojo/dom",
  "dojo/on",
  "dojo/domReady!"
], function(Map, WebScene, FeatureLayer, SceneView, SceneLayer, QueryTask, Query, StatisticDefinition, LayerList, Home, Legend, Search, geometryEngine, Point, domConstruct, dom, on) {

  // Create Map
  var scene = new WebScene({
      portalItem:{
        id:"b2b87aa69e184e2abb61768090696bf3"
      }
  });

  // Create the SceneView
  var view = new SceneView({
    container: "viewDiv",
    map: scene,
    environment: {
      lighting: {
        ambientOcclusionEnabled: true,
        directShadowsEnabled: true
      }
    }
  });

  // add home widget button
  var homeWidget = new Home({
    view: view
  });

  view.ui.add(homeWidget, "top-left");

  var queryRoomTask = new QueryTask({
    url: "https://services8.arcgis.com/TWq7UjmDRPE14lEV/arcgis/rest/services/Interior_Space/FeatureServer/0"
  });

  var roomQuery = new Query();

  roomQuery.where = "Status IS NOT NULL";
  roomQuery.outFields=["OBJECTID", "SPACEID", "Status"];

  queryRoomTask.execute(roomQuery).then(function(result){
      console.log(result);

      var roomId = [];

      for (i=0; i < result.features.length; i++){
      roomId.push(result.features[i].attributes.OBJECTID)
    }

    console.log(roomId);

    $("#search").autocomplete({
      source: roomId
    });

  });

  var statQuery = new Query();
  var statDef = new StatisticDefinition();

  statDef.statisticType = "count";
  statDef.onStatisticField = "Status";
  statDef.outStatisticFieldName = "CountStatus";
  statQuery.where = "Status IS NOT NULL";
  statQuery.outFields=["Status", "CountArea"];
  statQuery.groupByFieldsForStatistics = ["Status"];
  statQuery.outStatistics = [statDef];

  queryRoomTask.execute(statQuery).then(function(result){
      console.log(result);

      var dataCount = [];
      var dataLabel = [];

      for (i=0; i < result.features.length; i++){
      dataCount.push(result.features[i].attributes.CountStatus)
      dataLabel.push(result.features[i].attributes.Status)
    }

    var pieData = [];
    var colorData = ["#f9020a","#1fed00"];

    for (i=0; i < dataCount.length; i++){
      pieData.push({
        "Status" : dataLabel[i],
        "Count" : dataCount[i],
        "Color": colorData[i]
      })
    }

    var chart = AmCharts.makeChart("chartDiv", {
      "type": "pie",
      "dataProvider": pieData,
      "innerRadius": "40%",
      "depth3D": 6,
      "hideCredits":true,
      "theme": "dark",
      "valueField": "Count",
      "titleField": "Status",
      "colorField": "Color",
      "labelRadius": 6,
      "labelTickAlpha": 0.2,
      "fontSize" : 6,
      "labelColorField": "color",
      "balloon": {
        "fixedPosition": true
      }
    });



  });








});
