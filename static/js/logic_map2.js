function plotHappinessVsRent(data){
  if(map2 != null){
    map2.remove();
  }

//max zoom allowed set to 18 which means 15 additional clicks after 3

  //Backgrounds
  var light = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      //can Also set id to mapbox.dark
      id: 'mapbox.light',
      accessToken: API_KEY
  });


  var dark = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      //can Also set id to mapbox.dark
      id: 'mapbox.dark',
      accessToken: API_KEY
  });

  var baseMaps = {
    'Light': light,
    'Dark View': dark
  };
  //Overlays
  //layerGroup is an empty list or container we can add things to like markers
  
  var icons = {
    high10: L.ExtraMarkers.icon({
      icon: "fa-number",
      iconColor: "white",
      markerColor: "red",
      shape: "star",
      number: '$$'
    }),
    low10: L.ExtraMarkers.icon({
      icon: "fa-number",
      iconColor: "white",
      markerColor: "green",
      shape: "penta",
      number: '$'
    }),
    happy: L.ExtraMarkers.icon({
      icon: "ion-happy",
      
      iconColor: "red",
      markerColor: "yellow",
      shape: "square",
      
    })
  };
  

  var happinessMarkers=data.happiest.map( row =>{
    return L.marker([row.Lat,row.Lon],{icon:icons.happy}).bindPopup(
      `<h4> <font color="orange">${row.City}, ${row.State}</font></h4>
      <h4> $ monthly rent: ${row.AvePriceTotal} </h4>
      <h4> $ per sqft: ${row.AvePricePersq.toFixed(2)} </h4>
      <h4> Population: ${row.Population} </h4>
      <h4> Happiness Rank: ${row.HappiestRank} </h4>`);
  });
  
  var happinessLayer=L.layerGroup(happinessMarkers);

  var high10Markers=data["highest10"].map( row =>{
    return L.marker([row.Lat,row.Lon],{icon:icons.high10}).bindPopup(
      `<h4> <font color="red">${row.City}, ${row.State}</font></h4>
      <h4> $ monthly rent: ${row.AvePriceTotal} </h4>
      <h4> $ per sqft: ${row.AvePricePersq.toFixed(2)} </h4>
      <h4> Population: ${row.Population} </h4>`);
  });
  var high10Layer=L.layerGroup(high10Markers);

  var low10Markers=data["lowest10"].map( row =>{
    return L.marker([row.Lat,row.Lon],{icon:icons.low10}).bindPopup(
      `<h4> <font color="green">${row.City}, ${row.State}</font></h4>
      <h4> $ monthly rent: ${row.AvePriceTotal} </h4>
      <h4> $ per sqft: ${row.AvePricePersq.toFixed(2)} </h4>
      <h4> Population: ${row.Population} </h4>`);
  });
  var low10Layer=L.layerGroup(low10Markers);

  var overLayMaps={Happiest:happinessLayer,
                   Highest_Rent: high10Layer,
                   Lowest_Rent : low10Layer};


  //Map
  map2 = L.map('map-happinessvsrent',
      {center:[34,-118],
        zoom:4,
        layers: [light, happinessLayer,low10Layer,high10Layer]});
  //Controls

  
  L.control.layers(baseMaps, overLayMaps).addTo(map2);

  //Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');

      div.innerHTML = `<p>
      
      <i style="background:darkred"></i><font color="red">$$ Highest rent</font></p>
      
      <i style="background:darkred"></i><font color="green">$ Lowest rent</font></p>  
      <i style="background:darkred"></i><font color="orange">Happiest cities</font></p>               `;
          
      // loop through our density intervals and generate a label with a colored square for each interval
      

      return div;
  };

  legend.addTo(map2);


  // Initialize an object containing icons for each layer group

  var trace1={x: data["highest10"].map(r => r["City"]),
              y: data["highest10"].map(r => r["AvePriceTotal"]),
              type: "bar",
              text: data["highest10"].map(r => r["State"]),
              textposition: 'bottom',
              color:"red",
              name: "highest"
            };

  var trace2={x: data["lowest10"].map(r => r["City"]),
              y: data["lowest10"].map(r => r["AvePriceTotal"]),
            type: "bar",
            name: "lowest"
          };          
  var data_list=[trace1,trace2];  
  
  var layout = {
    title: "'Bar' Chart"
  };
  Plotly.newPlot("plot1",data_list,layout)


}



function getData() {

  d3.json('/happinessvsrent', {method: 'POST', body: JSON.stringify(priceFilters)})
  .then(data => plotHappinessVsRent(data));

  
}

getData();