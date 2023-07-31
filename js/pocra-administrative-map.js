window.onload = init;



function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [75.96, 19.12],
      zoom: 7,
      projection: 'EPSG:4326'
    }),
    // layers: [
    //   new ol.layer.Tile({
    //     source: new ol.source.OSM()
    //   })
    // ],
    target: 'pocra-administrative-map'
  })


  // map.on('click', function (e) {
  //   console.log(e.coordinate);
  // })

  // Layer Group //
  // OSM Standard Map
  // const OSM_StandardMap = new ol.layer.Tile({
  //   source: new ol.source.OSM(),
  //   visible: false,
  //   title: 'Standard Map'
  // })

  // Stamen Terrain Map
  // const stamenTerrain = new ol.layer.Tile({
  //   source: new ol.source.XYZ({
  //     url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
  //   }),
  //   visible: true,
  //   title: 'Stamen Terrain Map'
  // })

  // OSM Humanitarian Map
  // const OSM_HumanitarianMap = new ol.layer.Tile({
  //   source: new ol.source.OSM({
  //     url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
  //   }),
  //   visible: false,
  //   title: 'Humanitarian Map'
  // })

  // Hybrid Map
  // const Hybrid = new ol.layer.Tile({
  //   source: new ol.source.XYZ({
  //     url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
  //   }),
  //   visible: false,
  //   title: 'Satellite Map'
  // })



  // Adding Specific Single Layer  to Map
  // map.addLayer(OSM_StandardMap);

  // Adding Layer Group to Map
  // const baseLayerGroup = new ol.layer.Group({
  //   layers: [
  //     stamenTerrain, OSM_StandardMap,
  //     OSM_HumanitarianMap, Hybrid
  //   ]
  // })

  // map.addLayer(baseLayerGroup);

  // Adding control to layer switcher
  const baseLayerGroup = new ol.layer.Group({
    title: 'Base Layers',
    openInLayerSwitcher: true,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        baseLayer: false,
        visible: false,
        title: 'Humanitarian Map'
      }),
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
          url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
        }),
        visible: true,
        baseLayer: false,
        title: 'Stamen Terrain Map'
      }),
    ]
  })

  // Adding Base Layer to Map
  map.addLayer(baseLayerGroup);

  // Layer Switcher Extention
  const layerSwitcher = new ol.control.LayerSwitcher();
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
    collapsed: true
  });
  map.addControl(legendCtrl);

}