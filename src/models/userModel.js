'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  name: {type: String},
  email: { type: String, unique: true },
  roles: [{ type: 'String' }],
  isVerified: { type: Boolean, default: false },
  password: {type: String},
  passwordResetToken: String,
  passwordResetExpires: Date
  // admin: {type: Boolean}
},
{
  timestamps: true,
  usePushEach: true
});

module.exports = mongoose.model('User', userModel);
