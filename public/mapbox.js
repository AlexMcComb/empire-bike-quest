mapboxgl.accessToken = 'pk.eyJ1IjoiYWxleG1jYyIsImEiOiJjam5pMWdtN3gwanQ1M3BxdDVuZGlyZXdkIn0.SlU2gCqByEwsz0pt7ocg8A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.4512, 43.6568],
    zoom: 13
});

var directions = map.addControl(new MapboxDirections({
    accessToken: mapboxgl.accessToken
}));

let pickupLoc;

$(".mapboxgl-ctrl-geocoder input").on("blur",function(){
  pickupLoc = $( this ).val();
  $("#pickup")[0].value = pickupLoc; 
});


