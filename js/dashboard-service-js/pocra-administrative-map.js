window.onload = init;

function init() {

  const Map = new ol.Map({
    view: new ol.View({
      center: [77.5, 18.95],
      zoom: 7.2,
      projection: 'EPSG:4326'
    }),
    // layers: [
    //   new ol.layer.Tile({
    //     source: new ol.source.OSM()
    //   })
    // ],
    target: 'pocra-administrative-map'
  })


  // Map.on('click', function (e) {
  //   console.log(e.coordinate);
  // })

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
        title: "PoCRA Districts",
        source: new ol.source.TileWMS({
          url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/wms',
          crossOrigin: 'Anonymous',
          serverType: 'geoserver',
          visible: true,
          baseLayer: false,
          params: {
            'LAYERS': 'PoCRA_Dashboard_V2:mh_district',
            'TILED': true,
          }
        })
      }),
    ]
  })


  // Adding Base Layer to Map
  Map.addLayer(baseLayerGroup);

  // Layer Switcher Extention
  const layerSwitcher = new ol.control.LayerSwitcher({
    collapsed: true,
    // mouseover: true
  });
  Map.addControl(layerSwitcher);

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
  Map.addControl(legendCtrl);

}

