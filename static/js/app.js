let price=[];
let avePrice=[];
// Keep Track of all filters
var priceFilters = {"Year":"2017","City":"Irvine"};
console.log(priceFilters);
var map;
var map2;

//========================================
function plots(data){
  //console.log("Filtered data:");  
  //console.log(data);

}

//========================================
function plotHigh10(data){
  console.log("Filtered data2:");  
  console.log(data);
  if(map2 != null){
    map2.remove();
  }

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


  //Overlays
  //layerGroup is an empty list or container we can add things to like markers
  var cities = L.layerGroup();
  var happiest=data["happiest"]
  var highest10=data["highest10"]
  var lowest10=data["lowest10"]
  console.log(happiest)

  happiest.forEach( row =>{
    var m = L.marker([row.Lat,row.Lon]).bindPopup(
      `<h3> happiest10</h3> <hr> 
      <h3> City: ${row.City}</h3> <hr> 
      <h4> $ monthly rent: ${row.AvePriceTotal} </h4>
      <h4> $ per sqft: ${row.AvePricePersq} </h4>`);
    cities.addLayer(m);
  })

  highest10.forEach( row =>{
    var m = L.circleMarker([row.Lat,row.Lon], {pixel: 20 , color : "green"}).bindPopup(
      `<h3> highest10 </h3> <hr> 
      <h3> City: ${row.City}</h3> <hr> 
      <h4> $ monthly rent: ${row.AvePriceTotal} </h4>
      <h4> $ per sqft: ${row.AvePricePersq} </h4>`);
    cities.addLayer(m);
  })

  lowest10.forEach( row =>{
    var m = L.circleMarker([row.Lat,row.Lon], {pixel: 10 ,color : "red"}).bindPopup(
      `<h3> lowest10 </h3> <hr> 
      <h3> City: ${row.City}</h3> <hr> 
      <h4> $ monthly rent: ${row.AvePriceTotal} </h4>
      <h4> $ per sqft: ${row.AvePricePersq} </h4>`);
    cities.addLayer(m);
  })

  //can also create layers in list or array
  var arr = [L.marker([40, -80]), L.circleMarker([36, -80], {pixel: 20, color : "red"})]
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
  map2 = L.map('map-happinessvsrent',
      {'layers': [street, cities, cities2]}).setView([37.8, -96], 4);

  L.control.layers(backgroundLayers, overlayLayers).addTo(map2);

  //Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');

      div.innerHTML = `<p><i style="background:darkred"></i>Legend 1</p>
                      <p><i style="background:red"></i>Legend 2</p>`;
          
      // loop through our density intervals and generate a label with a colored square for each interval
      

      return div;
  };

  legend.addTo(map2);

  var trace1={x: highest10.map(r => r["City"]),
              y: highest10.map(r => r["AvePriceTotal"]),
              type: "bar",
              text: highest10.map(r => r["State"]),
              textposition: 'bottom',
              name: "highest"
            };

  var trace2={x: lowest10.map(r => r["City"]),
              y: lowest10.map(r => r["AvePriceTotal"]),
            type: "bar",
            name: "lowest"
          };          
  var data_list=[trace1,trace2];  
  
  var layout = {
    title: "'Bar' Chart"
  };
  Plotly.newPlot("plot1",data_list,layout)


}


//========================================
function plotHigh20(data){
    if(map != null){
      map.remove();
    }

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


  //Overlays
  //layerGroup is an empty list or container we can add things to like markers
  var cities = L.layerGroup();

  data.forEach( row =>{
    var m = L.marker([row.Lat,row.Lon]).bindPopup(
      `<h3> City: ${row.City}</h3> <hr> 
      <h4> $ monthly rent: ${row.AvePriceTotal} </h4>
      <h4> $ per sqft: ${row.AvePricePersq} </h4>`);
    cities.addLayer(m);
  })



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
  map = L.map('map_high20',
      {'layers': [street, cities, cities2]}).setView([37.8, -96], 4);

  L.control.layers(backgroundLayers, overlayLayers).addTo(map);

  //Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');

      div.innerHTML = `<p><i style="background:darkred"></i>Legend 1</p>
                      <p><i style="background:red"></i>Legend 2</p>`;
          
      // loop through our density intervals and generate a label with a colored square for each interval
      

      return div;
  };

  legend.addTo(map);

}


//========================================
  function updatePriceFilters() {
    //console.log("running updatePriceFilter");
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
  
    //console.log(priceFilters);
    }

//========================================
// Attach an event to listen for changes to each filter
d3.selectAll(".price-filter").on("change", updatePriceFilters);
d3.selectAll(".btn-filter").on("click",getData);

//========================================
function getData() {
  //console.log("running getData")
  
  //console.log(filteredData);
  d3.json('/monthlyrent', {method: 'POST', body: JSON.stringify(priceFilters)})
  .then(data => plots(data));
  
  d3.json('/yearlyrent', {method: 'POST', body: JSON.stringify(priceFilters)})
  .then(data => plotHigh20(data));

  d3.json('/happinessvsrent', {method: 'POST', body: JSON.stringify(priceFilters)})
  .then(data => plotHigh10(data));

  
}

getData();
