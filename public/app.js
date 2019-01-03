const endPoint = "http://localhost:8080/jobs"

http-server -c-1

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


// Open the login form for the company
function logInButton() {
  $('.companyLogin').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(logInTemplate);
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
        window.location = "comapny.html";
        $('.topnav').append(`<span id='userInNav'>Welcome, ${localStorage.getItem('username')}!</span>`);
      },
      error: function(data) {
        let message = 'There was a problem logging in. ' + data.responseText;
        window.alert(message);
      } 
    });
  });
};


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

function loadInitialListeners() {
  logInButton();
};

$(loadInitialListeners);






// function getDirections(){
//   var directionsOrigin = document.getElementById("pic").value;
//   var directionsDestination = document.getElementById("drop").value;
//   console.log(directionsDestination, directionsOrigin);
// }

