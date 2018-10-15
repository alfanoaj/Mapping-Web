
// Function to determine the marker size based on magnitude
function markerSize(magnitude) {
  return  magnitude*3;
}

// define a function to change our color for various magnitudes
function markerColor(magnitude) {
  if (magnitude>=5) {
    return "#F22B1C"
  }
  else if  (magnitude>=4) {
    return "#C8531A"
  }
  else if  (magnitude>=3) {
    return "#9E7B19"
  }
  else if  (magnitude>=2) {
    return "#75A317"
  }
  else if  (magnitude>=1) {
    return "#4BCB16"
  }
  else {
    return "#22F415"
  }
}

// Define the url for the json query
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// json query returning jsonified data
d3.json(url, function (error, response) {
  //define earthquakemarkers variable to be used later
  var earthquakeMarkers = [];
  if (error) {
    console.warn(error);
  }
  //define data based on the response from the json query
  var data = response.features


  //loop through each feature of data collecting needed information
  for (var i = 0; i < data.length; i++) {
    //set coordinates variable for each point on the map
    var coordinates = [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]];
    // push a new circle merker with varying attributes based on magnitude to the earthquakemarkers array
    earthquakeMarkers.push(
      L.circleMarker(coordinates, {
        weight: 1,
        fillOpacity: 1,
        color: "black",
        //call markerColor function to determine color based on magnitude
        fillColor: markerColor(data[i].properties.mag),
        // call markerSize function to determine size based on magnitude
        radius: markerSize(data[i].properties.mag)
        //Bind popups to each marker displaying information when the marker is clicked
      }).bindPopup("<h3>" + data[i].properties.place +
      "</h3><hr><p>" + new Date(data[i].properties.time) + "</p>")
    );
  }

  // Create tile layers that will be the background of our map
  // satellitemap tile layer
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  //grayscalemap tilelayer
  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  // outdoormap tilelayer
  var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Create a baseMaps object
  var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": grayscalemap,
    "Outdoors": outdoormap
  };

  // create an earthquake layer group
  var earthquakes = L.layerGroup(earthquakeMarkers);

  // create an overlay object
  var overlays = {
    "Earthquakes": earthquakes
  }

  // Create a baseMaps object
  var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": grayscalemap,
    "Outdoors": outdoormap
  };

  // Create the map with our layers
  var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 3,
    layers: [satellitemap, earthquakes]
  });
  
  // create a control for our layers and add overlays/basemaps
  L.control.layers(baseMaps, overlays, {
    collapsed: false
  }).addTo(myMap);

  // create a legend variable and set location
  var legend = L.control({
    position: "bottomright"});

  //define define a function and variables to create our function
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var mags = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var colors = ["#22F415", "#4BCB16", "#75A317", "#9E7B19", "#C8531A", "#F22B1C"];
    var labels = [];

    // add the different magnitudes to the legend in the form of a table
    var legendInfo = "<h1 class=\"header\">Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<table style=\"width:100%\">"+
          "<tr>"+
            "<th>" + mags[0] + "</th>"+
            "<th>" + mags[1] + "</th>"+
            "<th>" + mags[2] + "</th>"+
            "<th>" + mags[3] + "</th>"+
            "<th>" + mags[4] + "</th>"+
            "<th>" + mags[5] + "</th>"+
          "</tr>"+
        "</table>"+
      "</div>";

    // set innerHTML of the div created above to the content in legendInfo variable
    div.innerHTML = legendInfo;

    // create the color scale for each of the 6 magnitdue ranges
    mags.forEach(function(mags, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    //set the innerHTML settings to the color spectrum set above
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  }
  // add the legend to the map
  legend.addTo(myMap);

});





