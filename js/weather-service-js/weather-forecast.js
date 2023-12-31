window.addEventListener('DOMContentLoaded', event => {
  loadForecastMap()

  function loadForecastMap() {

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
      openInLayerSwitcher: false,
      layers: [POCRA_DISTRICTS
      ]
    });
    // Setting layer visibility
    POCRA_DISTRICTS.setVisible(false);

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
      target: 'pocra-weather-forecast-map',
      layers: [baseMapGroup, projectRegionLayerGroup],
      // overlays: [popup],
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true,
      // change of expression in V7
      controls: ol.control.defaults.defaults({
      })
        // Adding new external controls on map
        .extend(mapControls),
    });

    view.animate({ center: [77, 18.95] }, { zoom: 7.25 });

    // Weather Forecast Layer
    const forecastLayer = new ol.layer.Tile({
      // extent: extentforLayer,    
      // type: type,
      source: new ol.source.TileWMS({
        url: `${pocra_geoserver}/wms`,
        crossOrigin: 'Anonymous',
        serverType: 'geoserver',
        params: {
          'LAYERS': `PoCRA_Dashboard_V2:imd_forecast_mh`,
          'TILED': true,
          'STYLES': `forecast_rainfall`
        }
      }),
      visible: true,
      baseLayer: false,
      title: `Rainfall`,
    })

    // Weather forecast layer group
    const forecastLayerGroup = new ol.layer.Group({
      title: 'Weather Layers',
      openInLayerSwitcher: true,
      layers: [forecastLayer]
    });
    Map.getLayers().extend([forecastLayerGroup]);


    // console.log(forecastLayer.getSource().getParams())

    // defining global variable for Radio Button
    var forecastDayValueChecked = 'day1', forecastParamValueChecked = 'forecast_rainfall', title = 'Rainfall'
    // if option is seleceted / change    
    $('input[name="weather-forecast"]').change(() => {
      forecastParamValueChecked = $('input[name="weather-forecast"]:checked').val();
      title = $(`#${forecastParamValueChecked}`).next("span").text();

      // Calling Function if value change on radio button
      updateForecastarams(fnTitle = title, fnForecastParamValue = forecastParamValueChecked);
    });

    // Logic for checking Day parameter change
    $('input[name="weather-forecast-day"]').change(() => {
      const $forecastDayRadioChecked = $('input[name="weather-forecast-day"]:checked').val();
      console.log($forecastDayRadioChecked);
    });

    // Function to load layer on change event
    function updateForecastarams(fnForecastDay = undefined, fnForecastParamValue, fnTitle) {
      console.log(fnForecastParamValue)

      Map.getView().setZoom(6.8);
      forecastLayer.set('title', `${fnTitle}`)
      forecastLayer.getSource().updateParams({ 'STYLES': `${fnForecastParamValue}` });
      // View animation
      view.animate({ center: [77, 18.95] }, { zoom: 7.2 });
    }


    // console.log(forecastLayer.getSource().getFeatureInfoUrl());
    var viewProjection = view.getProjection();
    var viewResolution = view.getResolution(); 3
    var container = document.getElementById('information');



    Map.on('singleclick', function (evt) {
      document.getElementById('info').innerHTML = '';
      const url = forecastLayer.getSource().getFeatureInfoUrl(
        evt.coordinate, viewResolution, viewProjection,
        { 'INFO_FORMAT': 'application/json' }
      );
      if (url) {
        fetch(url)
          .then((response) => response.text())
          .then((html) => {
            document.getElementById('info').innerHTML = html;
          });
      }
    });

    Map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      const data = forecastLayer.getData(evt.pixel);
      const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
      Map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });


    // Hide table and graph div default 
    const $forecastInfoDiv = $("#forecast-info-div");
    $forecastInfoDiv.hide();
    // Close icon logic
    $('.close-icon').on('click', () => {
      $forecastInfoDiv.hide('slow', () => { $forecastInfoDiv.hide(); });
    });

    {/* <a href="#forecat-info-div"></a> */ }
    // To bind event on Map click
    Map.on('doubleclick', (evt) => {
      // Checking if feature is present then get information of it
      let isFeatureAtPixel = Map.hasFeatureAtPixel(evt.pixel);
      // const viewResolution = (view.getResolution());

      // const url = wmsSource.getFeatureInfoUrl(
      //   evt.coordinate,
      //   viewResolution,
      //   { 'INFO_FORMAT': 'application/json' }
      // );
      // if (url) {
      //   fetch(url)
      //     .then((response) => console.log(response.text()))
      //     .then((html) => {
      //       document.getElementById('info').innerHTML = html;
      //     });
      // }

      if (isFeatureAtPixel) {
        Map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
          // Accessing feature properties
          // console.log(feature);
          const featureTalukaName = feature.get('thname');
          const start_date = '{testDate}';
          const end_date = '{testDate}';
          // Passing values to function
          getTableInfo(featureTalukaName, start_date, end_date);
        })
      }
      // No feature is present on map click then go to Home Navigation.
      else {
        console.log("No Feature at Pixel");
        $forecastInfoDiv.hide('slow', () => { $forecastInfoDiv.hide(); });
      }
    });

    // Feature :hover logic
    const popoverTextElement = $('#popover-text').get(0)  //document.getElementById('popover-text');  
    const popoverTextLayer = new ol.Overlay({
      element: popoverTextElement,
      positioning: 'bottom-center',
      stopEvent: false
    });

    Map.addOverlay(popoverTextLayer);

    // Changing cursor style & adding taluka name on pointer move
    Map.on('pointermove', (evt) => {
      let isFeatureAtPixel = Map.hasFeatureAtPixel(evt.pixel);

      if (isFeatureAtPixel) {
        let featureAtPixel = Map.getFeaturesAtPixel(evt.pixel);
        let featureName = featureAtPixel[0].get('thname');
        popoverTextLayer.setPosition(evt.coordinate);
        popoverTextElement.innerHTML = featureName;
      } else {
        popoverTextLayer.setPosition(undefined);

      };

      // Changing cursor style for feature to 'pointer'
      let viewPortStyle = Map.getViewport().style
      isFeatureAtPixel ? viewPortStyle.cursor = 'pointer' : viewPortStyle.cursor = ''

    });

    function getTableInfo(featureTalukaName, start_date, end_date) {
      $forecastInfoDiv.show();

      // 5 days forecast chart 
      const data = {
        'Date': ['11Oct2023', '12Oct2023', '13Oct2023', '14Oct2023', '15Oct2023'],
        'TempMax': [17.5, 16.9, 19.5, 25.5, 28.2],
        'TempMin': [7.0, 6.9, 9.5, 14.5, 18.2],
        'Rainfall': [49.9, 71.5, 106.4, 129.2, 144.0]
      };
      // Chart
      Highcharts.chart('container_forecast', {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: `Weather Forecast of ${featureTalukaName}`,
          align: 'left'
        },
        subtitle: {
          text: `For Date: ${start_date} to ${end_date}`,
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

      // 5 days forecast table
      const forecastTabBody =
        `
      <h4 class="card-title">
        Weather Forecast of ${featureTalukaName}
      </h4>
      <p class="card-description">
        For Date: ${start_date} to ${end_date}
      </p>
      `;

      const forecastTable =
        $('#forecast-table')
          .html(forecastTabBody)
          .append(
            `
            <div class="table-responsive">
              <table id="forecast-data-table" class="table table-striped align-middle">
                <tbody>
                  <tr class="td-days">
                    <th scope="row" class="header-left">
                      <span class="legend-left">Day & Date</span>
                      <span class="legend-right">
                        <i class="fa-regular fa-calendar-days"></i>
                      </span>
                    </th>
                    <td class="sticky-title-wrapper" data-day="2023-10-11">
                      <div class="sticky-title" data-daydiv="2023-10-11">
                        Wednesday 11
                      </div>
                    </td>
                    <td class="sticky-title-wrapper" data-day="2023-10-12">
                      <div class="sticky-title" data-daydiv="2023-10-12">
                        Thursday 12
                      </div>
                    </td>
                    <td class="sticky-title-wrapper" data-day="2023-10-13">
                      <div class="sticky-title" data-daydiv="2023-10-13">Friday 13</div>
                    </td>
                    <td class="sticky-title-wrapper" data-day="2023-10-14">
                      <div class="sticky-title" data-daydiv="2023-10-14">
                        Saturday 14
                      </div>
                    </td>
                    <td class="sticky-title-wrapper" data-day="2023-10-15">
                      <div class="sticky-title" data-daydiv="2023-10-15">Sunday 15</div>
                    </td>
                  </tr>
                  <tr class="td-icon">
                    <th scope="row" class="header-left"></th>
                    <td>
                      <img
                        src="../../assets/weather_icon/windy_1.png"
                        srcset="../../assets/weather_icon/windy_1.png 2x"
                      />
                    </td>
                    <td>
                      <img
                        src="../../assets/weather_icon/windy_2.png"
                        srcset="../../assets/weather_icon/windy_2.png 2x"
                      />
                    </td>
                    <td>
                      <img
                        src="../../assets/weather_icon/windy_3.png"
                        srcset="../../assets/weather_icon/windy_3.png 2x"
                      />
                    </td>
                    <td>
                      <img
                        src="../../assets/weather_icon/windy_1.png"
                        srcset="../../assets/weather_icon/windy_1.png 2x"
                      />
                    </td>
                    <td>
                      <img
                        src="../../assets/weather_icon/windy_2.png"
                        srcset="../../assets/weather_icon/windy_2.png 2x"
                      />
                    </td>
                  </tr>
                  <tr class="td-rain">
                    <th scope="row" class="header-left">
                      <span class="legend-left">Rainfall</span
                      ><span class="legend-right metric-clickable">
                        (mm) <i class="fa-solid fa-cloud-rain"></i
                      ></span>
                    </th>
                    <td class="day-end">1</td>
                    <td class="day-end">2</td>
                    <td class="day-end">3</td>
                    <td class="day-end">4</td>
                    <td class="day-end">5</td>
                  </tr>
                  <tr class="td-tempMax">
                    <th scope="row" class="header-left">
                      <span class="legend-left">Temp. Max</span
                      ><span class="legend-right metric-clickable">
                        (°C) <i class="fa-solid fa-temperature-high"></i
                      ></span>
                    </th>
                    <td class="day-end">22°</td>
                    <td class="day-end">22°</td>
                    <td class="day-end">20°</td>
                    <td class="day-end">21°</td>
                    <td class="day-end">21°</td>
                  </tr>
                  <tr class="td-tempMin">
                    <th scope="row" class="header-left">
                      <span class="legend-left">Temp. Min</span
                      ><span class="legend-right metric-clickable">
                        (°C) <i class="fa-solid fa-temperature-high"></i
                      ></span>
                    </th>
                    <td>4</td>
                    <td>2</td>
                    <td>2</td>
                    <td>3</td>
                    <td>0</td>
                  </tr>

                  <tr class="td-windSpeed">
                    <th scope="row" class="header-left">
                      <span class="legend-left">Wind</span
                      ><span class="legend-right">
                        (m/s) <i class="fa-solid fa-wind"></i
                      ></span>
                    </th>
                    <td
                      style="
                        background: linear-gradient(
                          to right,
                          rgb(0, 211, 224),
                          rgb(0, 224, 172),
                          rgb(23, 205, 254)
                        );
                      "
                    >
                      9
                    </td>

                    <td
                      style="
                        background: linear-gradient(
                          to right,
                          rgb(0, 211, 224),
                          rgb(0, 224, 172),
                          rgb(23, 205, 254)
                        );
                      "
                    >
                      8
                    </td>
                    <td
                      style="
                        background: linear-gradient(
                          to right,
                          rgb(0, 211, 224),
                          rgb(0, 224, 172),
                          rgb(23, 205, 254)
                        );
                      "
                    >
                      5
                    </td>
                    <td
                      style="
                        background: linear-gradient(
                          to right,
                          rgb(0, 211, 224),
                          rgb(0, 224, 172),
                          rgb(23, 205, 254)
                        );
                      "
                    >
                      7
                    </td>
                    <td
                      style="
                        background: linear-gradient(
                          to right,
                          rgb(0, 211, 224),
                          rgb(0, 224, 172),
                          rgb(23, 205, 254)
                        );
                      "
                    >
                      7
                    </td>
                  </tr>
                  <tr class="td-windDir">
                    <th scope="row" class="header-left">
                      <span class="legend-left">Wind Dir.</span
                      ><span class="legend-right">
                        <i class="fa-solid fa-flag"></i
                      ></span>
                    </th>
                    <!-- Data -->
                    <td>
                      <div class="">
                        <i
                          class="fa-solid fa-right-long"
                          data-fa-transform="rotate--50"
                        ></i>
                      </div>
                    </td>
                    <td>
                      <div
                        style="transform: rotate(2deg); -webkit-transform: rotate(2deg)"
                      >
                        4
                      </div>
                    </td>
                    <td>
                      <div
                        style="transform: rotate(1deg); -webkit-transform: rotate(1deg)"
                      >
                        4
                      </div>
                    </td>
                    <td>
                      <div
                        style="transform: rotate(1deg); -webkit-transform: rotate(1deg)"
                      >
                        4
                      </div>
                    </td>
                    <td>
                      <div
                        style="transform: rotate(1deg); -webkit-transform: rotate(1deg)"
                      >
                        4
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          `
          );
    };


    // time = 0;
    // for (var i = 0; i < 5; i++) {
    //   time += 5000;
    //   setTimeout(function (j) {
    //     return function () {
    //       console.log("var is now", j);
    //     }
    //   }(i), time);
    // }



    // End loadForecastMap()
  }
  // End of init
});



