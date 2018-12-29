const endPoint = "http://localhost:8080/jobs"

function getJobRequests(callback){
  $.getJSON(endPoint, callback);
}


// this function stays the same when we connect
// to real API later
function displayJobRequests(data) {
    for (index in data.jobs) {
	   $('body').append(
        '<p>' + data.jobs[index].company + '</p>',
        '<p>' + data.jobs[index].description + '</p>',
        '<p id="pic">' + data.jobs[index].pickup + '</p>',
        '<p>' + data.jobs[index].dropoff + '</p>',
        '<input type="button" id="btnss" value="Click me" onclick="msg()">',
        '<br>');
    }
}

function msg(){
  pickupLoc =  $("#pic").text();
  console.log(pickupLoc);
  //$(".mapboxgl-ctrl-geocoder input")[0].text = pickupLoc; 
};


function deleteData(item, endPoint) {
  fetch(endPoint + '/' + item, {
    method: 'delete'
  }).then(response =>
    response.json().then(json => {
      return json;
    })
  );
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayJobRequests() {
  getJobRequests(displayJobRequests);
}

//  on page load do this
$(function() {
  getAndDisplayJobRequests();
})

function showJobs() {
  var x = document.getElementById("jobForm");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}


