// window.onload = init;
// function init() {}

window.addEventListener('DOMContentLoaded', event => {

  // The Map

  // Initiating Map 
  // const variables are imported from proca-gis-api.js

  const baseLayerGroup = new ol.layer.Group({
    title: 'Base Layers',
    openInLayerSwitcher: false,
    layers: [SATELLITE_MAP, STANDARD_MAP, WORLD_TOPO_MAP]
  });
  // baseLayerGroup.set('openInLayerSwitcher', false);

  const projectRegionLayerGroup = new ol.layer.Group({
    title: 'Project Region',
    openInLayerSwitcher: false,
    layers: [POCRA_DISTRICTS]
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
  // geo Location control
  const geoLocControl = geolocationConst;
  // Show position
  var here = new ol.Overlay.Popup({ positioning: 'bottom-center' });

  // All Controls
  const mapControls = [
    layerSwitcherControl, legendControl, attributionControl,
    scaleLineControl, zoomToExtentControl, fullScreenControl,
    printControl, CanvasTitleControl, canvasAttributionControl,
    geoLocControl
  ];

  // 

  const adminLayers = new ol.layer.Group({
    title: 'Administrative Layers',
    openInLayerSwitcher: false,
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

  // Loader for display
  // districtVector.getSource().on("featuresloadstart", function (evt) {
  //   document.getElementById("layer-loader").classList.add("loader");
  // });

  // districtVector.getSource().on("featuresloadend", function (evt) {
  //   document.getElementById("layer-loader").classList.remove("loader");
  // });

  const activityLayersVector = new ol.layer.Group({
    title: 'Activity Layers',
    openInLayerSwitcher: true,
    layers: [
      new ol.layer.Vector({
        source: new ol.source.Vector({
          url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PoCRA_Dashboard_V2%3Anrm_point_data_pocra_structures&outputFormat=application%2Fjson",
          projection: 'EPSG:4326',
          format: new ol.format.GeoJSON(),
          style: (function (feature, resolution) {
            var style = new ol.style.Style({
              // image: new ol.style.Icon({
              //   scale: 0.04,
              //   src: '../../assets/img/com.svg',
              // }),
              text: new ol.style.Text({
                text: 'Vector Label',
                scale: 1.3,
                fill: new ol.style.Fill({
                  color: '#FF0000'
                }),
                stroke: new ol.style.Stroke({
                  color: '#FFFF99',
                  width: 3.5
                })
              })
            });
            var styles = [style];
            return function (feature, resolution) {
              style.getText().setText(feature.get("structure_type"));
              return styles;
            };
          })()
        }),
        visible: true,
        baseLayer: false,
        title: "NRM Structures",
      }),
    ]
  });

  // A group layer for Administrative layers (WMS)
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
        title: "Existing Structures",
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
        title: "Project Structures",
      }),
    ]
  });


  // Popup overlay
  var popup = new ol.Overlay.Popup({
    popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
    closeBox: true,
    // onshow: function () { console.log("You opened the box"); },
    // onclose: function () { console.log("You close the box"); },
    positioning: 'auto',
    autoPan: {
      animation: { duration: 250 }
    }
  });

  // Accessing global variable
  var districtVector
  var selectDistrict = document.getElementById('select-district');
  selectDistrict.addEventListener("change", function () {
    passValue(this.value);

    // getTaluka(this.value)
  });

  function passValue(districtCode) {
    alert(districtCode);
  }

  // View for Mh
  const view = viewCosnt;
  // Map instance
  const Map = new ol.Map({
    view: view,
    target: 'pocra-dbt-nrm-map',
    layers: [baseLayerGroup, projectRegionLayerGroup, adminLayers, activityLayers,],
    // overlays: [popup],
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    // change of expression in V7
    controls: ol.control.defaults.defaults({
    })
      // Adding new external controls on map
      .extend(mapControls),
  });
  // View animation
  view.animate({ center: [77, 18.95] }, { zoom: 7 });
  // Geolocation (locate me)
  Map.addOverlay(here);
  geoLocControl.on('position', function (e) {
    if (e.coordinate) here.show(e.coordinate, "You are<br/>here!");
    else here.hide();
  });

  // Changing mouse cursor style to Pinter
  Map.on('pointermove', function (e) {
    var pixel = Map.getEventPixel(e.originalEvent);
    var hit = Map.hasFeatureAtPixel(pixel);
    Map.getViewport().style.cursor = hit ? 'pointer' : '';
  });

  // GeoJson Layer of NRM Project(PoCRA) Points
  const nrmProjectVectorSource = new ol.source.Vector({
    url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PoCRA_Dashboard_V2%3Anrm_point_data_pocra_structures&outputFormat=application%2Fjson",
    projection: 'EPSG:4326',
    format: new ol.format.GeoJSON(),
  });

  // Adding Layer to Map
  Map.addLayer(new ol.layer.Vector({
    name: 'NRM Project Locations',
    source: nrmProjectVectorSource,
    visible: false,
    openInLayerSwitcher: true,
    style: (function () {

      var stdStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],   // Default value is the icon center.
          scale: 0.04,          // resize imge          
          src: '../../assets/img/subscription-svgrepo-com.svg'
        })
      });

      var freeStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],   // Default value is the icon center.
          scale: 0.04,          // resize imge
          color: '#49fc82',    // green
          crossOrigin: 'anonymous',
          src: '../../assets/img/com.svg'
        })
      });

      var style = new ol.style.Style({
        // image: new ol.style.Icon({
        //   anchor: [0.5, 0.5],   // Default value is the icon center.
        //   scale: 0.04,          // resize imge
        //   // color: '#49fc82',    // green
        //   crossOrigin: 'anonymous',
        //   src: '../../assets/img/subscription-svgrepo-com.svg'
        // }),
        text: new ol.style.Text({
          textAlign: 'top',
          textBaseline: 'bottom',
          offsetX: 0,
          offsetY: 0,
          text: 'Vector Label',
          scale: 1.3,
          fill: new ol.style.Fill({
            color: '#FF0000'
          }),
          stroke: new ol.style.Stroke({
            color: '#FFFF99',
            width: 3.5
          })
        })
      });
      var styles = [style];
      return function (feature, resolution) {
        // var activity_code = feature.get("activity_code")
        // activity_code === 'A3.2.3' ? stdStyle : freeStyle
        // console.log(feature.get("activity_code"))
        style.getText().setText(feature.get("structure_type"));
        return styles;
      };
    })()
  }));

  // Control Select
  const selectClick = new ol.interaction.Select({});
  Map.addInteraction(selectClick);

  // Select interaction on map
  selectClick.on('select', function (evt) {
    if (evt.selected.length > 0) {
      evt.selected.forEach(function (feature) {
        // feature.getLayer(Map) imported from openLayerCustom.js
        var layer = feature.getLayer(Map);

        // Fly to location on Map click event
        if (layer.get('name') == 'Project Districts') {
          var selectedFeatureExtent = feature.getGeometry().getExtent();
          Map.getView().fit(selectedFeatureExtent, { duration: 2000 });

        }

        // Custom content for pop-up on click event of nrm project location        
        if (layer.get('name') == 'NRM Project Locations') {
          var content = "";
          content +=
            `
            <div class="container">
              <div class="row">
                <div class="">
                  <table class="table table-striped ">
                    <thead>
                      <tr>
                        <th>Attibutes</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th colspan="2" style="font-weight: normal;">Activity Name</th>
                      </tr>
                      <tr>
                        <th colspan="2">${feature.get('activity_name')}</th>
                      </tr>
                      <tr>
                        <td>Activity Code</td>
                        <td>${feature.get('activity_code')}</td>
                      </tr>
                      <tr>
                        <td>District</td>
                        <td>${feature.get('district')}</td>
                      </tr>
                      <tr>
                        <td>Taluka</td>
                        <td>${feature.get('taluka')}</td>
                      </tr>
                      <tr>
                        <td>Village</td>
                        <td>${feature.get('village')} (${feature.get('vincode')})</td>
                      </tr>
                      <tr>
                        <td>Application Number</td>
                        <td>${feature.get('application_number')}</td>
                      </tr>
                      <tr>
                        <th colspan="2">Activity Image</th>
                      </tr>
                      <tr>
                        <th colspan="2">
                          <img
                            class="rounded float-start"
                            style="width:100%; height: 200px;
                            border-radius: 5px;  cursor: pointer;  transition: 0.3s;"
                            src="${feature.get('img_url')}" data-bs-toggle="modal"
                            data-bs-target="#enlargeImageModal"
                          />
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          `
          // PopUp calling with content
          popup.show(feature.getGeometry().getFirstCoordinate(), content);
          // Setting parameters to Image Modal
          $('#activityImageModalLabel').text(`Activity Name : ${feature.get('activity_name')}`);
          $('#modalImage').attr('src', feature.get('img_url'));
        }
      });
    }
  });
  // hiding pop-up if pointer selection does not contain any feature
  selectClick.getFeatures().on(['remove'], function (evt) {
    popup.hide();
  });

  // Controls on Map

  // Define a new legend

});