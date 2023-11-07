window.onload = init;

function init() {


  const baseLayerGroup = new ol.layer.Group({
    title: 'Base Layers',
    openInLayerSwitcher: false,
    layers: [SATELLITE_MAP, STANDARD_MAP, WORLD_TOPO_MAP
    ]
  });

  const adminLayerGroup = new ol.layer.Group({
    title: 'Admin Layers',
    openInLayerSwitcher: false,
    layers: [POCRA_DISTRICTS
    ]
  });

  // Adding LayerGroup control to layer switcher
  // Define a new legend  
  const legendControl = legendControlConst
  // Layer Switcher Extention
  const layerSwitcherControl = layerSwitcherConst
  // Attribution on Map
  const attributionControl = attributionControlConst
  // Scale Line control
  const scaleLineControl = scaleLineControlConst
  // ZoomToExtent control
  const zoomToExtentControl = zoomToExtConst;
  // Full Screen Control
  const fullScreenControl = fullScreenConst;

  // All Controls
  const mapControls = [
    layerSwitcherControl, legendControl, attributionControl,
    scaleLineControl, zoomToExtentControl, fullScreenControl
  ];

  // View for Mh
  const view = viewCosnt
  // Map instance
  const Map = new ol.Map({
    view: view,
    target: 'pocra-administrative-map',
    layers: [baseLayerGroup, adminLayerGroup],
    // overlays: [popup],
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    // change of expression in V7
    controls: ol.control.defaults.defaults({
    })
      // Adding new external controls on map
      .extend(mapControls),
  });

  view.animate({ center: [77, 18.95] }, { zoom: 7 });

  // New legend associated with a POCRA_DISTRICTS layer    
  const POCRA_DISTRICTS_Legend = new ol.legend.Legend({ layer: POCRA_DISTRICTS });
  POCRA_DISTRICTS_Legend.addItem(new ol.legend.Image({
    title: 'Districts',
    // src: 'http://gis.mahapocra.gov.in/geoserver/wms?service=WMS&request=GetLegendGraphic&layer=PoCRA_Dashboard_V2:mh_district&FORMAT=image/png&legend_options=dpi:120'
    src: `${POCRA_DISTRICTS.getSource().getLegendUrl()}&legend_options=dpi:120`,
    // src: updateLegend(resolution, POCRA_DISTRICTS),
  }));
  LEGEND.addItem(POCRA_DISTRICTS_Legend);
}

