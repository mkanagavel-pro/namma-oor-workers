const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  pin: {
    type: String,
    required: true,
  },
  
  district: {
    type: String,
    required: true
  },

  place: String,

  work: {
    type: String,
    required: true
  },

  rate: {
    type: Number,
    required: true
  },

  exp: Number,

  desc: String,

  rating: {
    type: Number,
    default: 4.5
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Worker", workerSchema);