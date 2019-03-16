let price=[];
let avePrice=[];
// Keep Track of all filters
var priceFilters = {"Year":"2017","City":"Irvine"};
console.log(priceFilters);

// function getData(){
//     console.log("reading data")
//     let price_url="/pricepersqft";
//     d3.json(price_url).then((data,error)=> {
//         console.log(error);
//         price=data;
//         console.log(price);
//     })
//     let avePrice_url="/yearlyprice"; 
//     d3.json(avePrice_url).then((data,error) => {
//         //console.log(error);
//         avePrice=data;
//         //console.log(avePrice);
//     })   

 
// };



function plots(data){
    console.log(data);

}
function plotHigh20(data){
    console.log('test');

  //max zoom allowed set to 18 which means 15 additional clicks after 3

  //Backgrounds
  var street = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      //can Also set id to mapbox.dark
      id: 'mapbox.streets',
      accessToken: API_KEY
  });


  var dark = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      //can Also set id to mapbox.dark
      id: 'mapbox.dark',
      accessToken: API_KEY
  });

  //Note for project *Create ForLoop create empty layerGroup 1st then addLayer over and over with ForLoop or foreach


  //Overlays
  //layerGroup is an empty list or container we can add things to like markers
  var cities = L.layerGroup();
  data.forEach( row =>{
    var m = L.marker([row.Lat,row.Lon]).bindPopup(
      `<h3> City: ${row.City}</h3> <hr> 
      <h4> $ per sqft: ${row.AvePricePersq} </h4>`);
    cities.addLayer(m);
  })
  // cities.addLayer(L.marker([33, -117]));
  // cities.addLayer(L.circleMarker([36, -100], {pixel: 10}));
  // cities.addLayer(L.marker([26, -80]));

  //can also create layers in list or array
  var arr = [L.marker([40, -80]), L.circleMarker([36, -80], {pixel: 20})]
  var cities2 = L.layerGroup(arr);

  //Controls
  //Add controls box in top right which will define background vs overlay layers
  var backgroundLayers = {
      'Street View': street,
      'Dark View': dark
  };

  var overlayLayers = {
      'Cities 1': cities,
      'Cities 2': cities2
  };

  //Map
  var mymap = L.map('map',
      {'layers': [street, cities, cities2]}).setView([37.8, -96], 4);

  L.control.layers(backgroundLayers, overlayLayers).addTo(mymap);

  //Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');

      div.innerHTML = `<p><i style="background:darkred"></i><p>Legend 1</p>
                      <p><i style="background:red"></i>Legend 2<p/p>`;
          
      // loop through our density intervals and generate a label with a colored square for each interval
      

      return div;
  };

  legend.addTo(mymap);

}


function getData() {
    console.log("running getData")
    
    //console.log(filteredData);
    d3.json('/pricepersqft', {method: 'POST', body: JSON.stringify(priceFilters)})
    .then(data => plots(data));
    
    d3.json('/yearlyprice', {method: 'POST', body: JSON.stringify(priceFilters)})
    .then(data => plotHigh20(data));

    
  }


  
  function updatePriceFilters() {
    console.log("running updatePriceFilter");
    // Save the element, value, and id of the filter that was changed
    var changedElement = d3.select(this).select("input");
    var elementValue = changedElement.property("value");
    var filterId = changedElement.attr("id");
  
    // If a filter value was entered then add that filterId and value
    // to the filters list. Otherwise, clear that filter from the filters object
    if (elementValue) {
      priceFilters[filterId] = elementValue;
    }
    else {
      delete priceFilters[filterId];
    }
  
    console.log(priceFilters);
    }


// Attach an event to listen for changes to each filter
d3.selectAll(".price-filter").on("change", updatePriceFilters);
d3.selectAll(".btn-filter").on("click",getData);

getData();



//{
//     d3.event.preventDefault();
//     console.log(priceFilters);
//     filterJS(priceFilters);

// });
// from data.js
// allData=[];
// d3.csv("price.csv").then((data,error) => {
//   //var allData = data;
//   console.log(data);
// });


// // get table references
// var tbody = d3.select("tbody");

// function buildTable(data) {
//   // First, clear out any existing data
//   tbody.html("");

//   // Next, loop through each object in the data
//   // and append a row and cells for each value in the row
//   data.forEach((dataRow) => {
//     // Append a row to the table body
//     var row = tbody.append("tr");

//     // Loop through each field in the dataRow and add
//     // each value as a table cell (td)
//     Object.values(dataRow).forEach((val) => {
//       var cell = row.append("td");
//       cell.text(val);
//     });
//   });
// }

// // Keep Track of all filters
// var filters = {};

// function updateFilters() {

//   // Save the element, value, and id of the filter that was changed
//   var changedElement = d3.select(this).select("input");
//   var elementValue = changedElement.property("value");
//   var filterId = changedElement.attr("id");

//   // If a filter value was entered then add that filterId and value
//   // to the filters list. Otherwise, clear that filter from the filters object
//   if (elementValue) {
//     filters[filterId] = elementValue;
//   }
//   else {
//     delete filters[filterId];
//   }

//   // Call function to apply all filters and rebuild the table
//   filterTable();

// }

// function filterTable() {

//   // Set the filteredData to the tableData
//   let filteredData = tableData;

//   // Loop through all of the filters and keep any data that
//   // matches the filter values
//   Object.entries(filters).forEach(([key, value]) => {
//     filteredData = filteredData.filter(row => row[key] === value);
//   });

//   // Finally, rebuild the table using the filtered Data
//   buildTable(filteredData);
// }

// // Attach an event to listen for changes to each filter
// d3.selectAll(".filter").on("change", updateFilters);

// // Build the table when the page loads
// buildTable(tableData);
