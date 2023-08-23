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
        // extent: [-653182.6969582437, 5037463.842847037, 1233297.5065495989, 6646432.677299531],

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
        title: "NRM Project Structures",
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

  // The Map
  const map = new ol.Map({
    view: new ol.View({
      center: [77.5, 18.95],
      zoom: 7.2,
      projection: 'EPSG:4326'
    }),
    target: 'pocra-dbt-nrm-map',
    layers: [baseLayerGroup, adminLayers, activityLayers],
    overlays: [popup],
    // controls: new ol.control.extend([scaleLineControl]),
  })

  // GeoJson Layer of NRM Project(PoCRA) Points
  const nrmProjectVectorSource = new ol.source.Vector({
    url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PoCRA_Dashboard_V2%3Anrm_point_data_pocra_structures&outputFormat=application%2Fjson",
    projection: 'EPSG:4326',
    format: new ol.format.GeoJSON(),

  })
  // Adding Layer to Map
  map.addLayer(new ol.layer.Vector({
    name: 'NRM Project Locations',
    source: nrmProjectVectorSource,
    style: (function () {
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
        style.getText().setText(feature.get("application_number"));
        return styles;
      };
    })()
  }))

  // Control Select
  const select = new ol.interaction.Select({});
  map.addInteraction(select);

  // On Selected => show/hide popup
  select.getFeatures().on(['add'], function (evt) {
    var feature = evt.element;
    console.log(feature);
    // console.log(feature.get('application_number'));
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
                    style="width:100%; height: 200px; cursor: pointer"
                    src="${feature.get('img_url')}"
                  />
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    `

    popup.show(feature.getGeometry().getFirstCoordinate(), content);
  });
  select.getFeatures().on(['remove'], function (evt) {
    popup.hide();
  });

  // map.on('click', function (e) {
  //   console.log(e.coordinate);
  // })

  // Adding Base Layer to Map
  // map.addLayer(baseLayerGroup);

  // Layer Switcher Extention
  const layerSwitcher = new ol.control.LayerSwitcher({
    collapsed: true,
    mouseover: true,
    // extent: true

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

