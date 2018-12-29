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

function myFunction() {
  var x = document.getElementById("mapbox-directions-origin-input").querySelector(".mapboxgl-ctrl-geocoder input").value;
  var y = document.getElementById("mapbox-directions-destination-input").querySelector(".mapboxgl-ctrl-geocoder input").value;
    console.log(x,y);
  document.getElementById("pickup").value = x; 
  document.getElementById("dropoff").value = y;
};


// function msg(){
//   pickupLoc =  $("#pic").text();
//   console.log(pickupLoc);
//   //$(".mapboxgl-ctrl-geocoder input")[0].text = pickupLoc; 
// };

//$(".mapboxgl-ctrl-geocoder input").blur(function(){
  //pickupLoc = $( this ).val();
  //$("#pickup")[0].value = pickupLoc; 
//});

//$(".mapboxgl-ctrl-geocoder").find('ul:visible').click("li").click(function(e) {
     //alert('hello')
  //});

  
//$("mapboxgl-ctrl-geocoder input").click();
//console.log("valid");
//var pickupLoc = document.querySelector('li.active a').textContent;


//for (var i=0; i < pickupLoc.length; i++) {
  //pickupLoc[i].onclick = function(){
      //console.log(pickupLoc);
  //}
//};


//$(".mapboxgl-ctrl-geocoder ul").click(function(){
  //pickupLoc = $(this).val();
  //console.log(pickupLoc);
  //$("#pickup")[0].text= pickupLoc; 
//});
