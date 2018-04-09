'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rideModel = new Schema({
  userId: { type: String },
  program: { type: String },
  date: {type: Date},
  duration: { type: Number },
  weight: { type: Number },
  level: { type: Number },
  distance: { type: Number },
  calories: { type: Number },
  notes: { type: String }
},
{
  timestamps: true
});

module.exports = mongoose.model('Ride', rideModel);
