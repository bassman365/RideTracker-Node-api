'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programModel = new Schema({
  name: { type: String },
  hexColor: { type: String }
});

const programCollectionModel = new Schema({
  userId: { type: String },
  name: {type: String },
  programs: [programModel],
  defautProgram: { type: String }
},
{
  timestamps: true
});

module.exports = mongoose.model('ProgramCollection', programCollectionModel);
