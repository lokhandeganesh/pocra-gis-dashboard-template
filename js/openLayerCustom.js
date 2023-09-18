// get layer info on click event
ol.Feature.prototype.getLayer = function (map) {
  var this_ = this, layer_, layersToLookFor = [];
  /**
   * Populates array layersToLookFor with only
   * layers that have features
   */
  var check = function (layer) {
    var source = layer.getSource();
    if (source instanceof ol.source.Vector) {
      var features = source.getFeatures();
      if (features.length > 0) {
        layersToLookFor.push({
          layer: layer,
          features: features
        });
      }
    }
  };
  //loop through map layers
  map.getLayers().forEach(function (layer) {
    if (layer instanceof ol.layer.Group) {
      layer.getLayers().forEach(check);
    } else {
      check(layer);
    }
  });
  layersToLookFor.forEach(function (obj) {
    var found = obj.features.some(function (feature) {
      return this_ === feature;
    });
    if (found) {
      //this is the layer we want
      layer_ = obj.layer;
    }
  });
  return layer_;
};