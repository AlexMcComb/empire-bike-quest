const endPoint = "http://localhost:8080/jobs"

function getJobRequests(callback) {
  $.getJSON(endPoint, callback);
}

function getAllPostsCall() {
  $.ajax({
    url: '/posts',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(posts) {
      displayAllPostsTemplate(posts);
      home.style.display = 'block';
      deletePost();
      editPostButton();
    }
  })
};
//Display job requests
function displayJobRequests(data) {
  for (index in data.jobs) {
    $('body').append(
      '<p>' + data.jobs[index].company + '</p>',
      '<p>' + data.jobs[index].description + '</p>',
      '<p id="pic">'+ data.jobs[index].pickup + '</p>',
      '<p id="drop">' + data.jobs[index].dropoff + '</p>',
      '<input type="button" id="btnss" value="Click me" onclick=console.log("Hi");',
      '<br>');
  }
}


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
$(function () {
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

// function getDirections(){
//   var directionsOrigin = document.getElementById("pic").value;
//   var directionsDestination = document.getElementById("drop").value;
//   console.log(directionsDestination, directionsOrigin);
// }

