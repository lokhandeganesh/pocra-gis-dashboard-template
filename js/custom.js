var district, geojson, geojson1, geojsonm, geojson1m;
getDistrict();
// getDistrictm();
// Attribution Control

var extentforLayer;

// Popup overlay
var popup = new ol.Overlay.Popup({
    popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
    closeBox: true,
    onshow: function () { console.log("You opened the box"); },
    onclose: function () { console.log("You close the box"); },
    positioning: 'top-center',
    autoPan: true,
    autoPanAnimation: { duration: 250 }
});

// English District Name 
function getDistrict() {
    var ele = document.getElementById("district");
    ele.innerHTML = `<option value='-1'>--Select District--</option>`;
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts",
        success: function (result) {
            for (var i = 0; i < result.district.length; i++) {
                ele.innerHTML = `${ele.innerHTML}<option value=${result.district[i]["dtncode"]}>${result.district[i]["dtename"]}</option>`;
            }
        }
    });

}

// Marathi District Name
function getDistrictm() {
    var ele = document.getElementById("districtm");
    ele.innerHTML = "<option value='-1'>--जिल्हा निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts",
        success: function (result) {
            for (var i = 0; i < result.district.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.district[i]["dtncode"] + '">' + result.district[i]["dtnname"].charAt(0).toUpperCase() + result.district[i]["dtnname"].slice(1).toLowerCase() + '</option>';
            }

        }
    });
}

function addMapTolayer(lName, cqlparam) {
    // alert(cqlparam)
    //legend();
    var district = new ol.layer.Tile({
        title: lName,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true,
                "CQL_FILTER": cqlparam
            }
        }),

    });
    map.addLayer(district)
}

function addMapTolayer2(lName) {
    var district = new ol.layer.Tile({
        title: lName,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true
            }
        })
    });
    map.addLayer(district);
}

function addMapTolayer1(lName, type) {
    var district = document.getElementById("district").value;
    var subdivision = document.getElementById("division").value;
    var taluka = document.getElementById("taluka").value;
    var village = document.getElementById("village").value;
    var layer = new ol.layer.Tile({
        extent: extentforLayer,
        title: lName,
        type: type,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true
            }
        })

    });
    if (district !== "-1" && subdivision === "-1" && taluka === "-1" && village === "-1") {
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "District", "dtncode", district);
    } else if (district !== "-1" && subdivision !== "-1" && taluka === "-1" && village === "-1") {
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Subdivision", "sdcode", subdivision);
    } else if (district !== "-1" && subdivision !== "-1" && taluka !== "-1" && village === "-1") {
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Taluka", "thncode", taluka);
    } else if (district !== "-1" && subdivision !== "-1" && taluka !== "-1" && village !== "-1") {
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Village", "vincode", village);
    }



}

// English Sub-Dovision Name
function getSubdivision(dtncode) {
    var ele = document.getElementById("division");
    ele.innerHTML = "<option value='-1'>--Select Subdivision--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/subdivision?dtncode=" + dtncode,
        success: function (result) {
            console.log(result)
            for (var i = 0; i < result.taluka.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.taluka[i]["sdcode"] + '">' + result.taluka[i]["sdname"] + '</option>';
            }

        }
    });
}

// English Taluka Name
function getTaluka(dtncode) {
    var ele = document.getElementById("taluka");
    ele.innerHTML = "<option value='-1'>--Select Taluka--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=" + dtncode,
        success: function (result) {
            for (var i = 0; i < result.taluka.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.taluka[i]["thncode"] + '">' + result.taluka[i]["thnname"] + '</option>';
            }
        }
    });

    // query('Subdivision', 'sdcode', dtncode, 'dtnname');
    //legend();

    // addMapTolayer("District", "dtncode='" + dtncode + "'");
    // addMapTolayer("Taluka", "dtncode='" + dtncode + "'");
}

// Marathi Taluka Name
function getTalukam(dtncode) {
    var ele = document.getElementById("talukam");
    ele.innerHTML = "<option value='-1'>--तालुका निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=" + dtncode,
        success: function (result) {
            for (var i = 0; i < result.taluka.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.taluka[i]["thncode"] + '">' + result.taluka[i]["thnname"] + '</option>';
            }

        }
    });
}

// English Village Name
function getVillage(thncode) {
    var ele = document.getElementById("village");
    ele.innerHTML = "<option value='-1'>--Select Village--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=" + thncode,
        success: function (result) {
            for (var i = 0; i < result.village.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.village[i]["vincode"] + '">' + result.village[i]["vinname"] + '</option>';
            }

        }
    });
    // query('Taluka', 'thncode', thncode, 'thnname');
    //legend();
    // addMapTolayer("Taluka", "thncode='" + thncode + "'");
    // addMapTolayer("Village", "thncode='" + thncode + "'");
    // alert("kh")

}

// Marathi Village Name
function getVillagem(thncode) {
    var ele = document.getElementById("villagem");
    ele.innerHTML = "<option value='-1'>--गाव निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=" + thncode,
        success: function (result) {
            for (var i = 0; i < result.village.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.village[i]["vincode"] + '">' + result.village[i]["vinname"] + '</option>';
            }

        }
    });
    // query('Taluka', 'thncode', thncode, 'thnname');
    //legend();
    // addMapTolayer("Taluka", "thncode='" + thncode + "'");
    // addMapTolayer("Village", "thncode='" + thncode + "'");
    // alert("kh")

}

function getVillageData(vincode) {

    // query('Village', 'vincode', vincode, 'vil_name');
    // addMapTolayer("Village", "vincode='" + vincode + "'");
    //legend();
    // alert("kh")
}

function wms_layers() {
    if (document.getElementById("district").value === "-1") {
        alert("Select District from panel")
    } else {
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }
    }
    // getDisdrict();
}



// 
var districtLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#ee7300'
        }),
        stroke: new ol.style.Stroke({
            color: '#232323',
            width: 3
        })
    })
});

// ================ District Style =====================
var districtLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var districtBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#232323',
        width: 3,
        // linejoin:'bevel',
        lineDash: [4, 8],
        lineDashOffset: 6
    })
});


var districtBoundaryStyle1 = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#ee7300',
        width: 3,
        // linejoin:'bevel',
        lineDash: [4, 8]
    })
});
var districtStyle = [districtBoundaryStyle, districtBoundaryStyle1, districtLabelStyle];

var subdivisionLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#001'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});

var subdivisionBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#00000',
        width: 2,
        // linejoin:'bevel',
        // lineDash: [4,8],
        // lineDashOffset: 6
    })
});

var subdivisionStyle = [subdivisionBoundaryStyle, subdivisionLabelStyle];
// ===============================================

// ================ Taluka Style =====================
var talukaLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var talukaBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#232323',
        width: 1.5,
        // linejoin:'bevel',
        lineDash: [4, 8],
        lineDashOffset: 6
    })
});
var talukaBoundaryStyle1 = new ol.style.Style({

    stroke: new ol.style.Stroke({
        color: '#ee7300',
        width: 1.5,
        lineDash: [4, 8]
    })
});
var talukaStyle = [talukaBoundaryStyle, talukaBoundaryStyle1, talukaLabelStyle];
// ===============================================

// ================ Taluka Style =====================
var villageLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var villageBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#ffff',
        width: 1

    })
});

var villageStyle = [villageBoundaryStyle, villageLabelStyle];
// ===============================================



function query(layerName, paramName, paramValue, labelname) {
    map.getLayers().forEach(function (layer, i) {
        if (map.getLayers().item(i).get('title') === "State") {
            map.removeLayer(layer);
        }
    });

    // map.removeLayer(geojson);
    if (geojson) {
        map.removeLayer(geojson);
    }
    if (geojson1) {
        map.removeLayer(geojson1);
    }

    if (layerName === "District") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({

            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                districtLabelStyle.setGeometry(geometry);
                districtLabelStyle.getText().setText(feature.get('dtnname'));
                districtLabelStyle.getText().setTextAlign(textAlign);
                return districtStyle;
            },
        });
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Subdivision&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: "Subdivision",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }

                subdivisionLabelStyle.setGeometry(geometry);
                subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                subdivisionLabelStyle.getText().setTextAlign(textAlign);
                return subdivisionStyle;
            },
        });
        geojson.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });

        geojson1.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);

    } else if (layerName === "Subdivision") {

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                extentforLayer = extent;
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                subdivisionLabelStyle.setGeometry(geometry);
                subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                subdivisionLabelStyle.getText().setTextAlign(textAlign);
                return subdivisionStyle;
            },
        });

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var extent = feature.getGeometry().getExtent();
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                // var mask = new ol.filter.Mask({ feature: feature, inner:false, fill: new ol.style.Fill({ color:[255,255,255,0.8] }) });
                // topo.addFilter(mask);

                talukaLabelStyle.setGeometry(geometry);
                talukaLabelStyle.getText().setText(feature.get('thnname'));
                talukaLabelStyle.getText().setTextAlign(textAlign);
                return talukaStyle;
            },
        });
        geojson.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });

        geojson1.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);

    } else if (layerName === "Taluka") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var extent = feature.getGeometry().getExtent();
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);

                extentforLayer = extent;
                talukaLabelStyle.setGeometry(geometry);
                talukaLabelStyle.getText().setText(feature.get('thnname'));
                talukaLabelStyle.getText().setTextAlign(textAlign);
                return talukaStyle;
            },
        });
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: "Village",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }

                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilmname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });
        geojson.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });


        geojson1.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);
    } else if (layerName === "Village") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                extentforLayer = extent;
                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilmname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });

        geojson.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson);
    }
}

function querym(layerName, paramName, paramValue, labelname) {
    map.getLayers().forEach(function (layer, i) {
        if (mapm.getLayers().item(i).get('title') === "State") {
            mapm.removeLayer(layer);
        }
    });

    // mapm.removeLayer(geojson);
    if (geojsonm) {
        mapm.removeLayer(geojsonm);
    } else if (layerName === "Village") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojsonm = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = mapm.getSize();
                var extent = mapm.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                extentforLayer = extent;
                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilmname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });

        geojsonm.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            mapm.getView().fit(
                geojsonm.getSource().getExtent(), { duration: 1590, size: mapm.getSize() - 100 }
            );
        });
        mapm.addLayer(geojsonm);
    }
}
var layers_names = [];

function legendtest() {
    $('#legend').empty();
    var no_layers = map.getLayers().get('length');
    // var head = document.createElement("h4");

    // var txt = document.createTextNode("Legend");

    // head.appendChild(txt);
    // var element = document.getElementById("legend");
    // element.appendChild(head);
    // var ar = [];

    // var i;
    // var zone;
    // var values = [];
    // var testVals = {}
    var div = document.getElementById("legend");

    div.innerHTML = ""; // clear images
    for (i = 0; i < no_layers; i++) {
        console.log(map.getLayers().item(i).get('title'))



        var imagem = document.createElement("img");
        imagem.src = "/legend/" + map.getLayers().item(i).get('title') + ".png";
        div.appendChild(imagem);

        // ar.push("http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title'));
        // layers_names.push(map.getLayers().item(i).get('title'))

        // layers_names.push(map.getLayers().item(i).get('title'))
    }
}

// legend();
var currentValue = "";

function radioChange(rdoValue) {
    if (document.getElementById("district").value === "-1") {
        alert("Select District")
        rdoValue.checked = false;
    } else {

        // alert('Old value: ' + currentValue);
        // alert('New value: ' + rdoValue.value);
        currentValue = rdoValue.value;
        addMapTolayer1(currentValue, "baselayer");
        legend();
    }

}



function croplayer(name, lname, paramName, paramValue) {
    legend();
    if (geojson) {
        map.removeLayer(geojson);
    }

    map.getLayers().forEach(function (layer, i) {
        // if (map.getLayers().item(i).get('title') === lname ) {
        //     map.removeLayer(layer)
        // }
        if (map.getLayers().item(i).get('title') === name) {
            var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + lname + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
            geojson = new ol.layer.Vector({
                title: lname,
                source: new ol.source.Vector({
                    url: url,
                    format: new ol.format.GeoJSON()
                }),
                style: function (feature) {
                    var geometry = feature.getGeometry();
                    if (geometry.getType() == 'MultiPolygon') {
                        // Only render label for the widest polygon of a multipolygon
                        var polygons = geometry.getPolygons();
                        var widest = 0;
                        for (var i = 0, ii = polygons.length; i < ii; ++i) {
                            var polygon = polygons[i];
                            var width = ol.extent.getWidth(polygon.getExtent());
                            if (width > widest) {
                                widest = width;
                                geometry = polygon;
                            }
                        }
                    }
                    // Check if default label position fits in the view and move it inside if necessary
                    geometry = geometry.getInteriorPoint();
                    var size = map.getSize();
                    var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                    var textAlign = 'center';
                    var coordinates = geometry.getCoordinates();
                    if (!geometry.intersectsExtent(extent)) {
                        geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                        // Align text if at either side
                        var x = geometry.getCoordinates()[0];
                        if (x > coordinates[0]) {
                            textAlign = 'left';
                        }
                        if (x < coordinates[0]) {
                            textAlign = 'right';
                        }
                    }
                    var crop = new ol.filter.Crop({ feature: feature, inner: false });
                    layer.addFilter(crop);
                    if (lname === "District") {
                        query('District', paramName, paramValue, 'dtnname');
                        districtLabelStyle.setGeometry(geometry);
                        districtLabelStyle.getText().setText(feature.get('dtnname'));
                        districtLabelStyle.getText().setTextAlign(textAlign);
                        return districtStyle;
                    } else if (lname === "Subdivision") {
                        query('Subdivision', paramName, paramValue, 'thnname');
                        subdivisionLabelStyle.setGeometry(geometry);
                        subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                        subdivisionLabelStyle.getText().setTextAlign(textAlign);
                        return subdivisionStyle;
                    } else if (lname === "Taluka") {
                        query('Taluka', paramName, paramValue, 'thnname');
                        talukaLabelStyle.setGeometry(geometry);
                        talukaLabelStyle.getText().setText(feature.get('thnname'));
                        talukaLabelStyle.getText().setTextAlign(textAlign);
                        return talukaStyle;
                    } else if (lname === "Village") {
                        query('Village', paramName, paramValue, 'vilmname');
                        villageLabelStyle.setGeometry(geometry);
                        villageLabelStyle.getText().setText(feature.get('vilmname'));
                        villageLabelStyle.getText().setTextAlign(textAlign);
                        return villageStyle;
                    }
                    // extentforLayer=extent;

                },
            });

            geojson.getSource().on('addfeature', function () {
                map.getView().fit(
                    geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
                );
            });
            map.addLayer(geojson);
        }
    });

}


function clearlayer() {
    location.reload();
}

function legend() {

    var myTableDiv = document.getElementById("mydata");
    myTableDiv.innerHTML = "";
    var table = document.createElement('TABLE');
    table.border = '1';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    for (var i = 1; i < map.getLayers().get('length'); i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 1; j++) {
            var td = document.createElement('TD');
            td.width = '75';
            // td.appendChild(document.createTextNode("Cell " + i + "," + j));
            // tr.appendChild(td);
            var img = '<img src="./legend/' + map.getLayers().item(i).get('title') + '.png" ><br>'
            var row = table.insertRow(i);
            row.insertCell(0).innerHTML = img;
        }
    }
    myTableDiv.appendChild(table);

}

function addRow() {
    // var myName = document.getElementById("name");
    // var age = document.getElementById("age");
    var table = document.getElementById("myTableData");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    // alert(rowCount)

    // row.insertCell(0).innerHTML = '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
    // var img = '<img src="./legend/District.png" >';
    for (var i = 1; i < map.getLayers().get('length'); i++) {
        var img = '<img src="http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + map.getLayers().item(i).get('title') + '" >'
        // alert(img)
        row.insertCell(0).innerHTML = img;
        // imagesListData["imag" + i] = "http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title');
    }

    // row.insertCell(2).innerHTML = age.value;

}

function opendiv(divid) {
    document.getElementById(divid).style.display = "block";
}

function closediv(divid) {
    document.getElementById(divid).style.display = "none";
}


map.on('singleclick', function (evt) {
    closediv('mydiva');
    // document.getElementById('info').innerHTML = '';
    var sel = document.getElementById("district");
    var text = sel.options[sel.selectedIndex].text;

    var layerName = document.getElementById("district").value;
    var viewResolution = /** @type {number} */ (view.getResolution());
    map.getLayers().forEach(function (layer, i) {
        if (map.getLayers().item(i).get('title') === layerName) {

            var url = layer.getSource().getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
            );
            // console.log(url)
            if (url) {
                fetch(url)
                    .then(function (response) {
                        // console.log(response.text());
                        return response.text();
                    })
                    .then(function (html) {
                        var jsondata = JSON.parse(html);

                        loadshcDetails1(jsondata.features[0].properties.pin1)
                        //   document.getElementById('info').innerHTML = html;
                    });
            }
        }
    });
});
mapm.on('singleclick', function (evt) {
    closediv('mydiva');
    // document.getElementById('info').innerHTML = '';
    var sel = document.getElementById("districtm");
    var text = sel.options[sel.selectedIndex].text;

    var layerName = document.getElementById("districtm").value;
    var viewResolution = /** @type {number} */ (view.getResolution());
    mapm.getLayers().forEach(function (layer, i) {
        if (mapm.getLayers().item(i).get('title') === layerName) {

            var url = layer.getSource().getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
            );
            // console.log(url)
            if (url) {
                fetch(url)
                    .then(function (response) {
                        // console.log(response.text());
                        return response.text();
                    })
                    .then(function (html) {
                        var jsondata = JSON.parse(html);

                        loadshcDetails1m(jsondata.features[0].properties.pin1)
                        //   document.getElementById('info').innerHTML = html;
                    });
            }
        }
    });
});


var geolocation = new ol.Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
        enableHighAccuracy: true,
    },
    projection: view.getProjection(),
});

function el(id) {
    return document.getElementById(id);
}

el('locbutton').addEventListener('click', function () {
    geolocation.setTracking(true);
});

// update the HTML page when the position changes.
function loaddiv() {
    opendiv("container");
    opendiv("mydiv");
    opendiv("containerm");
    opendiv("mydivmo");
}