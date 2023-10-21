window.addEventListener('DOMContentLoaded', event => {


  // 5 days forecast chart 
  const data = {
    'Date': ['11Oct2023', '12Oct2023', '13Oct2023', '14Oct2023', '15Oct2023'],
    'TempMax': [17.5, 16.9, 19.5, 25.5, 28.2],
    'TempMin': [7.0, 6.9, 9.5, 14.5, 18.2],
    'Rainfall': [49.9, 71.5, 106.4, 129.2, 144.0]
  }
  Highcharts.chart('container_forecast', {
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: 'Weather Forecast of {DistrictName}',
      align: 'left'
    },
    subtitle: {
      text: 'For Date:{start_date} to {end_date} ',
      align: 'left'
    },
    xAxis: [{
      categories: data['Date'],
      crosshair: true
    }],
    yAxis: [{ // Primary yAxis
      labels: {
        format: '{value}°C',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      title: {
        text: 'Temperature',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      opposite: true

    }, { // Secondary yAxis
      gridLineWidth: 0,
      title: {
        text: 'Rainfall',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        format: '{value} mm',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      }

    }
    ],
    tooltip: {
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 80,
      verticalAlign: 'top',
      y: 55,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || // theme
        'rgba(255,255,255,0.25)'
    },
    series: [{
      name: 'Rainfall',
      type: 'column',
      yAxis: 1,
      data: data['Rainfall'],
      tooltip: {
        valueSuffix: ' mm'
      }

    }, {
      name: 'Max. Temperature',
      type: 'spline',
      data: data['TempMax'],
      color: Highcharts.getOptions().colors[3],
      tooltip: {
        valueSuffix: ' °C'
      }
    },
    {
      name: 'Min. Temperature',
      type: 'spline',
      data: data['TempMin'],
      color: Highcharts.getOptions().colors[1],
      marker: {
        enabled: false
      },
      dashStyle: 'longdashdot',
      tooltip: {
        valueSuffix: '°C'
      }
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            floating: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0
          },
          yAxis: [{
            labels: {
              align: 'right',
              x: 0,
              y: -6
            },
            showLastLabel: false
          }, {
            labels: {
              align: 'left',
              x: 0,
              y: -6
            },
            showLastLabel: false
          }, {
            visible: false
          }]
        }
      }]
    }
  });

  // The Map

  // Initiating Map 
  // const variables are imported from proca-gis-api.js
  // Adding LayerGroup control to layer switcher
  const baseLayerGroup = baseLayerGroupConst;
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
    scaleLineControl, zoomToExtentControl,fullScreenControl
  ];

  // View for Mh
  const view = viewCosnt
  // Map instance
  const Map = new ol.Map({
    view: view,
    target: 'pocra-weather-forecast-map',
    layers: [baseLayerGroup,],
    // overlays: [popup],
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    // change of expression in V7
    controls: ol.control.defaults.defaults({
    })
      // Adding new external controls on map
      .extend(mapControls),
  });
});
