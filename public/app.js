const endPoint = "http://localhost:8080/jobs"

// http-server -c-1

const modal = document.getElementsByClassName('forms')[0];

// Will load the main screen with all posts visible
function getAllPostsCall() {
  $.ajax({
    url: '/jobs',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(jobs) {
      displayAllPostsTemplate(posts);
      home.style.display = 'block';
      deletePost();
      editPostButton();
    }
  })
};

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function mobileMenu() {
  let y = document.querySelector(".catch h1");
  if (y.style.display === "none") {
    y.style.display = "block";
  } else {
    y.style.display = "none";
  }
  var x = document.getElementById("logo");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  
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
  $('.modal').on('click', '.cancel', function(e) {
    e.preventDefault();
    removeForm();
  });
};

// Close the form when clicking outside
function outsideFormClick() {
  window.onclick = function(e) {
    if (e.target == modal) {
      removeForm();
    };
  };
};

// Close the form with the x in the corner of the box
function formXButton() {
  $('.modal').on('click', '.close', function(e) {
    e.preventDefault();
    removeForm();
  });
};

// Set form to display none and clears the contents
function removeForm() {
  modal.style.display = "none";
  $('.modal-content').remove();
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
  $('.companySignup').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(registerHtml);
    closeForm();
    modal.style.display = 'block';
    registerSubmit();
  })
};

// Will submit your registration form
function registerSubmit() {
  $('form').on('submit', function(e) {
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
    success: function() {
      document.getElementById('registerFieldset').remove();
      $('#registerForm').append(`<h2'>You have been successfully registered!  Please click on company login with your credentials.</h2>`)
    },
    error: function(data) {
      let message = 'There was a problem with your form: ' + data.responseText.message;
      window.alert(message);
    }
  });
};

// Open the login form for the company
function companyLogin() {
  $('.companyLogin').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(logInHtml);
    closeForm();
    modal.style.display = 'block';
    logInSubmit();
  });
};

// Will handle logging in
function logInSubmit() {
  $('form').on('submit', function(e) {
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
      success: function(data) {
        loginStorage(data);
        removeForm();
        window.location = "company.html";
      },
      error: function(data) {
        let message = 'There was a problem logging in. ' + data.responseText;
        window.alert(message);
      } 
  });
});
};

$(document).ready(function(){
$.ajax({ url: "company.html",
        success: function(){
          $('.topnav').append(`<h4>Welcome, ${localStorage.getItem('username')}!</h4>`);
        }});
      });





 // These functions handle the messenger experience 
// Will open the registration form
function messengerRegisterUser() {
  $('.messengerSignup').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(registerHtml);
    closeForm();
    modal.style.display = 'block';
    registerSubmit();
  })
};


// Open the login form for the company
function messengerLogin() {
  $('.messengerLogin').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(logInHtml);
    closeForm();
    modal.style.display = 'block';
    messengerLogInSubmit();
  });
};

// Will handle logging in for messengers
function messengerLogInSubmit() {
  $('form').on('submit', function(e) {
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
      success: function(data) {
        loginStorage(data);
        removeForm();
        window.location = "index.html";
      },
      error: function(data) {
        let message = 'There was a problem logging in. ' + data.responseText;
        window.alert(message);
      } 
  });
});
};

     

function loadInitialListeners() {
  companyLogin();
  messengerLogin();
  companyRegisterUser();
  messengerRegisterUser();
};

$(loadInitialListeners);






// function getDirections(){
//   var directionsOrigin = document.getElementById("pic").value;
//   var directionsDestination = document.getElementById("drop").value;
//   console.log(directionsDestination, directionsOrigin);
// }

