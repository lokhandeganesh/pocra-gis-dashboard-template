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
var applicationStatusSelected;

// Get check box value of application status
$('input').on('click', function(){
  applicationStatusSelected = [];
  
  // $('.application-checkbox input:checked').each(function() {
  //      applicationStatusSelected.push($(this).val());
  // });
  
  
  //Or
  
  var checkboxes = document.getElementsByName('applicationStatus');  
    for (var i=0; i<checkboxes.length; i++) {
       if (checkboxes[i].checked) {
        applicationStatusSelected.push(checkboxes[i].value);
       }
    }
  
    alert(applicationStatusSelected);
  });

//   var checkBoxes = document.querySelectorAll(`input[name="applicationStatus"]:checked`);
//   var selected = [];
//  Array.prototype.forEach.call(checkBoxes, function(ele){
//   values.push(ele.value)
//  });
//  console.log(values);
 

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

// getData();
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
  // Bar Chart
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
      // title: {
      //   display: true,
      //   text: chartTitle,
      //   color: '#FF0000'
      // },
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

  // Pie Chart
  new Chart(document.getElementById("pie-chart"), {
    type: 'pie',
    data: {
      labels: labels,

      datasets: [
        {
          label: "Payment Done (Count)",
          backgroundColor: ['rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(82, 215, 38)',
            'rgb(255, 236, 0)',
            'rgb(255, 0, 0)',
            'rgb(124, 120, 215)',
            'rgb(0, 126, 214)',
            'rgb(124, 221, 221)'],

          data: values,
          hoverOffset: 4
        }
      ],

    },
    options: {
      legend: { display: false },
    }

  });
}



function getVincode(vincode) {
  console.log(vincode);
}

getHighChartData();
async function getHighChartData() {
  const response = await fetch(
    'http://gis.mahapocra.gov.in/weatherservices/meta/getStatActivities')
    .then(response => {
      return response.json();
    })
    .then(data => {
      // console.log(data)
      // 
      let activityCode = [], total_no_of_paid = [], activityGroupName = []
      // 
      data.data.map((activity) => {
        activityCode.push(activity.structure_type);
        activityGroupName.push(activity.activity_name);
        total_no_of_paid.push(activity.payment_done);
      })
      // console.log(activityCode)

      Highcharts.chart('highchart-pie-chart', {
        chart: {
          type: 'column',
          backgroundColor: '',
        },
        title: {
          text: 'Natural Resource Management Activities'
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: true
        },
        xAxis: {
          categories: activityGroupName,
        },
        yAxis: {
          type: 'logarithmic',
          // min: 0,
          title: {
            text: 'Count (Num.)'
          }
        },
        tooltip: {
          headerFormat: '<span style="color: red"><b>{point.key}</b></span><table>',
          pointFormat: `<tr>
                          <td>Count: </td>
                          <td><b>{point.y}</b></td>
                        </tr>`,
          footerFormat: '</table>',
          shared: true,
          useHTML: true

        },
        // series: {
        //   pointWidth: 20
        // },    
        series: [{
          name: 'Activities',
          data: total_no_of_paid
        },
          // {
          //   name: 'GB',
          //   data: [total_no_of_paid[1]]
          // },
          // {
          //   name: activityCode[2],
          //   data: [total_no_of_paid[2]]
          // },
          // {
          //   name: activityGroupName[3],
          //   data: [total_no_of_paid[3]]
          // },
          // {
          //   name: activityGroupName[4],
          //   data: [total_no_of_paid[4]]
          // },
          // {
          //   name: activityGroupName[5],
          //   data: [total_no_of_paid[5]]
          // },
          // {
          //   name: activityGroupName[6],
          //   data: [total_no_of_paid[6]]
          // },
          // {
          //   name: activityGroupName[7],
          //   data: [total_no_of_paid[7]]
          // },
          // {
          //   name: activityGroupName[8],
          //   data: [total_no_of_paid[8]]
          // },
        ]
      })

    });




}

function getData() {//  w  w  w  . j av a 2 s.c  o m
  return new Promise((resolve, reject) => {
    $.getJSON('xhttp://gis.mahapocra.gov.in/weatherservices/meta/getStatActivities', function (recData) {
      console.log(recData)
      resolve(recData);
    });
  });
}
(async () => {
  Highcharts.chart('xhighchart-pie-chart', {
    chart: {
      events: {
        load: function () {
          var series = this.series[0];
          setInterval(async function () {
            var data = await getData();
            series.setData(data);
          }, 2000);
        }
      }
    },
    series: [{
      data: await getData()
    }]
  });
});

$('#xhighchart-pie-chart').highcharts({
  chart: {
    type: 'column'
  },
  title: {
    text: 'Stacked bar chart'
  },
  xAxis: {
    categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Total fruit consumption'
    }
  },
  legend: {
    reversed: true
  },
  plotOptions: {
    series: {
      stacking: 'normal'
    }
  },
  series: [{
    name: 'John',
    data: [5, 3, 4, 7, 2]
  }, {
    name: 'Jane',
    data: [2, 2, 3, 2, 1]
  }, {
    name: 'Joe',
    data: [3, 4, 4, 2, 5]
  }]
});