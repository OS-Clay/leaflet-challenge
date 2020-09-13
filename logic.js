

var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom:5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken:'pk.eyJ1IjoiY2hyaWJhciIsImEiOiJja2YwYnNxODgxYnhnMndtZmplN3JocTM1In0.Y5rrDiwGiMkVyu0f4p2RHA'
    }).addTo(myMap);


  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";

  d3.json(queryUrl, function(data){
    function circleRender(feature){
    return {
      opacity: .75,
      fillOpacity: .75,
      fillColor: Color(feature.properties.mag),
      color:"white",
      radius: Radius(feature.properties.mag)
    };


  }

  function Color(m){
  /*  colorNumeric("BuPu", c(2.5, 6), na.color = "#808080", alpha = FALSE,
  reverse = FALSE)
*/
  switch (true){
  case m > 6:
    return "#FF6347";
  case m > 4.5:
    return "#FF4500";
  case m > 3:
    return "#FFD700";
  case m > 2.5:
    return "#FFA500";
  case m > 1.5:
    return "green"
    }

  }

  function Radius(m){


  return (m * 3)
  }

  L.geoJson(data, {
// fun fact, circleMarker is different than circle. circle doesnt respect radius
  pointToLayer: function(feature, coord){
    return L.circleMarker(coord);
  },
  style: circleRender,
  onEachFeature: function(feature, layer){
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p>" + feature.properties.mag + "</p>");
  }
  }).addTo(myMap);
// so there is a legend, but i dont know how to get the backround colors
//or the backround itslef
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
      grades = [1.5, 2.5, 3, 4.5],
      labels = [];

      
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + Color(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
  };

  legend.addTo(myMap);
});
