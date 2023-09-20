var district, geojson, geojson1;
getDisdrict();
// Attribution Control
var attributionControl = new ol.control.Attribution({
  collapsible: true
})
// Map object

var extentforLayer;
// =============================== Base Layers ===============================
var osm = new ol.layer.Tile({
  type: 'base',
  title: 'Osm Base Map',
  visible: true,
  source: new ol.source.OSM()
});

var topo = new ol.layer.Tile({
  title: 'Topo Map',
  type: 'base',
  visible: true,
  source: new ol.source.XYZ({
    attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
      'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
      'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    crossOrigin: 'Anonymous',
  })
});

var bing = new ol.layer.Tile({
  title: 'Satellite Map',
  type: 'base',
  visible: false,
  source: new ol.source.BingMaps({
    key: 'Agewfwr4IfkyAcCkaopR6tEbp2QPzDKJYSuow6YAN3tiU7_PYVvoyXBo32TpL4qE',
    imagerySet: 'AerialWithLabels'
  })
});
var street = new ol.layer.Tile({
  title: 'Street Map',
  type: 'base',
  visible: false,
  source: new ol.source.BingMaps({
    key: 'Agewfwr4IfkyAcCkaopR6tEbp2QPzDKJYSuow6YAN3tiU7_PYVvoyXBo32TpL4qE',
    imagerySet: 'Road'
  })
});

var nomap = new ol.layer.Tile({
  title: 'No Base Map',
  type: 'base',
  source: new ol.source.XYZ({
    url: ''
  })
});

var latLong = '&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;';
//    var wgs84Sphere = new ol.Sphere(6378137);
var scaleLineControl = new ol.control.ScaleLine({
  units: 'metric',
  type: 'scalebar',
  steps: 2
});
var mouse = new ol.control.MousePosition({
  projection: 'EPSG:4326',
  coordinateFormat: function (coordinate) {
    return ol.coordinate.format(coordinate, latLong, 4);
  }
});

var center = ol.proj.transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857');
view = new ol.View({
  center: center,
  zoom: 6.5
});

//------------------------on click display table-------------------------
var container = document.getElementById('popup');
var container1 = document.getElementById('popup1');
var content = document.getElementById('popup-content');
var content1 = document.getElementById('popup-content1');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
  element: container,
  positioning: 'center-center'
});
var overlay1 = new ol.Overlay({
  element: container1,
  positioning: 'center-right'
});

// var overlay2 = new ol.Overlay({
//     element: content2,
//     positioning: 'left-left'
// });

var MahaDist = new ol.layer.Tile({
  title: "State",
  source: new ol.source.TileWMS({
    url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    visible: true,
    params: {
      'LAYERS': 'PoCRA:MahaDist',
      'TILED': true,
    }
  })
});
var rejected_point = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/geonode/wms',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'geonode:tbl_rejected_point',
      'TILED': true
    }
  }),
  visible: false
});

// Popup overlay
var popup = new ol.Overlay.Popup({
  popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
  closeBox: true,
  onshow: function () { console.log("You opened the box"); },
  onclose: function () { console.log("You close the box"); },
  positioning: 'top-center',
  autoPan: true,
  autoPanAnimation: { duration: 250 }
});


layerList = [topo, MahaDist];

map = new ol.Map({
  overlays: [popup, overlay],
  controls: ol.control.defaults({
    attribution: false
  }).extend([mouse, scaleLineControl]),
  target: 'map',
  layers: layerList, //featurelayer
  view: view
});



const mapView = map.getView();


var menu = new ol.control.Overlay({
  closeBox: true,
  className: "slide-left menu ol-visible",
  content: $("#menu").get(0)
});
map.addControl(menu);

// A toggle control to show/hide the menu
var t = new ol.control.Toggle({
  html: '<i class="fa fa-bars" ></i>',
  className: "menu",
  title: "Menu",
  collapsed: false,
  onToggle: function () { menu.toggle(); }
});
map.addControl(t);

// Print control
// var printControl = new ol.control.Print();
// map.addControl(printControl);


map.getLayers().forEach(function (layer, i) {
  bindInputs('#layer' + i, layer);
});



function bindInputs(layerid, layer) {

  var visibilityInput = $(layerid + ' input.visible');
  // alert(layerid)
  // console.log(visibilityInput)
  visibilityInput.on('change', function (evt) {

    layer.setVisible(this.checked);

  });
  visibilityInput.prop('checked', layer.getVisible());
  var opacityInput = $(layerid + ' input.opacity');
  opacityInput.on('input change', function () {
    layer.setOpacity(parseFloat(this.value));
  });
  opacityInput.val(String(layer.getOpacity()));
}


function getDisdrict() {
  var ele = document.getElementById("district");
  ele.innerHTML = "<option value='-1'>--जिल्हा निवडा--</option>";
  $.ajax({
    url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts",
    success: function (result) {
      for (var i = 0; i < result.district.length; i++) {
        ele.innerHTML = ele.innerHTML +
          '<option value="' + result.district[i]["dtncode"] + '">' + result.district[i]["dtnname"] + '</option>';
      }

    }
  });
}

function addMapTolayer(lName, cqlparam) {
  // alert(cqlparam)
  var district = new ol.layer.Tile({
    title: lName,
    source: new ol.source.TileWMS({
      url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
      crossOrigin: 'Anonymous',
      serverType: 'geoserver',
      visible: true,
      params: {
        'LAYERS': 'PoCRA:' + lName,
        'TILED': true,
        "CQL_FILTER": cqlparam
      }
    }),

  });
  map.addLayer(district)
}

function addMapTolayer2(lName) {
  var district = new ol.layer.Tile({
    title: lName,
    source: new ol.source.TileWMS({
      url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
      crossOrigin: 'Anonymous',
      serverType: 'geoserver',
      visible: true,
      params: {
        'LAYERS': 'PoCRA:' + lName,
        'TILED': true
      }
    })
  });
  map.addLayer(district);
}

function addMapTolayer1(lName, type) {
  var district = document.getElementById("district").value;
  var taluka = document.getElementById("taluka").value;
  var village = document.getElementById("village").value;
  var layer = new ol.layer.Tile({
    extent: extentforLayer,
    title: lName,
    type: type,
    source: new ol.source.TileWMS({
      url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
      crossOrigin: 'Anonymous',
      serverType: 'geoserver',
      visible: true,
      params: {
        'LAYERS': 'PoCRA:' + lName,
        'TILED': true
      }
    })

  });
  if (district !== "-1" && taluka === "-1" && village === "-1") {
    map.getLayers().forEach(function (layer, i) {
      if (map.getLayers().item(i).get('title') === type) {
        map.removeLayer(layer)
      }
    });
    map.addLayer(layer)
    croplayer(lName, "District", "dtncode", district);
  }
  else if (district !== "-1" && taluka !== "-1" && village === "-1") {
    map.getLayers().forEach(function (layer, i) {
      if (map.getLayers().item(i).get('title') === type) {
        map.removeLayer(layer)
      }
    });
    map.addLayer(layer)
    croplayer(lName, "Taluka", "thncode", taluka);
  } else if (district !== "-1" && taluka !== "-1" && village !== "-1") {
    map.getLayers().forEach(function (layer, i) {
      if (map.getLayers().item(i).get('title') === type) {
        map.removeLayer(layer)
      }
    });
    map.addLayer(layer)
    croplayer(lName, "Village", "vincode", village);
  }
}

function getTaluka(dtncode) {
  var ele = document.getElementById("taluka");
  ele.innerHTML = "<option value='-1'>--तालुका निवडा--</option>";
  $.ajax({

    url: "http://gis.mahapocra.gov.in/weatherservices/meta/taluka?dtncode=" + dtncode,
    success: function (result) {
      for (var i = 0; i < result.taluka.length; i++) {
        ele.innerHTML = ele.innerHTML +
          '<option value="' + result.taluka[i]["thncode"] + '">' + result.taluka[i]["thnname"] + '</option>';
      }
    }
  });
  query('District', 'dtncode', dtncode, 'dtnname');
}

function getVillage(thncode) {
  var ele = document.getElementById("village");
  ele.innerHTML = "<option value='-1'>--गाव निवडा--</option>";
  $.ajax({
    url: "http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=" + thncode,
    success: function (result) {
      for (var i = 0; i < result.village.length; i++) {
        ele.innerHTML = ele.innerHTML +
          '<option value="' + result.village[i]["vincode"] + '">' + result.village[i]["vinname"] + '</option>';
      }
    }
  });
  query('Taluka', 'thncode', thncode, 'thnname');
}

function getVillageData(vincode) {
  query('Village', 'vincode', vincode, 'vil_name');
}


var layer;
function addRasterLayer(lName, type) {

  var district = document.getElementById("district").value;
  var taluka = document.getElementById("taluka").value;
  var village = document.getElementById("village").value;
  // alert(lName)
  if (layer) {
    map.removeLayer(layer);
  }
  layer = new ol.layer.Image({
    // opacity: 0.6,
    title: lName,
    type: type,
    source: new ol.source.ImageWMS({
      url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
      params: {
        'LAYERS': 'PoCRA_Dashboard:' + lName
      }
    })
  });

  if (district !== "-1" && taluka === "-1" && village === "-1") {
    map.getLayers().forEach(function (layer, i) {
      if (map.getLayers().item(i).get('title') === type) {
        map.removeLayer(layer)
      }
    });
    map.addLayer(layer)
    croplayer(lName, "District", "dtncode", district);
  } else if (district !== "-1" && taluka !== "-1" && village === "-1") {
    map.getLayers().forEach(function (layer, i) {
      if (map.getLayers().item(i).get('title') === type) {
        map.removeLayer(layer)
      }
    });
    map.addLayer(layer)
    croplayer(lName, "Taluka", "thncode", taluka);
  } else if (district !== "-1" && taluka !== "-1" && village !== "-1") {
    map.getLayers().forEach(function (layer, i) {
      if (map.getLayers().item(i).get('title') === type) {
        map.removeLayer(layer)
      }
    });
    map.addLayer(layer)
    croplayer(lName, "Village", "vincode", village);

  }
}

var districtLabelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    overflow: true,
    fill: new ol.style.Fill({
      color: '#ee7300'
    }),
    stroke: new ol.style.Stroke({
      color: '#232323',
      width: 3
    })
  })
});

// ================ District Style =====================
var districtLabelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    overflow: true,
    fill: new ol.style.Fill({
      color: '#000'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 4
    })
  })
});

var districtBoundaryStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: '#232323',
    width: 3,
    // linejoin:'bevel',
    lineDash: [4, 8],
    lineDashOffset: 6
  })
});


var districtBoundaryStyle1 = new ol.style.Style({

  stroke: new ol.style.Stroke({
    color: '#ee7300',
    width: 3,
    // linejoin:'bevel',
    lineDash: [4, 8]
  })
});
var districtStyle = [districtBoundaryStyle, districtBoundaryStyle1, districtLabelStyle];

// ================ Taluka Style =====================
var talukaLabelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    overflow: true,
    fill: new ol.style.Fill({
      color: '#000'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 4
    })
  })
});
var talukaBoundaryStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: '#232323',
    width: 1.5,
    // linejoin:'bevel',
    lineDash: [4, 8],
    lineDashOffset: 6
  })
});
var talukaBoundaryStyle1 = new ol.style.Style({

  stroke: new ol.style.Stroke({
    color: '#ee7300',
    width: 1.5,
    lineDash: [4, 8]
  })
});
var talukaStyle = [talukaBoundaryStyle, talukaBoundaryStyle1, talukaLabelStyle];

// ================ Taluka Style =====================
var villageLabelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    overflow: true,
    fill: new ol.style.Fill({
      color: '#000'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 4
    })
  })
});
var villageBoundaryStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: '#232323',
    width: 1

  })
});

var villageStyle = [villageBoundaryStyle, villageLabelStyle];
// ===============================================



function query(layerName, paramName, paramValue) {
  map.getLayers().forEach(function (layer, i) {
    if (map.getLayers().item(i).get('title') === "State") {
      map.removeLayer(layer);
    }
  });

  // map.removeLayer(geojson);
  if (geojson) {
    map.removeLayer(geojson);
  }
  if (geojson1) {
    map.removeLayer(geojson1);
  }

  if (layerName === "District") {
    var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
    geojson = new ol.layer.Vector({

      title: layerName,
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON()
      }),
      style: function (feature) {
        var geometry = feature.getGeometry();
        if (geometry.getType() == 'MultiPolygon') {
          // Only render label for the widest polygon of a multipolygon
          var polygons = geometry.getPolygons();
          var widest = 0;
          for (var i = 0, ii = polygons.length; i < ii; ++i) {
            var polygon = polygons[i];
            var width = ol.extent.getWidth(polygon.getExtent());
            if (width > widest) {
              widest = width;
              geometry = polygon;
            }
          }
        }
        // Check if default label position fits in the view and move it inside if necessary
        geometry = geometry.getInteriorPoint();
        var size = map.getSize();
        var extent = feature.getGeometry().getExtent();
        // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
        var textAlign = 'center';
        var coordinates = geometry.getCoordinates();
        if (!geometry.intersectsExtent(extent)) {
          geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
          // Align text if at either side
          var x = geometry.getCoordinates()[0];
          if (x > coordinates[0]) {
            textAlign = 'left';
          }
          if (x < coordinates[0]) {
            textAlign = 'right';
          }
        }
        // var crop = new ol.filter.Crop({ feature: feature, inner:false });
        // topo.addFilter(crop);
        extentforLayer = extent;
        var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
        topo.addFilter(mask);
        districtLabelStyle.setGeometry(geometry);
        districtLabelStyle.getText().setText(feature.get('dtnname'));
        districtLabelStyle.getText().setTextAlign(textAlign);
        return districtStyle;
      },
    });

    geojson.getSource().on('addfeature', function () {
      //alert(geojson.getSource().getExtent());
      map.getView().fit(
        geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
      );
    });

    map.addLayer(geojson);

  } else if (layerName === "Taluka") {
    var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
    geojson = new ol.layer.Vector({
      title: layerName,
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON()
      }),
      style: function (feature) {
        var geometry = feature.getGeometry();
        if (geometry.getType() == 'MultiPolygon') {
          // Only render label for the widest polygon of a multipolygon
          var polygons = geometry.getPolygons();
          var widest = 0;
          for (var i = 0, ii = polygons.length; i < ii; ++i) {
            var polygon = polygons[i];
            var width = ol.extent.getWidth(polygon.getExtent());
            if (width > widest) {
              widest = width;
              geometry = polygon;
            }
          }
        }
        // Check if default label position fits in the view and move it inside if necessary
        geometry = geometry.getInteriorPoint();
        var size = map.getSize();
        // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
        var extent = feature.getGeometry().getExtent();
        var textAlign = 'center';
        var coordinates = geometry.getCoordinates();
        if (!geometry.intersectsExtent(extent)) {
          geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
          // Align text if at either side
          var x = geometry.getCoordinates()[0];
          if (x > coordinates[0]) {
            textAlign = 'left';
          }
          if (x < coordinates[0]) {
            textAlign = 'right';
          }
        }
        // var crop = new ol.filter.Crop({ feature: feature, inner:false });
        // topo.addFilter(crop);
        var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
        topo.addFilter(mask);

        extentforLayer = extent;
        talukaLabelStyle.setGeometry(geometry);
        talukaLabelStyle.getText().setText(feature.get('thnname'));
        talukaLabelStyle.getText().setTextAlign(textAlign);
        return talukaStyle;
      },
    });
    var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
    geojson1 = new ol.layer.Vector({
      title: "Village",
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON()
      }),
      style: function (feature) {
        var geometry = feature.getGeometry();
        if (geometry.getType() == 'MultiPolygon') {
          // Only render label for the widest polygon of a multipolygon
          var polygons = geometry.getPolygons();
          var widest = 0;
          for (var i = 0, ii = polygons.length; i < ii; ++i) {
            var polygon = polygons[i];
            var width = ol.extent.getWidth(polygon.getExtent());
            if (width > widest) {
              widest = width;
              geometry = polygon;
            }
          }
        }
        // Check if default label position fits in the view and move it inside if necessary
        geometry = geometry.getInteriorPoint();
        var size = map.getSize();
        var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
        var textAlign = 'center';
        var coordinates = geometry.getCoordinates();
        if (!geometry.intersectsExtent(extent)) {
          geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
          // Align text if at either side
          var x = geometry.getCoordinates()[0];
          if (x > coordinates[0]) {
            textAlign = 'left';
          }
          if (x < coordinates[0]) {
            textAlign = 'right';
          }
        }

        villageLabelStyle.setGeometry(geometry);
        villageLabelStyle.getText().setText(feature.get('vilname'));
        villageLabelStyle.getText().setTextAlign(textAlign);
        return villageStyle;
      },
    });
    geojson.getSource().on('addfeature', function () {
      //alert(geojson.getSource().getExtent());
      map.getView().fit(
        geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
      );
    });


    geojson1.getSource().on('addfeature', function () {
      //alert(geojson.getSource().getExtent());
      map.getView().fit(
        geojson1.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
      );
    });
    map.addLayer(geojson1);
    map.addLayer(geojson);
  } else if (layerName === "Village") {
    var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
    geojson = new ol.layer.Vector({
      title: layerName,
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON()
      }),
      style: function (feature) {
        var geometry = feature.getGeometry();
        if (geometry.getType() == 'MultiPolygon') {
          // Only render label for the widest polygon of a multipolygon
          var polygons = geometry.getPolygons();
          var widest = 0;
          for (var i = 0, ii = polygons.length; i < ii; ++i) {
            var polygon = polygons[i];
            var width = ol.extent.getWidth(polygon.getExtent());
            if (width > widest) {
              widest = width;
              geometry = polygon;
            }
          }
        }
        // Check if default label position fits in the view and move it inside if necessary
        geometry = geometry.getInteriorPoint();
        var size = map.getSize();
        var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
        var textAlign = 'center';
        var coordinates = geometry.getCoordinates();
        if (!geometry.intersectsExtent(extent)) {
          geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
          // Align text if at either side
          var x = geometry.getCoordinates()[0];
          if (x > coordinates[0]) {
            textAlign = 'left';
          }
          if (x < coordinates[0]) {
            textAlign = 'right';
          }
        }
        // var crop = new ol.filter.Crop({ feature: feature, inner:false });
        // topo.addFilter(crop);
        var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
        topo.addFilter(mask);
        extentforLayer = extent;
        villageLabelStyle.setGeometry(geometry);
        villageLabelStyle.getText().setText(feature.get('vilname'));
        villageLabelStyle.getText().setTextAlign(textAlign);
        return villageStyle;
      },
    });

    geojson.getSource().on('addfeature', function () {
      //alert(geojson.getSource().getExtent());
      map.getView().fit(
        geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
      );
    });
    map.addLayer(geojson);
  }
}
var layers_names = [];

function croplayer(name, lname, paramName, paramValue) {
  if (geojson) {
    map.removeLayer(geojson);
  }

  map.getLayers().forEach(function (layer, i) {
    if (map.getLayers().item(i).get('title') === name) {
      var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + lname + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
      geojson = new ol.layer.Vector({
        title: lname,
        source: new ol.source.Vector({
          url: url,
          format: new ol.format.GeoJSON()
        }),
        style: function (feature) {
          var geometry = feature.getGeometry();
          if (geometry.getType() == 'MultiPolygon') {
            // Only render label for the widest polygon of a multipolygon
            var polygons = geometry.getPolygons();
            var widest = 0;
            for (var i = 0, ii = polygons.length; i < ii; ++i) {
              var polygon = polygons[i];
              var width = ol.extent.getWidth(polygon.getExtent());
              if (width > widest) {
                widest = width;
                geometry = polygon;
              }
            }
          }
          // Check if default label position fits in the view and move it inside if necessary
          geometry = geometry.getInteriorPoint();
          var size = map.getSize();
          var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
          var textAlign = 'center';
          var coordinates = geometry.getCoordinates();
          if (!geometry.intersectsExtent(extent)) {
            geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
            // Align text if at either side
            var x = geometry.getCoordinates()[0];
            if (x > coordinates[0]) {
              textAlign = 'left';
            }
            if (x < coordinates[0]) {
              textAlign = 'right';
            }
          }
          var crop = new ol.filter.Crop({ feature: feature, inner: false });
          layer.addFilter(crop);
          if (lname === "District") {
            query('District', paramName, paramValue, 'dtnname');
            districtLabelStyle.setGeometry(geometry);
            districtLabelStyle.getText().setText(feature.get('dtnname'));
            districtLabelStyle.getText().setTextAlign(textAlign);
            return districtStyle;
          } else if (lname === "Taluka") {
            query('Taluka', paramName, paramValue, 'thnname');
            talukaLabelStyle.setGeometry(geometry);
            talukaLabelStyle.getText().setText(feature.get('thnname'));
            talukaLabelStyle.getText().setTextAlign(textAlign);
            return talukaStyle;
          } else if (lname === "Village") {
            query('Village', paramName, paramValue, 'vilname');
            villageLabelStyle.setGeometry(geometry);
            villageLabelStyle.getText().setText(feature.get('vilname'));
            villageLabelStyle.getText().setTextAlign(textAlign);
            return villageStyle;
          }
          // extentforLayer=extent;

        },
      });

      geojson.getSource().on('addfeature', function () {
        map.getView().fit(
          geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
        );
      });
      map.addLayer(geojson);
    }
  });

}


function clearlayer() {
  location.reload();
}



function flyTo(location, done) {
  const duration = 2000;
  const zoom = view.getZoom();
  let parts = 2;
  let called = false;
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }
  view.animate(
    {
      center: location,
      duration: duration,
    },
    callback
  );
  view.animate(
    {
      zoom: zoom - 1,
      duration: duration / 2,
    },
    {
      zoom: zoom,
      duration: duration / 2,
    },
    callback
  );
}

onClick('fly-to-bern', function () {
  flyTo(bern, function () { });
});

// 
var countries = new ol.layer.Vector({
  source: new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: '../assets/data/countries.geojson'
  })
});
var center = ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857');
var view = new ol.View({
  center: center,
  zoom: 1
});
var map = new ol.Map({
  target: 'map',
  layers: [countries],
  view: view
});

// when the user moves the mouse, get the name property
// from each feature under the mouse and display it
function onMouseMove(browserEvent) {
  var coordinate = browserEvent.coordinate;
  var pixel = map.getPixelFromCoordinate(coordinate);
  var el = document.getElementById('name');
  el.innerHTML = '';
  map.forEachFeatureAtPixel(pixel, function (feature) {
    el.innerHTML += feature.get('name') + '<br>';
  });
}
map.on('pointermove', onMouseMove);
