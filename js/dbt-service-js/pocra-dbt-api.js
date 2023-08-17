getDistrict();
getTaluka();

// English District Name
function getDistrict() {
  var ele = document.getElementById("select-district");
  ele.innerHTML = `<option value='-1'>--Select District--</option>`;
  $.ajax({
    url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts",
    success: function (result) {
      for (var i = 0; i < result.district.length; i++) {
        ele.innerHTML += `<option value= ${result.district[i]["dtncode"]}>${result.district[i]["dtename"]}</option>`;
      }
    }
  });
}

// Marathi District Name 
function getDistrictm() {
  var ele = document.getElementById("select-districtm");
  ele.innerHTML = "<option value='-1'>--जिल्हा निवडा--</option>";
  $.ajax({
    url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts",
    success: function (result) {
      for (var i = 0; i < result.district.length; i++) {
        ele.innerHTML += `<option value=${result.district[i]["dtncode"]}>${result.district[i]["dtnname"]}</option>`;
      }
    }
  });

}

// English Taluka Name
function getTaluka(dtncode) {
  var ele = document.getElementById("select-taluka");
  ele.innerHTML = "<option value='-1'>--Select Taluka--</option>";
  $.ajax({
    url: `http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=${dtncode}`,
    success: function (result) {
      for (var i = 0; i < result.taluka.length; i++) {
        ele.innerHTML += `<option value=${result.taluka[i]["thncode"]}>${result.taluka[i]["thename"]}</option>`;
      }
    }
  });

  // query('Subdivision', 'sdcode', dtncode, 'dtnname');
  //legend();

  // addMapTolayer("District", "dtncode='" + dtncode + "'");
  // addMapTolayer("Taluka", "dtncode='" + dtncode + "'");
}

// Marathi Taluka Name
function getTalukam(dtncode = 501) {
  var ele = document.getElementById("select-talukam");
  ele.innerHTML = "<option value='-1'>--तालुका निवडा--</option>";
  $.ajax({
    url: `http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=${dtncode}`,
    success: function (result) {
      for (var i = 0; i < result.taluka.length; i++) {
        ele.innerHTML += `<option value=${result.taluka[i]["thncode"]}>${result.taluka[i]["thnname"]}</option>`;
      }
    }
  });
}

// English Village Name
function getVillage(thncode) {
  var ele = document.getElementById("select-village");
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
  var ele = document.getElementById("select-villagem");
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