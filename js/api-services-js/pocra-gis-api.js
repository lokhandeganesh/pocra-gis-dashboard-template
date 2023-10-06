
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