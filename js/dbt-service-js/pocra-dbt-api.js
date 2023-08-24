// Set up a Select2 control
$('.multi-select').select2();

//Select2 initialize parameters
$(".multi-select").select2({
  theme: "bootstrap-5",
  width: $(this).data("width")
    ? $(this).data("width")
    : $(this).hasClass("w-100")
      ? "100%"
      : "style",
  placeholder: $(this).data("placeholder"),
  closeOnSelect: false,
  allowClear: true,
});

// Add change event to activity drop-down and log its values.
$("#select-activity").on("change", function (e) {
  // Access to full data
  // console.log($(this).select2('data'));
  // Access to value
  let activityCode = $(this).val();
  console.log(activityCode);
});



// Calling getDistrict funtion initially to load district names into dropdown menu
getDistrict();
// District Name to Drop Down
function getDistrict() {
  var ele = document.getElementById("select-district");
  ele.innerHTML = `<option value='-1'>--Select Alll District--</option>`;
  // Marathi District Name 
  // ele.innerHTML = "<option value='-1'>--जिल्हा निवडा--</option>";
  $.ajax({
    url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts",
    success: function (result) {
      for (var i = 0; i < result.district.length; i++) {
        ele.innerHTML += `<option value= ${result.district[i]["dtncode"]}>${result.district[i]["dtename"]}</option>`;
        // Marathi District Name 
        // ele.innerHTML += `<option value=${result.district[i]["dtncode"]}>${result.district[i]["dtnname"]}</option>`;
      }
    }
  });
}

// Add change event to activity drop-down and log its values.
$("#select-district").on("change", function (e) {
  // Access to full data
  // console.log($(this).select2('data'));
  // Access to value
  let districtCode = $(this).val();
  // console.log(districtCode);
});

// Taluka Name Drop Down
function getTaluka(dtncode) {
  var ele = document.getElementById("select-taluka");
  ele.innerHTML = "<option value='-1'>--Select All Taluka--</option>";
  // Marathi Taluka Name
  // ele.innerHTML = "<option value='-1'>--तालुका निवडा--</option>";
  if (dtncode !== '-1') {
    $.ajax({
      url: `http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=${dtncode}`,
      success: function (result) {
        for (var i = 0; i < result.taluka.length; i++) {
          ele.innerHTML += `<option value=${result.taluka[i]["thncode"]}>${result.taluka[i]["thename"]}</option>`;
          // Marathi Taluka Name
          // ele.innerHTML += `<option value=${result.taluka[i]["thncode"]}>${result.taluka[i]["thnname"]}</option>`;
        }
      }
    });
  }

  // query('Subdivision', 'sdcode', dtncode, 'dtnname');
  //legend();

  // addMapTolayer("District", "dtncode='" + dtncode + "'");
  // addMapTolayer("Taluka", "dtncode='" + dtncode + "'");
}


// Village Name Drop Down
function getVillage(thncode) {
  var ele = document.getElementById("select-village");
  ele.innerHTML = "<option value='-1' disabled selected>--Select Village--</option>";
  // Marathi Village Name
  // ele.innerHTML = "<option value='-1'>--गाव निवडा--</option>";
  if (thncode !== '-1') {
    $.ajax({
      url: `http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=${thncode}`,
      success: function (result) {
        for (var i = 0; i < result.village.length; i++) {
          ele.innerHTML +=
            `<option value=${result.village[i]["vincode"]}>${result.village[i]["vinename"]}</option>`;
          // Marathi Village Name
          // `<option value=${result.village[i]["vincode"]}>${result.village[i]["vinname"]}</option>`;        
        }
      }
    });
  }
  // query('Taluka', 'thncode', thncode, 'thnname');
  //legend();
  // addMapTolayer("Taluka", "thncode='" + thncode + "'");
  // addMapTolayer("Village", "thncode='" + thncode + "'");
  // alert("kh")  
}

function getNrmActivity(activityCode) {
  var result = [];
  // console.log(activityCode);
}

function getVincode(vincode) {
  console.log(vincode);
}