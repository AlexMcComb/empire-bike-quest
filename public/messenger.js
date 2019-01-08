const endPoint = "http://localhost:8080/jobs"

// Will load the main screen with all jobs visible
function getAllJobs() {
    $.ajax({
      url: '/jobs',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      success: function (jobs) {
        showMessengerJobs(jobs);
        deleteJob();
        editJobButton();
      }
    })
  };


$(document).ready(function () {
    $.ajax({
      url: "messenger.html",
      success: function () {
        $('.topnavC').append(`<h4 id="welcome">Welcome, ${localStorage.getItem('username')}!</h4>`);
        getAllJobs();
        showMessengerJobs();
      }
    });
  });
  