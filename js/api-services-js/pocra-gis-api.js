// getDistrict()
const getDistrict = fetch('http://gis.mahapocra.gov.in/weatherservices/meta/districts')
  .then((response) => response.json())
  .then((data) => { return data.district })

// const renderDistricts = async () => {
//   const districts = await getDistrict;

//   // dropdown for District Selection
//   var ele = '' //document.getElementById("select-district");

//   console.log(districts)
//   districts.forEach(result => {
//     console.log(result);
//     ele.innerHTML += `<option value= ${result.district[i]["dtncode"]}>${result.district[i]["dtename"]}</option>`;
//     // Marathi District Name
//     ele.innerHTML += `<option value=${result.district[i]["dtncode"]}>${result.district[i]["dtnname"]}</option>`;
//   });
// }

// renderDistricts()

// Map Service Constants
// PoCRA Geoserver
const pocra_geoserver = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2"
const wfs_server = `${pocra_geoserver}/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application%2Fjson`
// Adding control to layer switcher
const baseLayerGroupConst = new ol.layer.Group({
  title: 'Base Layers',
  openInLayerSwitcher: false,
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
        url: `${pocra_geoserver}/wms`,
        crossOrigin: 'Anonymous',
        serverType: 'geoserver',

        params: {
          'LAYERS': 'PoCRA_Dashboard_V2:mh_district',
          'TILED': true,
        }
      }),
      visible: true,
      baseLayer: false,
      title: "PoCRA Districts",
      extent: [72.64, 5.60, 80.89, 22.02],

    }),
  ]
});
// Legend Control Extention
// Define a new legend  
const legendControlConst = new ol.control.Legend({
  legend: new ol.legend.Legend({
    title: 'Legend',
    margin: 5,
    maxWidth: 300
  }),
  collapsed: false
});
// Layer Switcher Extention
const layerSwitcherConst = new ol.control.LayerSwitcher({
  collapsed: true,
  mouseover: true,
  // extent: true
});
// Attribution on Map
const attributionControlConst = new ol.control.Attribution({
  collapsible: true,
});
// Scale Line control
const scaleLineControlConst = new ol.control.ScaleLine({
  // className: 'ol-scale-line',
  bar: true,
  minWidth: 100,
});
// Zoom to Extent control
const zoomToExtConst = new ol.control.ZoomToExtent({
  extent: [
    73.19613063800134, 15.124338344890079,
    81.80386936199866, 22.77566165510992
  ]
});
// Full Screen Control
const fullScreenConst = new ol.control.FullScreen({});
// View of Maharashtra
const viewCosnt = new ol.View({
  center: [77.5, 18.95],
  zoom: 7.2,
  projection: 'EPSG:4326'
})