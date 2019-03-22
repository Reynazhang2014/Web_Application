let price=[];
let avePrice=[];
// Keep Track of all filters
var priceFilters = {"Year":"2014","State":"CA","maxRent":3000,"minRent":1000};
console.log(priceFilters);
var map;
var map2;
var filterMap;
var myicon = L.icon({'iconUrl': 'http://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png'});

  var pirate = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      //can Also set id to mapbox.dark
      id: 'mapbox.streets',
      accessToken: API_KEY
  });
  
  filterMap = L.map('map-area',
      {'layers': [pirate]}).setView([37.8, -96], 4);
var cities = L.markerClusterGroup();
  filterMap.addLayer(cities);
//========================================
function plots(data){
  
  cities.clearLayers();
  
  
  
  data.forEach( row =>{
    if(row.Lat && row.Lon){
      cities.addLayer(L.marker([row.Lat,row.Lon],{icon:myicon}).bindPopup(
        `<h4> City: ${row.City}</h4> <hr> 
        <h5> $ monthly rent: ${row.AvePriceTotal.toFixed(2)} </h5>
        <h5> $ per sqft: ${row.AvePricePersq.toFixed(2)} </h5>
        <h5> Population: ${row.Population} </h5>`
        ));
      }
  });

}

//========================================



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
    };
  
    //console.log(priceFilters);
    };


//========================================  
function createTable(data){
  console.log(data);
}
//========================================


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

  d3.json('/monthlyrent', {method: 'POST', body: JSON.stringify(priceFilters)})
  .then(data => createTable(data));

  // d3.json('/happinessvsrent', {method: 'POST', body: JSON.stringify(priceFilters)})
  // .then(data => plotHigh10(data));

  
}

getData();
