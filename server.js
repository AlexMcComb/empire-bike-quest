"use strict";

const express = require("express");
const mongoose = require("mongoose");

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;


// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const { PORT, DATABASE_URL } = require("./config");
const { Job } = require("./models");

const app = express();
app.use(express.json());

//serve the static client side files from the "public" folder
app.use(express.static("public"));

// GET requests to /jobs => return 10 jobs
app.get("/jobs", (req, res) => {
  Job.find()
    // limit the return
    .limit(10)
    // success callback: for each job we got back, we'll
    // call the `.serialize` instance method we've created in
    // models.js in order to only expose the data we want the API return.    
    .then(jobs => {
      res.json({
        jobs: jobs.map(job => job.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});


//Allow user to post a job
app.post("/jobs", (req, res) => {
  const requiredFields = ["company", "description", "pickup", "dropoff"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Job.create({
    company: req.body.company,
    description: req.body.description,
    pickup: req.body.pickup,
    dropoff: req.body.dropoff,
  })
    .then(job => res.status(201).json(job.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

//Allow user to update, and also allows messenger to add their name and optional comment
app.put('/jobs/:id', (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    // we return here to break out of this function
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ["company", "description", "pickup", "dropoff", "messenger", "comment"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Job
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(job => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//Allow user to delete job
app.delete('/jobs/:id', (req, res) => {
  Job
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run so it's accessible outside the function
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// this function closes the server, and returns a promise.
// used in the integration tests.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs, but I export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };