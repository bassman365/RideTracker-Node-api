'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  name: {type: String},
  password: {type: String},
  admin: {type: Boolean}
},
{
  timestamps: true
});

module.exports = mongoose.model('User', userModel);
