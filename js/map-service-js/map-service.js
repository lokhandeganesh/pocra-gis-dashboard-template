window.addEventListener('DOMContentLoaded', event => {
  loadMapExport()

  function loadMapExport() {

    // The Map   

    // Initiating Map 
    // const variables are imported from proca-gis-api.js

    const baseLayerGroup = new ol.layer.Group({
      title: "Base Map's",
      openInLayerSwitcher: false,
      layers: [SATELLITE_MAP, STANDARD_MAP, WORLD_TOPO_MAP
      ]
    });

    const projectRegionLayerGroup = new ol.layer.Group({
      title: 'Project Region',
      openInLayerSwitcher: true,
      layers: [POCRA_DISTRICTS
      ]
    });

    const adminLayerGroup = new ol.layer.Group({
      title: 'Admin Layers',
      openInLayerSwitcher: false,
      layers: [MH_RIVERS_POLY, MH_RIVERS, MH_ROADS, MH_MAJOR_ROADS,
        MH_VILLAGES, MH_TALUKAS, MH_DISTRICTS
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
    // Print control
    const printControl = printControlConst
    printControl.setSize('A4');
    /* On print > save image file */
    printControl.on(['print', 'error'], function (e) {
      // Print success
      if (e.image) {
        if (e.pdf) {
          // Export pdf using the print info
          var pdf = new jsPDF({
            orientation: e.print.orientation,
            unit: e.print.unit,
            format: e.print.size
          });
          pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
          pdf.save(e.print.legend ? 'legend.pdf' : 'map.pdf');
        } else {
          // Save image as file
          e.canvas.toBlob(function (blob) {
            var name = (e.print.legend ? 'legend.' : 'map.') + e.imageType.replace('image/', '');
            saveAs(blob, name);
          }, e.imageType, e.quality);
        }
      } else {
        console.warn('No canvas to export');
      }
    });
    // Print map attribution on canvas
    const canvasAttributionControl = CanvasAttributionConst;
    // Add a title control
    const CanvasTitleControl = CanvasTitleConst;


    // All Controls
    const mapControls = [
      layerSwitcherControl, legendControl, attributionControl,
      scaleLineControl, zoomToExtentControl, fullScreenControl,
      printControl, CanvasTitleControl, canvasAttributionControl,
    ];

    // View for Mh
    const view = viewCosnt
    // Map instance
    const Map = new ol.Map({
      view: view,
      target: 'pocra-map-export-map',
      layers: [baseLayerGroup, adminLayerGroup, projectRegionLayerGroup,],
      // overlays: [popup],
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true,
      // change of expression in V7
      controls: ol.control.defaults.defaults({ attribution: false })
        // Adding new external controls on map
        .extend(mapControls),
    });
    // 
    view.animate({ center: [77, 18.95] }, { zoom: 7 });




    // End loadMap()
  };
  // End of init
});