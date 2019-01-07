mapboxgl.accessToken = 'pk.eyJ1IjoiYWxleG1jYyIsImEiOiJjam5pMWdtN3gwanQ1M3BxdDVuZGlyZXdkIn0.SlU2gCqByEwsz0pt7ocg8A';

var directions = new MapboxDirections({
  accessToken: mapboxgl.accessToken,
  unit: 'metric',
  profile: 'mapbox/cycling'
});

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-90.4512, 43.6568],
  zoom: 2
});

map.addControl(directions, 'top-left');

//Get the address the user inputs in the map and send it to the form so it can be added to the database
function getAddressFromMap() {
  var origin = document.getElementById("mapbox-directions-origin-input").querySelector(".mapboxgl-ctrl-geocoder input").value;
  var destination = document.getElementById("mapbox-directions-destination-input").querySelector(".mapboxgl-ctrl-geocoder input").value;
  document.getElementById("pickup").value = origin; 
  document.getElementById("dropoff").value = destination;
};

