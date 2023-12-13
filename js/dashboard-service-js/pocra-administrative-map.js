window.onload = init;

function init() {


  // Initiating Map 
  // const variables are imported from proca-gis-api.js

  const baseMapGroup = new ol.layer.Group({
    title: "Base Map's",
    openInLayerSwitcher: false,
    layers: [SATELLITE_MAP, STANDARD_MAP, WORLD_TOPO_MAP
    ]
  });
  // baseMapGroup.set('openInLayerSwitcher', false);
  const projectRegionLayerGroup = new ol.layer.Group({
    title: 'Project Region',
    openInLayerSwitcher: false,
    layers: [POCRA_DISTRICTS,
    ]
  });

  const adminLayerGroup = new ol.layer.Group({
    title: 'Admin Layers',
    openInLayerSwitcher: false,
    layers: [
      MH_VILLAGES, MH_TALUKAS, MH_DISTRICTS,
    ]
  });

  const baseLayerGroup = new ol.layer.Group({
    title: 'Base Layers',
    openInLayerSwitcher: false,
    layers: [MH_LULC_1516, MH_Settlement_1516, MH_Waterbody_1516,
      MH_RIVERS_POLY, MH_RIVERS, MH_ROADS, MH_MAJOR_ROADS,
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
    layers: [baseMapGroup, baseLayerGroup,
      // activityLayerGroup, 
      adminLayerGroup, projectRegionLayerGroup],
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


}

