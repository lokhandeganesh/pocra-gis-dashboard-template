
// Map Service Constants
// new ol.proj.useGeographic();
// PoCRA Geoserver
const pocra_geoserver = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2"
const wfs_server = `${pocra_geoserver}/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application%2Fjson`

// Legend Control Extention
// Define a new legend  
const LEGEND = new ol.legend.Legend({
  title: 'Legend',
  margin: 5,
  maxWidth: 300
});

const legendControlConst = new ol.control.Legend({
  legend: LEGEND,
  collapsed: true
});
// Adding control to layer switcher

// Base Map's of Satellite imagery
const SATELLITE_MAP = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
  }),
  visible: false,
  baseLayer: false,
  title: 'Satellite Map'
});
const STANDARD_MAP = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  baseLayer: false,
  title: 'Standard Map'
});
const WORLD_TOPO_MAP = new ol.layer.Tile({
  source: new ol.source.XYZ({
    attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
      'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
      'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    crossOrigin: 'Anonymous',
  }),
  visible: false,
  baseLayer: false,
  title: 'World Topo Map',
  type: 'base',

});
// Project Districts
const POCRA_DISTRICTS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_project_districts',
      'TILED': true,
    }
  }),
  visible: true,
  baseLayer: false,
  title: "PoCRA Districts",
  extent: [72.64, 5.60, 80.89, 22.02],
});
// New legend associated with a layer POCRA_DISTRICTS
const POCRA_DISTRICTS_Legend = new ol.legend.Legend({ layer: POCRA_DISTRICTS });
POCRA_DISTRICTS_Legend.addItem(new ol.legend.Image({
  title: "Project Districts",
  src: `${POCRA_DISTRICTS.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, POCRA_DISTRICTS),
}));
LEGEND.addItem(POCRA_DISTRICTS_Legend);

// Maharashtra Districts
const MH_DISTRICTS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_districts',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "District's",
});
// New legend associated with a layer MH_DISTRICTS
const MH_DISTRICTS_Legend = new ol.legend.Legend({ layer: MH_DISTRICTS });
MH_DISTRICTS_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_DISTRICTS.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_DISTRICTS_Legend),
}));
LEGEND.addItem(MH_DISTRICTS_Legend);

// Maharashtra Talukas
const MH_TALUKAS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_talukas',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Taluka's",
});
// New legend associated with a layer MH_TALUKAS
const MH_TALUKAS_Legend = new ol.legend.Legend({ layer: MH_TALUKAS });
MH_TALUKAS_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_TALUKAS.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_TALUKAS_Legend),
}));
LEGEND.addItem(MH_TALUKAS_Legend);

// Maharashtra Villages
const MH_VILLAGES = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_villages',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Village's",
});
// New legend associated with a layer MH_VILLAGES
const MH_VILLAGES_Legend = new ol.legend.Legend({ layer: MH_VILLAGES });
MH_VILLAGES_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_VILLAGES.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_VILLAGES_Legend),
}));
LEGEND.addItem(MH_VILLAGES_Legend);

// Maharashtra Rivers Polygon
const MH_RIVERS_POLY = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_rivers_poly',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Major Rivers",
});
// New legend associated with a layer MH_RIVERS_POLY
const MH_RIVERS_POLY_Legend = new ol.legend.Legend({ layer: MH_RIVERS_POLY });
MH_RIVERS_POLY_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_RIVERS_POLY.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_VILLAGES_Legend),
}));
LEGEND.addItem(MH_RIVERS_POLY_Legend);

// Maharashtra Rivers 
const MH_RIVERS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_rivers',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Rivers",
});
// New legend associated with a layer MH_RIVERS
const MH_RIVERS_Legend = new ol.legend.Legend({ layer: MH_RIVERS });
MH_RIVERS_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_RIVERS.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_VILLAGES_Legend),
}));
LEGEND.addItem(MH_RIVERS_Legend);

// Maharashtra Major Roads
const MH_MAJOR_ROADS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_major_roads',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Major Roads",
});
// New legend associated with a layer MH_MAJOR_ROADS
const MH_MAJOR_ROADS_Legend = new ol.legend.Legend({ layer: MH_MAJOR_ROADS });
MH_MAJOR_ROADS_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_MAJOR_ROADS.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_VILLAGES_Legend),
}));
LEGEND.addItem(MH_MAJOR_ROADS_Legend);

// Maharashtra Roads
const MH_ROADS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_other_roads',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Roads",
});
// New legend associated with a layer MH_MAJOR_ROADS
const MH_ROADS_Legend = new ol.legend.Legend({ layer: MH_ROADS });
MH_ROADS_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_ROADS.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_VILLAGES_Legend),
}));
// LEGEND.addItem(MH_ROADS_Legend);

// Maharashtra LULC 1516
const MH_LULC_1516 = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_lulc_1516_raster',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Land Use Land Cover",
});
// New legend associated with a layer MH_LULC_1516
const MH_LULC_1516_Legend = new ol.legend.Legend({ layer: MH_LULC_1516 });
MH_LULC_1516_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_LULC_1516.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_LULC_1516),
}));
LEGEND.addItem(MH_LULC_1516_Legend);

// Maharashtra Settlement 1516
const MH_Settlement_1516 = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_settlement_raster',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Settlements",
});
// New legend associated with a layer MH_Settlement_1516
const MH_Settlement_1516_Legend = new ol.legend.Legend({ layer: MH_Settlement_1516 });
MH_Settlement_1516_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_Settlement_1516.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_Settlement_1516),
}));
LEGEND.addItem(MH_Settlement_1516_Legend);

// Maharashtra Settlement 1516
const MH_Waterbody_1516 = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:mh_waterbodies_raster',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "Waterbody",
});
// New legend associated with a layer MH_Waterbody_1516
const MH_Waterbody_1516_Legend = new ol.legend.Legend({ layer: MH_Waterbody_1516 });
MH_Waterbody_1516_Legend.addItem(new ol.legend.Image({
  title: "",
  src: `${MH_Waterbody_1516.getSource().getLegendUrl()}&legend_options=dpi:120`,
  // src: updateLegend(resolution, MH_Waterbody_1516),
}));
LEGEND.addItem(MH_Waterbody_1516_Legend);


// DBT NRM Community Application
const dbt_nrm_summery_all_dist = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: `${pocra_geoserver}/wms`,
    crossOrigin: 'Anonymous',
    serverType: 'geoserver',
    params: {
      'LAYERS': 'PoCRA_Dashboard_V2:dbt_nrm_summery_all_dist',
      'TILED': true,
    }
  }),
  visible: false,
  baseLayer: false,
  title: "dbt_nrm_summery_all_dist",
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
    73.19, 15.12,
    81.80, 22.77
  ]
});
// Full Screen Control
const fullScreenConst = new ol.control.FullScreen({});
// Print control
const printControlConst = new ol.control.PrintDialog({
  // target: document.querySelector('.info'),
  // targetDialog: Map.getTargetElement() 
  // save: false,
  // copy: false,
  // pdf: false
});
const CanvasTitleConst = new ol.control.CanvasTitle({
  title: '',
  visible: false,
  style: new ol.style.Style({ text: new ol.style.Text({ font: '20px "Lucida Grande",Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif' }) }),
})
// Canvas Attribution Control
const CanvasAttributionConst = new ol.control.CanvasAttribution({ canvas: true });
const geolocationConst = new ol.control.GeolocationButton({
  title: 'Where am I?',
  delay: 10000 // 10s
});
// View of Maharashtra
const center = [77.50, 18.95];
const viewCosnt = new ol.View({
  center: center,
  zoom: 7.2,
  projection:'EPSG:4326'
})

// 
var activitySelect = document.querySelector('.activity'),
  districtSelect = document.querySelector('.district'),
  talukaSelect = document.querySelector('.taluka'),
  villageSelect = document.querySelector('.village')

function loadNRM_Activity() {
  // console.log(activityCode);
  let apiEndPoint = "http://gis.mahapocra.gov.in/weatherservices/meta/getNrmActivities";
  fetch(apiEndPoint)
    .then((response) => response.json())
    .then((data) => {
      var nrmActivities = data.nrm_activity;
      nrmActivities.forEach(activity => {
        const option = document.createElement('option')
        option.value = activity.activity_code;
        option.textContent = activity.activity_name;
        activitySelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error Loading Activities:', error));
};


function getNrmActivityCode() {
  const activityCode = activitySelect.value;
  if (activityCode === '-1') {
    console.log('All Activity');    
  }
  else {
    console.log(activityCode);
  }
}


function loadDistricts() {
  let apiEndPoint = "http://gis.mahapocra.gov.in/weatherservices/meta/districts";
  fetch(apiEndPoint)
    .then((response) => response.json())
    .then((data) => {
      var districts = data.district;
      districts.forEach(district => {
        const option = document.createElement('option')
        option.value = district.dtncode;
        option.textContent = district.dtename;
        districtSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error Loading Districts:', error));

  talukaSelect.disabled = true;
  villageSelect.disabled = true;
  talukaSelect.style.cursor = 'not-allowed';
  villageSelect.style.cursor = 'not-allowed';
};


function loadTalukas() {
  const dtncode = districtSelect.value;
  if (dtncode === '-1') {
    talukaSelect.disabled = true;
    villageSelect.disabled = true;

    talukaSelect.style.cursor = 'not-allowed';
    villageSelect.style.cursor = 'not-allowed';

    talukaSelect.innerHTML = '<option value="-1">-- Select Taluka --</option>' // for clearing the exting talukas
    villageSelect.innerHTML = '<option value="-1">-- Select Village --</option>' // for clearing the exting villages

    alert('All District');
  } else {
    talukaSelect.disabled = false;
    villageSelect.disabled = true;
    talukaSelect.style.cursor = 'pointer';
    villageSelect.style.cursor = 'not-allowed';

    talukaSelect.innerHTML = '<option value="-1">-- All Talukas --</option>' // for clearing the exting talukas
    villageSelect.innerHTML = '<option value="-1">-- Select Village --</option>' // for clearing the exting villages


    let apiEndPoint = `http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=${dtncode}`;

    fetch(apiEndPoint)
      .then((response) => response.json())
      .then((data) => {
        var talukas = data.taluka;
        talukas.forEach(taluka => {
          const option = document.createElement('option')
          option.value = taluka.thncode;
          option.textContent = taluka.thename;
          talukaSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error Loading Talukas:', error));
  }
};

function loadVillages() {
  const thncode = talukaSelect.value;
  if (thncode === '-1') {
    villageSelect.disabled = true;
    villageSelect.style.cursor = 'not-allowed';

    villageSelect.innerHTML = '<option value="-1">-- Select Village --</option>' // for clearing the exting villages
    // alert('All Villages');
  } else {

    villageSelect.disabled = false;
    villageSelect.style.cursor = 'pointer';

    villageSelect.innerHTML = '<option value="-1">-- All Villages --</option>' // for clearing the exting villages

    let apiEndPoint = `http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=${thncode}`;

    fetch(apiEndPoint)
      .then((response) => response.json())
      .then((data) => {
        var villages = data.village;
        villages.forEach(village => {
          const option = document.createElement('option')
          option.value = village.vincode;
          option.textContent = village.vinename;
          villageSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error Loading Villages:', error));
  }
};

function getVillage() {
  const vinCode = villageSelect.value;
  if (vinCode !== '-1') {
    console.log(vinCode);    
  } else {
    console.log('All Villages');
  }
}