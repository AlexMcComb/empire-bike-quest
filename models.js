"use strict";

const mongoose = require("mongoose");

// this is our schema to represent a job
const jobSchema = mongoose.Schema({
    company: { type: String, required: true },
    description: { type: String, required: true },
    messenger: { type: String },
    comment: { type: String },
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true }
});


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that
// exposes the fields we want from the underlying data
jobSchema.methods.serialize = function() {
    return {
      id: this._id,
      company: this.company,
      description: this.description,
      borough: this.borough,
      messenger: this.messenger,
      comment: this.comment,
      pickup: this.pickup,
      dropoff: this.dropoff
    };
  };

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Job = mongoose.model("Job", jobSchema);

module.exports = { Job };