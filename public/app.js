const endPoint = "http://localhost:8080/jobs"

// http-server -c-1

const modal = document.getElementsByClassName('forms')[0];
const myJobsInformer = document.getElementById('myJobs');
const newJobDisplay = document.getElementsByClassName('newJob')[0];


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
      acceptJobButton();
    }
  })
};

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */

function mobileMenu() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// Start to close form listeners 
function closeForm() {
  formCloseButton();
  formXButton();
  outsideFormClick();
}

// Close the form
function formCloseButton() {
  $('.modal').on('click', '.cancel', function (e) {
    e.preventDefault();
    removeForm();
  });
};

// Close the form when clicking outside
function outsideFormClick() {
  window.onclick = function (e) {
    if (e.target == modal) {
      removeForm();
    };
  };
};

// Close the form with the x in the corner of the box
function formXButton() {
  $('.modal').on('click', '.close', function (e) {
    e.preventDefault();
    removeForm();
  });
};

// Set form to display none and clears the contents
function removeForm() {
  modal.style.display = "none";
  $('.modal-content').remove();
  $('.modal-content-edits').remove();
};

// gives localstoarge the login data
function loginStorage(data) {
  localStorage.setItem('username', data.user.username);
  localStorage.setItem('userID', data.user.id);
  localStorage.setItem('token', data.authToken);
};


// These functions handle the company experience 
// Will open the registration form
function companyRegisterUser() {
  $('.companySignup').on('click', function (e) {
    e.preventDefault();
    $('.forms').append(registerHtml);
    closeForm();
    modal.style.display = 'block';
    registerSubmit();
  })
};

// Submits the registration form
function registerSubmit() {
  $('form').on('submit', function (e) {
    e.preventDefault();
    let formData = {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val(),
      firstName: $('input[name="firstName"]').val(),
      lastName: $('input[name="lastName"]').val(),
      email: $('input[name="email"]').val()
    };
    registerUser(formData);
  });
};

function registerUser(newUserData) {
  $.ajax({
    url: '/api/users',
    method: 'POST',
    data: JSON.stringify(newUserData),
    dataType: 'json',
    contentType: 'application/json',
    success: function () {
      document.getElementById('registerFieldset').remove();
      $('#registerForm').append(`<h2'>You have been successfully registered!  Please login with your credentials.</h2>`)
    },
    error: function (data) {
      let message = 'There was a problem with your form: ' + data.responseText.message;
      window.alert(message);
    }
  });
};

// Open the login form for the company
function companyLogin() {
  $('.companyLogin').on('click', function (e) {
    e.preventDefault();
    $('.forms').append(logInHtml);
    closeForm();
    modal.style.display = 'block';
    logInSubmit();
  });
};

// Will handle logging in
function logInSubmit() {
  $('form').on('submit', function (e) {
    e.preventDefault();
    let formData = {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val()
    };
    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      data: JSON.stringify(formData),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        loginStorage(data);
        removeForm();
        window.location = "company.html";
      },
      error: function (data) {
        let message = 'There was a problem logging in. ' + data.responseText;
        window.alert(message);
      }
    });
  });
};


$(document).ready(function () {
  $.ajax({
    url: "company.html",
    success: function () {
      $('.topnavC').append(`<h4 id="welcome">Welcome, ${localStorage.getItem('username')}!</h4>`);
      userJobs();
    }
  });
});


// $(document).ready(function () {
//   $.ajax({
//     url: "messenger.html",
//     success: function () {
//       $('.topnavC').append(`<h4 id="welcome">Welcome, ${localStorage.getItem('username')}!</h4>`);
//       getAllJobs();
//       showMessengerJobs();
//     }
//   });
// });

// Sending the information to the user endpoint
function userJobs() {
  $.ajax({
    url: '/api/users/' + localStorage.getItem('userID'),
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') },
    success: function (res) {
      if (res.jobs.length === 0) {
        $('#myJobs').text(`You haven't added any jobs yet.`);
        myJobsInformer.style.display = 'block';
      } else {
        myJobsInformer.innerHTML = `My Jobs`;
        myJobsInformer.style.display = 'block';
        showAllJobs(res.jobs, res.username);
        deleteJob();
        editJobButton();
      }
    }
  });
};

// Loads all of the jobs
function myJobsButton() {
  $('.myJobsButton').on('click', function (e) {
    e.preventDefault();
    $('.jobs').empty();
    userJobs();
  })
};



// Load the form for new jobs
function addNewJob() {
  $('.newJob').on('click', function (e) {
    e.preventDefault();
    $('.forms').append(newJobForm);
    closeForm();
    modal.style.display = 'block';
    newJobSubmit();
    $(window.map).resize();
  })
};


// Submits new job
function newJobSubmit() {
  $('form').on('submit', function (e) {
    e.preventDefault();
    let formData = {
      user_id: localStorage.getItem('userID'),
      company: $('input[name="company"]').val(),
      description: $('input[name="description"]').val(),
      pickup: $('input[name="pickup"]').val(),
      dropoff: $('input[name="dropoff"]').val()
    };
    postNewJob(formData);
  })
};

// This will POST the new job to the database
function postNewJob(newJobData) {
  $.ajax({
    url: '/jobs',
    method: 'POST',
    data: JSON.stringify(newJobData),
    dataType: 'json',
    contentType: 'application/json',
    headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') },
    success: function (data) {
      removeForm();
      $('.jobs').empty();
      userJobs();
    },
    error: function (data) {
      let message = 'There was a problem with your form: ' + data.responseText.message;
      window.alert(message);
    }
  });
};

// Edit a job
function editJobButton() {
  $('.editJob').on('click', function (e) {
    e.preventDefault();
    let jobID = $(this).data('jobid');
    $('.forms').append(editJobForm(jobID));
    closeForm();
    modal.style.display = 'block';
    editJobSubmit(jobID);
    $(window.map).resize();
  });
};

// //Accept a job
// function acceptJobButton() {
//   $('.takeJob').on('click', function (e) {
//     e.preventDefault();
//     let jobID = $(this).data('jobid');
//     $('.forms').append(acceptJobForm(jobID));
//     closeForm();
//     modal.style.display = 'block';
//     $(window.map).resize();
//   });
// };


// Submit updated job data
function editJobSubmit(jobID) {
  $('form').on('submit', function (e) {
    e.preventDefault();
    let formData = {
      id: jobID,
      company: $('input[name="company"]').val(),
      description: $('input[name="description"]').val(),
      pickup: $('input[name="pickup"]').val(),
      dropoff: $('input[name="dropoff"]').val()
    };
    putJobData(formData);
  });
};

// This will PUT the new data to the database
function putJobData(updateJobData) {
  $.ajax({
    url: '/jobs/' + updateJobData.id,
    method: 'PUT',
    dataType: 'json',
    data: JSON.stringify(updateJobData),
    contentType: 'application/json',
    headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') },
    success: function () {
      if (!(newJobDisplay.style.display === 'none')) {
        removeForm();
        $('.jobs').empty();
        userJobs();
      } else {
        removeForm();
        $('.jobs').empty();
        userJobs();
      }
    },
    error: function (data) {
      let message = 'There was a problem with your form: ' + data.responseText.message;
      window.alert(message);
    }
  });
};


// // These functions handle the messenger experience 
// // Will open the registration form
// function messengerRegisterUser() {
//   $('.messengerSignup').on('click', function (e) {
//     e.preventDefault();
//     $('.forms').append(registerHtml);
//     closeForm();
//     modal.style.display = 'block';
//     registerSubmit();
//   })
// };


// // Open the login form for the messenger
// function messengerLogin() {
//   $('.messengerLogin').on('click', function (e) {
//     e.preventDefault();
//     $('.forms').append(logInHtml);
//     closeForm();
//     modal.style.display = 'block';
//     messengerLogInSubmit();
//   });
// };

// // Will handle logging in for messengers
// function messengerLogInSubmit() {
//   $('form').on('submit', function (e) {
//     e.preventDefault();
//     let formData = {
//       username: $('input[name="username"]').val(),
//       password: $('input[name="password"]').val()
//     };
//     $.ajax({
//       url: '/api/auth/login',
//       method: 'POST',
//       data: JSON.stringify(formData),
//       dataType: 'json',
//       contentType: 'application/json',
//       success: function (data) {
//         loginStorage(data);
//         removeForm();
//         window.location = "messenger.html";
//         getAllJobs();
//       },
//       error: function (data) {
//         let message = 'There was a problem logging in. ' + data.responseText;
//         window.alert(message);
//       }
//     });
//   });
// };

function deleteJob() {
  $('.deleteJob').on('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this job?')) {
      $.ajax({
        url: '/jobs/' + $(this).data('jobid'),
        method: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') },
        success: function () {
          if (!(newJobDisplay.style.display === 'none')) {
            $('.jobs').empty();
            userJobs();
          } else {
            $('.jobs').empty();
            userJobs();
          }
        }
      });
    }
  })
};


// Logout 
function logOut() {
  $('.logout').on('click', function (e) {
    e.preventDefault();
    $('.jobs').empty();
    $('#welcome').remove();
    window.location = "index.html";
    localStorage.clear();
  });
};



function loadInitialListeners() {
  companyLogin();
  // messengerLogin();
  companyRegisterUser();
  // messengerRegisterUser();
  logOut();
  myJobsButton();
  addNewJob();
};

$(loadInitialListeners);



