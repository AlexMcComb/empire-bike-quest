"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
mongoose.set('useFindAndModify', false);

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const { JWT_SECRET } = require('../config');
const { Job } = require('../models');
const { User } = require('../users/models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, PORT } = require('../config');

chai.use(chaiHttp);

//Faker library automatically
// generates placeholder values for fields
// and then we insert that data into mongo
function seedJobData() {
  console.info('seeding job data');
  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push(generateJobData());
  }
  // this will return a promise
  return Job.insertMany(seedData);
}

function seedUserData() {
  console.info('seeding user data')
  const seedUserData = [];

  for (let i = 1; i < 10; i++) {
    seedUserData.push(generateUserData())
  }
  return User.insertMany(seedUserData);
};

// generate an object represnting a job.
// can be used to generate seed data for db
// or request.body data
function generateJobData() {
  return {
    company: faker.company.companyName(),
    description: faker.lorem.sentence(),
    messenger: faker.name.firstName(),
    comment: faker.lorem.sentence(),
    pickup: faker.fake("{{address.streetAddress}}, {{address.city}} {{address.state}} {{address.zipCode}}"),
    dropoff: faker.fake("{{address.streetAddress}}, {{address.city}} {{address.state}} {{address.zipCode}}"),
  };
};

function generateUserData() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
  };
};


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

const databaseUrl = TEST_DATABASE_URL;
const port = PORT;

describe('Jobs API resource', function () {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedJobData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  //Only "before" is used to start the server once.
  //Being sure to use the TEST database for this since it tears down out databse
  before(function () {
    return runServer(databaseUrl);
  });

  beforeEach(function () {
    return seedJobData() && seedUserData();;
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe('GET endpoint', function () {

    it('should return all existing jobs', function () {
      // strategy:
      //    1. get back all jobs returned by by GET request to `/jobs`
      //    2. prove res has right status, data type
      //    3. prove the number of jobs we got back is equal to number
      //       in db.
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('/jobs')
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          return Job.count();
        })
        .then(count => {
          expect(res.body).to.have.lengthOf(count);
        });
    });


    it('should return jobs with right fields', function () {
      // Strategy: Get back all jobs, and ensure they have expected keys. 
      //Chained promises avoid problems of nested promises

      let resJob;


      return chai.request(app).get('/jobs')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf.at.least(1);

        res.body.forEach(post => {
          expect(post).to.be.a('object')
          expect(post).to.include.keys(
              'id', 'company', 'user', 'description', 'messenger', 'comment', 'pickup', 'dropoff');
          });
          resJob = res.body[0];
          return Job.findById(resJob.id);
        })
        .then(job => {

          expect(resJob.id).to.equal(job.id);
          expect(resJob.company).to.equal(job.company);
          expect(resJob.username).to.equal(job.username);
          expect(resJob.description).to.equal(job.description);
          expect(resJob.messenger).to.equal(job.messenger);
          expect(resJob.comment).to.equal(job.comment);
          expect(resJob.pickup).to.equal(job.pickup);
          expect(resJob.dropoff).to.equal(job.dropoff);
        });
    });
  });


  //Testing Post requests
  describe('POST endpoint', function () {
    // strategy: make a POST request with data,
    // then prove that the job we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    // Again, we have chained promises
    it('should add a new job', function () {

      return User.findOne()
        .then(userData => {
          const token = jwt.sign(
            {
              user: {
                user: userData.username
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: userData.username,
              expiresIn: '7d'
            }
          );

          let newJob = {
            user_id: userData._id,
            company: faker.company.companyName(),
            user: userData.username,
            description: faker.lorem.sentence(),
            messenger: faker.name.firstName(),
            comment: faker.lorem.sentence(),
            pickup: faker.fake("{{address.streetAddress}}, {{address.city}} {{address.state}} {{address.zipCode}}"),
            dropoff: faker.fake("{{address.streetAddress}}, {{address.city}} {{address.state}} {{address.zipCode}}"),
          };

          return chai.request(app)
            .post('/jobs').set('authorization', `Bearer ${token}`).send(newJob)
            .send(newJob)
            .then(res => {
              expect(res).to.have.status(201);
              expect(res).to.be.json;
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys(
                'id', 'company', 'user', 'description', 'messenger', 'comment', 'pickup', 'dropoff');
              // Because Mongo should have created id on insertion
              expect(res.body.id).to.not.be.null;
              expect(res.body.company).to.equal(newJob.company);
              expect(res.username).to.equal(newJob.username);
              expect(res.body.description).to.equal(newJob.description);
              expect(res.body.messenger).to.equal(newJob.messenger);
              expect(res.body.comment).to.equal(newJob.comment);
              expect(res.body.pickup).to.equal(newJob.pickup);
              expect(res.body.dropoff).to.equal(newJob.dropoff);

              return Job.findById(res.body.id);
            })
            .then(function (job) {
              expect(job.username).to.equal(newJob.username);
              expect(job.company).to.equal(newJob.company);
              expect(job.description).to.equal(newJob.description);
              expect(job.messenger).to.equal(newJob.messenger);
              expect(job.comment).to.equal(newJob.comment);
              expect(job.pickup).to.equal(newJob.pickup);
              expect(job.dropoff).to.equal(newJob.dropoff);
            });
        });
    });

    // Testing Put requests
    describe('PUT endpoint', function () {

      // strategy:
      //  1. Get an existing job from db
      //  2. Make a PUT request to update that job
      //  3. Prove that the job returned by request contains data we sent
      //  4. Prove job in db is correctly updated
      it('should update fields you send over', function () {
        const updateData = {
          company: 'fofofofofofofof',
          description: 'so many heavy boxes'
        };

        return Job
          .findOne()
          .then(function (job) {
            updateData.id = job.id;
            const token = jwt.sign(
              {
                user: {
                  _id: job.id
                }
              },
              JWT_SECRET,
              {
                algorithm: 'HS256',
                subject: job.id,
                expiresIn: '7d'
              }
            );

            // make request then inspect it to make sure it reflects
            // data we sent
            return chai.request(app)
              .put(`/jobs/${updateData.id}`).set('authorization', `Bearer ${token}`)
              .send(updateData);
          })
          .then(function (res) {
            expect(res).to.have.status(204);

            return Job.findById(updateData.id);
          })
          .then(function (job) {
            expect(job.company).to.equal(updateData.company);
            expect(job.description).to.equal(updateData.description);
          });
      });
    });

    // Testing delete requests
    describe('DELETE endpoint', function () {
      // strategy:
      //  1. get a job
      //  2. make a DELETE request for that job's id
      //  3. assert that response has right status code
      //  4. prove that job with the id doesn't exist in db anymore
      it('delete a job by id', function () {

        let job;

        return Job
          .findOne()
          .then(_job => {
            const token = jwt.sign(
              {
                user: {
                  _id: _job.id
                }
              },
              JWT_SECRET,
              {
                algorithm: 'HS256',
                subject: _job.id,
                expiresIn: '7d'
              }
            );
            job = _job;
            return chai.request(app).delete(`/jobs/${job.id}`).set('authorization', `Bearer ${token}`);
          })
          .then(res => {
            expect(res).to.have.status(204);
            return Job.findById(job.id);
          })
          .then(_job => {
            expect(_job).to.be.null;
          });
      });
    });
  });
});
