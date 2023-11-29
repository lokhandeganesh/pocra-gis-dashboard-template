window.addEventListener('DOMContentLoaded', event => {
  loadTest();


  function loadTest() {

    // The Map   

    // Initiating Map 
    // const variables are imported from proca-gis-api.js

    const baseMapGroup = new ol.layer.Group({
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


    // Adding layer from pg_tileserv 
    var vectorServer = "http://localhost:7800";
    var vectorSourceLayer = "pocra_dashboard.MahaDist";
    var vectorProps = 'district= Ahmadnagar'
    var vectorUrl = `${vectorServer}/${vectorSourceLayer}/{z}/{x}/{y}.pbf`; //vectorProps;

    // var vectorUrl = "http://104.211.177.251:7800/staticdata.districts/{z}/{x}/{y}.pbf";
    //vectorServer + vectorSourceLayer + "/{z}/{x}/{y}.pbf" + vectorProps;

    var vectorStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 2,
        color: "#ff00ff99",
      }),
      // fill: new ol.style.Fill({
      //   color: "#ff00ff33",
      // }),
    });

    var vectorLayer = new ol.layer.VectorTile({
      name: 'MahaDist',
      source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        url: vectorUrl,
        // projection: 'EPSG:4326',
      }),
      style: vectorStyle,
    });

    // View for Mh
    const view = viewCosnt
    // Map instance
    const Map = new ol.Map({
      view: view,
      target: 'pocra-test-map',
      layers: [baseMapGroup, vectorLayer],
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



    // 
    var current_rainfall_url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PoCRA_Dashboard%3AweatherLayer&outputFormat=application%2Fjson&maxFeatures=50"
    // GeoJson Layer of current_rainfall weather_station (PoCRA) Points
    const currentRainfallVectorSource = new ol.source.Vector({
      url: current_rainfall_url,
      projection: 'EPSG:4326',
      format: new ol.format.GeoJSON(),
    });

    // Adding Layer to Map
    // Map.addLayer(new ol.layer.Vector({
    //   name: 'Current Rainfall',
    //   source: currentRainfallVectorSource,
    //   visible: false,
    //   openInLayerSwitcher: true,
    // }));

    const weather_current_rainfall = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: `${pocra_geoserver}/wms`,
        crossOrigin: 'Anonymous',
        serverType: 'geoserver',
        params: {
          'LAYERS': 'PoCRA_Dashboard_V2:weather_current_rainfall',
          'TILED': true,
        }
      }),
      visible: true,
      baseLayer: false,
      title: "Rainfall Weather Station",
    });

    // Map.addLayer(weather_current_rainfall);
    Map.on('click', vectorLayer.getSource(), function (e) {
      // new maplibregl.Popup()
      //   .setLngLat(e.lngLat)
      //   .setHTML(featureHtml(e.features[0]))
      //   .addTo(map);

      console.log(e)
    });

    // Vector Tile Layer
    // console.log(vectorLayer.getSource())

    var layerName = 'PoCRA_Dashboard_V2:mh_districts';
    var paramValue = '501'
    var url = `${wfs_server}&${layerName}&CQL_FILTER=dtncode+ILike+%27501%27`;


    // Adding Layer to Map
    // Map.addLayer(new ol.layer.VectorTile({
    //   name: 'MahaDist',
    //   source: MahaDistVectorSource,
    //   visible: true,
    //   openInLayerSwitcher: true,
    //   style: new ol.style.Style({
    //     stroke: new ol.style.Stroke({
    //       width: 1,
    //       color: "#0f5f61"
    //     })
    //   })
    // }));


    // On Change event 
    // declaring Global variable to empty on change event
    var Geojson;
    function getSelected(CODE, TYPE_NAME, FILTER) {
      // Removing previous layer from layerGroup loaded on map
      Map.removeLayer(vectorLayer);

      // removing previou layer loaded on map change event
      if (Geojson) {
        Map.removeLayer(Geojson);
      };
      // defining new vector layer to access its properties
      Geojson = new ol.layer.Vector({
        title: TYPE_NAME,
        source: new ol.source.Vector({
          // `${pocra_geoserver}/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application%2Fjson`
          url: `${wfs_server}&typeName=${TYPE_NAME}&CQL_FILTER=${FILTER}+ILike+'${CODE}'`,
          format: new ol.format.GeoJSON()
        }),
      });
      // adding event from layer loading
      Geojson.getSource().on('addfeature', function () {
        Map.getView().fit(
          Geojson.getSource().getExtent(), { duration: 1600, size: Map.getSize() - 200 }
        );
      });
      // added vector layer
      Map.addLayer(Geojson);
    }

    // defining global variable for dropdown 
    var distCode, talCode, vinCode;
    // On Change event for District Dropdown selection
    $('#select-district').change(function () {
      // console.log(this.value);
      // accessing dropdown value
      distCode = this.value;
      // logic for if 'All' value selected
      if (distCode === '-1') {
        view.animate({ center: [77, 18.95] }, { zoom: 7 });
        Map.removeLayer(Geojson);
      }
      // logic for if value selected
      else {
        getSelected(CODE = distCode, TYPE_NAME = 'mh_districts', FILTER = 'dtncode');
      }
    });

    // On Change event for Taluka Dropdown selection
    $('#select-taluka').change(function () {
      // console.log(this.value);
      // accessing dropdown value
      talCode = this.value;
      // logic for if 'All' value selected
      if (talCode === '-1') {
        // alert(distCode)
        getSelected(CODE = distCode, TYPE_NAME = 'mh_districts', FILTER = 'dtncode');
      }
      // logic for if value selected
      else {
        getSelected(CODE = talCode, TYPE_NAME = 'mh_talukas', FILTER = 'thncode');
      };
    });
    // On Change event for Village Dropdown selection
    $('#select-village').change(function () {
      // console.log(this.value);
      // accessing dropdown value
      vinCode = this.value;
      // logic for if 'All' value selected
      if (vinCode === '-1') {
        // alert(distCode)
        getSelected(CODE = talCode, TYPE_NAME = 'mh_talukas', FILTER = 'thncode');
      }
      // logic for if value selected
      else {
        getSelected(CODE = vinCode, TYPE_NAME = 'mh_villages', FILTER = 'vincode');

      };
    });

    // End loadTest()
  };

  // End of init
});







