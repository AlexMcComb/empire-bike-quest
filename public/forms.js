'use strict';

function logInHtml() {
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

function registerHtml() {
  return `
    <form id='registerForm' class='modal-content animate' action=''>
      <section class="closeForm">
        <span class="close" title="Close Form">&times;</span>
      </section>
        <legend id="registerFieldset">Register</legend>
        <section class='container'>
          <label><b>Username</b>
            <input name='username' id='registerUsername' type='text' placeholder='required' required>
          </label>
          <label><b>Password</b>
            <input minlength='4' maxlength='72' name='password' type='password' id='registerPassword' placeholder='required' required>
          </label>
          <label><b>First Name</b>
            <input name='firstName' type='text' id='registerFirstName' placeholder='optional'>
          </label>
          <label><b>Last Name</b>
            <input name='lastName' type='text' id='registerLastName' placeholder='optional'>
          </label>
          <label><b>Email</b>
            <input name='email' type='email' id='registerEmail' placeholder='optional'>
          </label>
          <section class='formButtons'>
            <button class='formSubmitButton' type='submit'>Register</button>
            <button type='button' class='cancel '>Cancel</button>
          </section>
        </section>
    </form>
  `
};

function newJobForm() {
  return `
      <form id='newJobPosts' class='modal-content animate' action=''>
        <section class="closeForm">
          <span class="close" title="Close Form">&times;</span>
        </section>
          <legend>New Delivery</legend>
          <section class='container'>
            <label><b>Company Name</b>
              <input name='company' id='newCompanyName' type='text' placeholder='required' required>
            </label>
            <label><b>Delivery Description</b>
              <input name='description' id='newDescription' type='text' placeholder='i.e. Number, size, weight of delivery' required>
            </label>
            <label><b>Pickup Location</b>
              <input name='pickup' id='pickup' type='text' placeholder='required, choose on map below' required>
            </label>
            <label><b>Dropoff Location</b>
              <input name='dropoff' id='dropoff' type='text' placeholder='required, choose on map below' required>
            </label>
            <section class='formButtons'>
              <button class='formSubmitButtonJob' type='submit'>Create</button>
              <button onclick='getAddressFromMap()' class='formSubmitButtonJob' type='button'>Fill Address</button>
            </section>
          </section>
      </form>
  `
};

function editJobForm(jobID) {
  let job = JSON.parse(localStorage.getItem(jobID));
  return `
      <form id='editJob' class='modal-content animate' action=''>
        <section class="imgcontainer">
          <span class="close" title="Close Form">&times;</span>
        </section>
          <legend>Edit Delivery</legend>
          <section class='container'>
            <label><b>Company Name</b>
              <input name='company' id='newCompanyName' type='text' placeholder='required' value='${job.company}' required>
            </label>
            <label><b>Delivery Description</b>
              <input name='description' id='newDescription' type='text' placeholder='i.e. Number, size, weight of delivery' value='${job.description}' required>
            </label>
            <label><b>Pickup Location</b>
              <input name='pickup' id='pickup' type='text' placeholder='required, choose on map below' value='${job.pickup}' required>
            </label>
            <label><b>Dropoff Location</b>
              <input name='dropoff' id='dropoff' type='text' placeholder='required, choose on map below' value='${job.dropoff}' required>
            </label>
            <section class='formButtons'>
              <button class='formSubmitButton' type='submit'>Edit</button>
              <button type='button' class='cancel '>Cancel</button>
            </section>
          </section> 
      </form>
  `
};

function showAllJobs(jobs, username) {
  let user = '';
  let jobID = '';

  jobs.forEach(job => {
    if (username === undefined) {
      user = job.user;a
      jobID = job.id;
    } else {
      user = username;
      jobID = job._id;
    };

    let company = JSON.stringify(`${job.company}`);
    let description = JSON.stringify(`${job.description}`);
    let pickup = JSON.stringify(`${job.pickup}`);
    let dropoff = JSON.stringify(`${job.dropoff}`);

    $('.jobs').prepend(`
      <section id='jobContent'>
          <h1>Company:</h1>   <p>${job.company}</p><br>
          <h1>Description:</h2>   <p>${job.description}</p><br>
            <h1>Posted By:</h1>   <p>${user}</p><br> 
            <h1>Pickup:</h1>   <p>${job.pickup}</p><br> 
            <h1>Dropoff:</h1>   <p>${job.dropoff}</p><br> 
      </section>

    `);


    if (user === localStorage.getItem('username')) {
      localStorage.setItem(jobID, JSON.stringify(job));
      $('#jobContent').append(`
        <section class='jobsEditDelete formButtons'>
          <button data-jobId=${jobID} class='deleteJob formSubmitButton'>Delete</button>
          <button data-jobId=${jobID} data-company=${company} data-description=${description} data-pickup=${pickup} data-dropoff=${dropoff} class='editJob formSubmitButton'>Edit</button>
        </section>
      `)
    };
  });
};
