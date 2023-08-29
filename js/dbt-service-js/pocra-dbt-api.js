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

// Global Variables
var activityCode;
var districtCode;

// Calling loadNrmActivity funtion initially to load activity names into dropdown menu
loadNrmActivity();
// Add change event to activity drop-down and log its values.
function loadNrmActivity() {
  // console.log(activityCode);
  var ele = document.getElementById("select-activity")
  $.ajax({
    url: "http://gis.mahapocra.gov.in/weatherservices/meta/getNrmActivities",
    success: function (result) {
      for (var i = 0; i < result.nrm_activity.length; i++) {
        ele.innerHTML += `<option value= ${result.nrm_activity[i]["activity_code"]}>${result.nrm_activity[i]["activity_name"]}</option>`;
      }
    }
  })
}

// Calling getDistrict funtion initially to load district names into dropdown menu
getDistrict();
// District Name to Drop Down
function getDistrict() {
  var ele = document.getElementById("select-district");
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


function getNrmActivity(getActivityCode) {
  // activityCode = getActivityCode;
  console.log(getActivityCode)

}

getData();
async function getData() {
  const response = await fetch(
    'http://gis.mahapocra.gov.in/weatherservices/meta/getStatActivities');
  // console.log(response);
  const data = await response.json();
  // console.log(data);
  length = data.data.length;
  // console.log(length);
  const chartTitle = 'Natural Resource Management Activities'

  labels = [];
  values = [];
  for (i = 0; i < length; i++) {
    labels.push(data.data[i].structure_type);
    values.push(data.data[i].payment_done);
  }

  new Chart(document.getElementById("bar-chart"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: "Payment Done (Count)",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: values
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: chartTitle,
        color: '#FF0000'
      },
      scales: {
        xAxes: [{
          display: true,
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Count',
          },
          type: 'logarithmic',
          position: 'left',
          ticks: {
            min: 0, //minimum tick
            // max: 1000, //maximum tick
            callback: function (value, index, values) {
              return Number(value.toString());//pass tick values as a string into Number function
            }
          },
          afterBuildTicks: (chartObj) => {
            const ticks = [1, 10, 100, 1000, 10000, 100000, 1000000];
            chartObj.ticks.splice(0, chartObj.ticks.length);
            chartObj.ticks.push(...ticks);
          }

        }]
      }

    }
  });

}



function getVincode(vincode) {
  console.log(vincode);
}