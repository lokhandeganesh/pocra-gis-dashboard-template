window.onload = init;

function init() {

  // Adding control to layer switcher
  const baseLayerGroup = new ol.layer.Group({
    title: 'Base Layers',
    openInLayerSwitcher: true,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
        }),
        visible: false,
        baseLayer: false,
        title: 'Satellite Map'
      }),
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: false,
        baseLayer: false,
        title: 'Standard Map'
      }),
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          crossOrigin: 'Anonymous',
        }),
        visible: true,
        baseLayer: false,
        title: 'World Topo Map',
        type: 'base',

      }),
      new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
          crossOrigin: 'Anonymous',
          serverType: 'geoserver',

          params: {
            'LAYERS': 'PoCRA:MahaDist',
            'TILED': true,
          }
        }),
        visible: true,
        baseLayer: false,
        title: "PoCRA Districts",
      }),
    ]
  })

  const adminLayers = new ol.layer.Group({
    title: 'Administrative Layers',
    openInLayerSwitcher: true,
    layers: [
      new ol.layer.Tile({
        // extent: extentforLayer,    
        // type: type,
        source: new ol.source.TileWMS({
          url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
          crossOrigin: 'Anonymous',
          serverType: 'geoserver',
          params: {
            'LAYERS': 'PoCRA:Settlement',
            'TILED': true
          }
        }),
        visible: false,
        baseLayer: false,
        title: "Settlements",
      }),
      new ol.layer.Tile({
        // extent: extentforLayer,    
        // type: type,
        source: new ol.source.TileWMS({
          url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
          crossOrigin: 'Anonymous',
          serverType: 'geoserver',
          params: {
            'LAYERS': 'PoCRA:Road',
            'TILED': true
          }
        }),
        visible: false,
        baseLayer: false,
        title: "Roads",
      }),
      new ol.layer.Tile({
        // extent: extentforLayer,    
        // type: type,
        source: new ol.source.TileWMS({
          url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
          crossOrigin: 'Anonymous',
          serverType: 'geoserver',
          params: {
            'LAYERS': 'PoCRA:River',
            'TILED': true
          }
        }),
        visible: false,
        baseLayer: false,
        title: "Rivers",
      }),
      new ol.layer.Tile({
        // extent: extentforLayer,    
        // type: type,
        source: new ol.source.TileWMS({
          url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
          crossOrigin: 'Anonymous',
          serverType: 'geoserver',
          params: {
            'LAYERS': 'PoCRA:Waterbody',
            'TILED': true
          }
        }),
        visible: false,
        baseLayer: false,
        title: "Waterbody",
      }),


    ]
  });

  // A group layer for Administrative layers
  const activityLayers = new ol.layer.Group({
    title: 'Activity Layers',
    openInLayerSwitcher: true,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/wms',
          crossOrigin: 'Anonymous',
          serverType: 'geoserver',
          params: {
            'LAYERS': 'PoCRA_Dashboard_V2:nrm_point_data_existing_structures',
            'TILED': true,
          }
        }),
        visible: false,
        baseLayer: false,
        title: "NRM Existing Structures",
      }),
      new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/wms',
          crossOrigin: 'Anonymous',
          serverType: 'geoserver',

          params: {
            'LAYERS': 'PoCRA_Dashboard_V2:nrm_point_data_pocra_structures',
            'TILED': true,
          }
        }),
        visible: false,
        baseLayer: false,
        title: "NRM PoCRA Structures",
      }),

    ]
  });

  // The Map
  const map = new ol.Map({
    view: new ol.View({
      center: [77.5, 18.95],
      zoom: 7.2,
      projection: 'EPSG:4326'
    }),
    target: 'pocra-dbt-nrm-map',
    layers: [baseLayerGroup, adminLayers, activityLayers]
  })


  // map.on('click', function (e) {
  //   console.log(e.coordinate);
  // })

  // Adding Base Layer to Map
  // map.addLayer(baseLayerGroup);

  // Layer Switcher Extention
  const layerSwitcher = new ol.control.LayerSwitcher({
    collapsed: false,
    // mouseover: true
  });
  map.addControl(layerSwitcher);

  // Legend Control Extention
  // Define a new legend
  var legend = new ol.legend.Legend({
    title: 'Legend',
    margin: 5,
    maxWidth: 300
  });
  var legendCtrl = new ol.control.Legend({
    legend: legend,
    collapsed: false
  });
  map.addControl(legendCtrl);

}

