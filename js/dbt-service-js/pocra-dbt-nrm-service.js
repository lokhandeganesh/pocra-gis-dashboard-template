// window.onload = init;
// function init() {}

window.addEventListener('DOMContentLoaded', event => {

  var act_category = 'nrm'
  loadDBT_Activities(act_category = act_category);

  // The Map

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
  // Setting layer visibility
  POCRA_DISTRICTS.setVisible(false)

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

  // NRM Exsting Vasundhara Activities
  // NRM_Existing_Locations // Imported from common js page

  // DBT NRM Layer Group
  const activityLayerGroup = new ol.layer.Group({
    title: 'Activities',
    openInLayerSwitcher: true,
    layers: [dbt_nrm_summery_all_dist_act_TEST,
      NRM_Project_Locations, NRM_Existing_Locations,
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
  // geo Location control
  const geoLocControl = geolocationConst;
  // Show position
  const here = new ol.Overlay.Popup({ positioning: 'bottom-center' });

  // All Controls
  const mapControls = [
    layerSwitcherControl, legendControl, attributionControl,
    scaleLineControl, zoomToExtentControl, fullScreenControl,
    printControl, CanvasTitleControl, canvasAttributionControl,
    geoLocControl
  ];

  // Accessing global variable
  // View for Mh
  const view = viewCosnt;
  // Map instance
  const Map = new ol.Map({
    view: view,
    target: 'pocra-dbt-nrm-map',
    layers: [baseMapGroup, baseLayerGroup,
      //activityLayers, activityLayersVector, 
      activityLayerGroup, adminLayerGroup, projectRegionLayerGroup],
    // overlays: [popup],
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    // change of expression in V7
    controls: ol.control.defaults.defaults({
    })
      // Adding new external controls on map
      .extend(mapControls),
    overlays: [popup]
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
  Map.on('pointermove', function (evt) {
    if (evt.dragging) {
      return;
    }
    const data = NRM_Project_Locations.get('visible') ?  
            NRM_Project_Locations.getData(evt.pixel) : 
            dbt_nrm_summery_all_dist_act_TEST.getData(evt.pixel);
    
    const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
    Map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // Add an event handler for the Map "singleclick" event
  Map.on('singleclick', function(evt) {
      // Hide existing popup and reset it's offset
    popup.hide();
    popup.setOffset([0, 0]);
    
    let coordinate = evt.coordinate;
    let viewResolution = view.getResolution();
    let projection = view.getProjection();
    let format = {'INFO_FORMAT': 'application/json'};
       
    var source = NRM_Project_Locations.get('visible') ? 
        NRM_Project_Locations.getSource() : 
        dbt_nrm_summery_all_dist_act_TEST.getSource();
    
    const url  = source.getFeatureInfoUrl(coordinate, viewResolution, projection, format);
    if (url) {      
      $.ajax({ url: url, crossOrigin: '*',
          dataType: 'json', jsonpCallback: 'parseResponse'
      })
      .then(function (data) {
        if (data.features.length > 0) {
          //Do something with data.features          
          // console.log(data);
          var feature = data.features[0];
          const featureTitle = feature.id.split(".")[0]
          // console.log(featureTitle);
          var props = feature.properties;        
          // console.log(props);
        
          switch(featureTitle) {
            case 'dbt_nrm_project_application_data':
              // Custom content for pop-up on click event of nrm project location              
              // console.log(feature)
              const FEAT_activity_name = props['maj_act_name']
              const FEAT_activity_code = props['act_code']
              const FEAT_dtname = props['dtname']
              const FEAT_thname = props['thname']
              const FEAT_vlname = props['vlname']
              const FEAT_vincode = props['vincode']
              const FEAT_application_number = props['appl_num']
              const FEAT_survey_no = props['pin']
              const FEAT_desk5_img = props['desk5_img']
              const FEAT_desk6_img = props['desk6_img']
              const FEAT_desk7_img = props['desk7_img']
              
              // PopUp calling with content
              content = getPopUpTable(FEAT_activity_name, FEAT_activity_code, FEAT_dtname, FEAT_thname, FEAT_vlname, FEAT_vincode, FEAT_application_number, FEAT_desk5_img, FEAT_desk6_img, FEAT_desk7_img, FEAT_survey_no);
              popup.show(coordinate, content);
              // Setting parameters to Image Modal
              $('#activityImageModalLabel').text(`Activity Name : ${FEAT_activity_name}`);
              $('#modal-1').attr('src', FEAT_desk5_img);
              $('#modal-2').attr('src', FEAT_desk6_img);
              $('#modal-3').attr('src', FEAT_desk7_img);
              break;
            case 'dbt_nrm_test':
              var info = "<h2>" + props.dtname + "</h2><p>" + props.dtncode + "</p>";
              popup.show(coordinate, info);
              break;
            default:
              // code block
          }
      }
      })
    }
  });
  
  // Function to show popup content on feature selection
  function getPopUpTable(activity_name, activity_code, dtname, thname, vlname, vincode, application_number, desk5_img, desk6_img, desk7_img, survey_no) {
    var PopUpContent = ''
    PopUpContent +=
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
                  <td>District :-</td>
                  <td class="tbl-bold">${dtname}</td>
                </tr>
                <tr>
                  <td>Taluka :-</td>
                  <td class="tbl-bold">${thname}</td>
                </tr>
                <tr>
                  <td>Village :-</td>
                  <td class="tbl-bold">${vlname} (${vincode})</td>
                </tr>
                <tr>
                  <th colspan="2" style="font-weight: normal;">Activity Name :-</th>
                </tr>
                <tr>
                  <th colspan="2">${activity_name}(${activity_code})</th>
                </tr>
                <tr>
                  <td>Application Number :-</td>
                  <td class="tbl-bold">${application_number}</td>
                </tr>
                <tr class="tr-box">
                  <td>Survey (Gat) No. :-</td>
                  <td class="tbl-bold">${survey_no}</td>
                </tr>
                <tr>
                  <th colspan="2">Activity Image</th>
                </tr>
                <tr>
                  <th colspan="2">
                    <div>
                      <div id="selectPopUp" class="carousel slide" data-bs-ride="carousel">
                        <!-- Indicators/dots -->
                        <div class="carousel-indicators">
                          <button
                            type="button"
                            data-bs-target="#selectPopUp"
                            data-bs-slide-to="0"
                            class="active"
                          ></button>
                          <button
                            type="button"
                            data-bs-target="#selectPopUp"
                            data-bs-slide-to="1"
                          ></button>
                          <button
                            type="button"
                            data-bs-target="#selectPopUp"
                            data-bs-slide-to="2"
                          ></button>
                        </div>
                        <!-- The slideshow/carousel -->
                        <div class="carousel-inner">
                          <div class="carousel-item active thumbnail">
                            <img
                              class="rounded float-start carasoul-popup-img"                              
                              src="${desk5_img}"
                              data-bs-toggle="modal"
                              data-bs-target="#enlargeImageModal"
                            />
                          </div>
                          <div class="carousel-item thumbnail">
                            <img
                              class="rounded float-start carasoul-popup-img"                              
                              src="${desk6_img}"
                              data-bs-toggle="modal"
                              data-bs-target="#enlargeImageModal"
                            />
                          </div>
                          <div class="carousel-item thumbnail">
                            <img
                              class="rounded float-start carasoul-popup-img"                              
                              src="${desk7_img}"
                              data-bs-toggle="modal"
                              data-bs-target="#enlargeImageModal"
                            />
                          </div>
                        </div>
                        <!-- Left and right controls/icons -->
                        <button
                          class="carousel-control-prev"
                          type="button"
                          data-bs-target="#selectPopUp"
                          data-bs-slide="prev"
                        >
                          <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button
                          class="carousel-control-next"
                          type="button"
                          data-bs-target="#selectPopUp"
                          data-bs-slide="next"
                        >
                          <span class="carousel-control-next-icon"></span>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `

    return PopUpContent
  }

  // On Change event 
  // Declaring Global variable to empty on change event
  var Geojson;
  function getSelected(CODE, TYPE_NAME, FILTER) {
    // Removing previous layer from layerGroup loaded on map
    Map.removeLayer(projectRegionLayerGroup);

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

      // Once Map is loaded and fit to extent we will remove GeoJson Feature
      Map.removeLayer(Geojson);
    });
    // added vector layer
    Map.addLayer(Geojson);


  }

  // defining global variable for dropdown 
  var distCode, talCode, vinCode, summClassEnv = 'comm_appl_class', labelEnv = 'comm_appl_mv';
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
    // Accessing Radio Button Value
    console.log(summClassEnv);
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

  // Radio Button Click Event
  // if option is seleceted / change
  $('input[name="applicationStatus"]').change(() => {
    const $applnStatusRadioChecked = $('input[name="applicationStatus"]:checked').val();
    summClassEnv = `${$applnStatusRadioChecked}_class`;
    labelEnv = `${$applnStatusRadioChecked}_mv`;

    updateNRMParams(summClassEnv, labelEnv);
    // dbt_nrm_summery_all_dist_act_TEST.getSource().updateParams({ 'env': `nrm_summr_class:${summClassEnv};nrm_summr_mv:${labelEnv}` });

  });

  function updateNRMParams(summClassEnv, labelEnv) {
    Map.getView().setZoom(6.8);
    dbt_nrm_summery_all_dist_act_TEST.getSource().updateParams({ 'env': `nrm_summr_class:${summClassEnv};nrm_summr_mv:${labelEnv}` });
    // View animation
    view.animate({ center: [77, 18.95] }, { zoom: 7.2 });
  }


});