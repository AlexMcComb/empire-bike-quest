'use strict';

function logInTemplate() {
  return `
    <form id='loginForm' class='modal-content animate' action=''>
      <section class="closeForm">
        <span class="close" title="Close Form">&times;</span>
      </section>
        <legend>Login</legend>
        <section class='container'>
          <label><b>Username</b>
            <input name='username' type='text' placeholder='required' required>
          </label>
          <label><b>Password</b>
            <input name='password' type='password' placeholder='required' required>
          </label>
          <section class='formButtons'>
            <button class='formSubmitButton' type='submit'>Login</button>
            <button type='button' class='cancel '>Cancel</button>
          </section>
        </section>
    </form>
  `
};




// return `
// <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.js'></script>
// <link rel="stylesheet" href="mapbox.css">

// <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.css' rel='stylesheet' />
// </head>

// <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.0/mapbox-gl-directions.js'></script>
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

// <a href="index.html" class="active">Home</a>

// <div class="container">
// <div class="row">
// </div>
// <form action="http://localhost:8080/jobs" method="POST" onsubmit="setTimeout(function () { window.location.reload(); }, 10)"
//  id="jobForm">
//     <div class="row">
//         <div class="col-25">
//             <label for="company">Company</label>
//         </div>
//         <div class="col-75">
//             <input type="text" id="company" name="company" placeholder="Your comapny.." required>
//         </div>
//     </div>
//     <div class="row">
//         <div class="col-25">
//             <label for="description">Description</label>
//         </div>
//         <div class="col-75">
//             <input type="text" id="description" name="description" placeholder="Description of delivery.." required>
//         </div>
//     </div>
//     <div class="row">
//         <div class="col-25">
//             <label for="pickup">Pickup Address</label>
//         </div>
//         <div class="col-75">
//             <input type="text" id="pickup" name="pickup" placeholder="Pickup address.." required>
//         </div>
//     </div>
//     <div class="row">
//         <div class="col-25">
//             <label for="dropoff">Drop Off Address</label>
//         </div>
//         <div class="col-75">
//             <input type="text" id="dropoff" name="dropoff" placeholder="Drop off address.." required>
//         </div>
//     </div>
//     <div class="row">
//         <input onclick='getAddressFromMap()' type="submit" value="Submit">
//     </div>
// </form>
// </div>


// <a onclick="showJobs()" style="display:none;">Add a Job</a>
// <a class='loggedIn logout' style="display:none;">Logout</a>
// <a class='loggedIn myHikesButton' style="display:none;">My Jobs</a>
        

// <div id='map'></div>

// <script type="text/javascript" src="mapbox.js"></script>`