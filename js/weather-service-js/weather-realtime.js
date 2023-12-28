window.addEventListener('DOMContentLoaded', event => {
  loadRealtimeWeatherMap()

  function loadRealtimeWeatherMap() {

    // Initiating Map 
    // const variables are imported from proca-gis-api.js

    const baseMapGroup = new ol.layer.Group({
      title: "Base Map's",
      openInLayerSwitcher: false,
      layers: [SATELLITE_MAP, STANDARD_MAP, WORLD_TOPO_MAP
      ]
    });

    // Setting layer visibility
    WORLD_TOPO_MAP.setVisible(false);

    // baseMapGroup.set('openInLayerSwitcher', false);
    const projectRegionLayerGroup = new ol.layer.Group({
      title: 'Project Region',
      openInLayerSwitcher: false,
      layers: [POCRA_DISTRICTS,
      ]
    });
    // Setting layer visibility
    POCRA_DISTRICTS.setVisible(false);

    const adminLayerGroup = new ol.layer.Group({
      title: 'Admin Layers',
      openInLayerSwitcher: false,
      layers: [
        MH_VILLAGES, MH_TALUKAS, MH_DISTRICTS,
      ]
    });
    // Setting layer visibility
    MH_DISTRICTS.setVisible(true);
    MH_DISTRICTS.setOpacity(0.5);

    const baseLayerGroup = new ol.layer.Group({
      title: 'Base Layers',
      openInLayerSwitcher: false,
      layers: [MH_LULC_1516, MH_Settlement_1516, MH_Waterbody_1516,
        MH_RIVERS_POLY, MH_RIVERS, MH_ROADS, MH_MAJOR_ROADS,
      ]
    });

    // Fetching weather station data
    // Point Locations of weather station Source 
    const weather_station_current_day_source = new ol.source.Vector({
      url: `${wfs_server}&typeName=weather_station_current_day`,
      projection: 'EPSG:4326',
      format: new ol.format.GeoJSON(),
    });

    // NRM_Project_Locations Vector GeoJson Layer
    const weather_station_current_day = new ol.layer.Vector({
      source: weather_station_current_day_source,
      visible: true,
      baseLayer: false,
      title: 'Weather Stations',
      style: (function () {
        var freeStyle = new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 0.5],   // Default value is the icon center.
            scale: 0.5,          // resize imge
            // color: '#ff0012',    // green
            crossOrigin: 'anonymous',
            src: '../../assets/img/weather_station_.svg'
          })
        });
        var styles = [freeStyle];
        return styles;
      })()
    });

    // Maharashtra Weather Last Day Rainfall Raster
    const weather_rainfall_last_day = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: `${pocra_geoserver}/wms`,
        crossOrigin: 'Anonymous',
        serverType: 'geoserver',
        params: {
          'LAYERS': 'PoCRA_Dashboard_V2:rainfall_last_day',
          // 'LAYERS': 'PoCRA_Dashboard_V2:weather_temp_max_last_day',
          // 'LAYERS': 'PoCRA_Dashboard_V2:min_temp_last_day',
          'TILED': true,
        }
      }),
      visible: false,
      baseLayer: false,
      title: "Rainfall Interpolation",
    });
    // New legend associated with a layer MH_Waterbody_1516
    const weather_rainfall_last_day_Legend = new ol.legend.Legend({ layer: weather_rainfall_last_day });
    weather_rainfall_last_day_Legend.addItem(new ol.legend.Image({
      title: "",
      src: `${weather_rainfall_last_day.getSource().getLegendUrl()}&legend_options=dpi:120`,
      // src: updateLegend(resolution, MH_Waterbody_1516),
    }));
    LEGEND.addItem(weather_rainfall_last_day_Legend);


    // Weather Layer Group
    const weatherLayerGroup = new ol.layer.Group({
      title: 'Weather Layers',
      openInLayerSwitcher: true,
      layers: [weather_rainfall_last_day, weather_station_current_day]
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
      target: 'pocra-weather-realtime-map',
      layers: [baseMapGroup, baseLayerGroup,
        weatherLayerGroup,
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

    view.animate({ center: [77, 18.95] }, { zoom: 7.2 });


    // Feature :hover logic
    const popoverTextElement = $('#popover-text').get(0)  //document.getElementById('popover-text');  
    const popoverTextLayer = new ol.Overlay({
      element: popoverTextElement,
      positioning: 'bottom-center',
      stopEvent: false
    });

    Map.addOverlay(popoverTextLayer);

    // Changing cursor style & adding rain_circle info on pointer move
    Map.on('pointermove', (evt) => {
      let isFeatureAtPixel = Map.hasFeatureAtPixel(evt.pixel);
      if (isFeatureAtPixel) {
        let featureAtPixel = Map.getFeaturesAtPixel(evt.pixel);
        let featureName = featureAtPixel[0].get('rain_circle');
        popoverTextLayer.setPosition(evt.coordinate);
        popoverTextElement.innerHTML = featureName;
      } else {
        popoverTextLayer.setPosition(undefined);
      };
      // Changing cursor style for feature to 'pointer'
      let viewPortStyle = Map.getViewport().style
      isFeatureAtPixel ? viewPortStyle.cursor = 'pointer' : viewPortStyle.cursor = ''
    });

    // rain_circle

    // Overlay
    var menu = new ol.control.Overlay({
      closeBox: true,
      className: "slide-left menu",
      content: $("#menu").get(0)
    });
    Map.addControl(menu);

    // A toggle control to show/hide the menu
    var t = new ol.control.Toggle({
      html: '<i class="fa fa-bars" ></i>',
      className: "menu",
      title: "Menu",
      onToggle: function () { menu.toggle(); }
    });
    Map.addControl(t);


    const selectClick = new ol.interaction.Select({ condition: ol.events.condition.singleClick });
    Map.addInteraction(selectClick);

    // Select interaction on map
    selectClick.on('select', function (evt) {
      if (evt.selected.length > 0) {
        evt.selected.forEach(function (feature) {
          // feature.getLayer(Map) imported from openLayerCustom.js
          var layer = feature.getLayer(Map);
          // console.log(layer)

          // Custom content for pop-up on click event of nrm project location        
          if (layer.get('title') == 'Weather Stations') {
            // console.log(feature)


            const FEAT_rain_circle = feature.get('rain_circle')
            console.log(FEAT_rain_circle);

            // const FEAT_activity_code = feature.get('activity_code')
            // const FEAT_vincode = feature.get('vincode')
            // const FEAT_application_number = feature.get('application_number')
            // const FEAT_survey_no = feature.get('survey_no')
            // const FEAT_desk5_img = feature.get('desk5_img')
            // const FEAT_desk6_img = feature.get('desk6_img')
            // const FEAT_desk7_img = feature.get('desk7_img')
            // // console.log(content);
            // // PopUp calling with content
            // content = getPopUpTable(FEAT_activity_name, FEAT_activity_code, FEAT_vincode, FEAT_application_number, FEAT_desk5_img, FEAT_desk6_img, FEAT_desk7_img, FEAT_survey_no);
            // // console.log(feature.getGeometry().getFirstCoordinate());
            // popup.show(feature.getGeometry().getFirstCoordinate(), content);
            // // Setting parameters to Image Modal
            // $('#activityImageModalLabel').text(`Activity Name : ${FEAT_activity_name}`);
            // $('#modal-1').attr('src', FEAT_desk5_img);
            // $('#modal-2').attr('src', FEAT_desk6_img);
            // $('#modal-3').attr('src', FEAT_desk7_img);
          }
        });
      }
    });

    // hiding pop-up if pointer selection does not contain any feature
    selectClick.getFeatures().on(['remove'], function (evt) {
      $(".data").html("");
    });






    // defining global variable for dropdown 
    var distCode = '-1', talCode = '-1', vinCode = '-1', weatherParam = 'rainfall', realtimeEnv = 'last_day';
    // if option is seleceted / change
    $('input[name="weatherRealtime"]').change(() => {
      const $weatherRealtimeRadioChecked = $('input[name="weatherRealtime"]:checked').val();
      realtimeEnv = $weatherRealtimeRadioChecked;
      console.log(realtimeEnv);
      // dbt_nrm_summery_all_dist_act_TEST.getSource().updateParams({ 'env': `nrm_summr_class:${summClassEnv};nrm_summr_mv:${labelEnv}` });
    });




    // End loadRealtimeWeatherMap()
  }
  // End of init
});



