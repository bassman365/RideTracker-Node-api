'use strict';
const Messages = require('../common/messages');

function validatePostRide(ride) {
  let errors = [];
  if (ride.program === undefined || ride.program === '') {
    errors.push(new RideError('error', Messages.PROGRAM_REQUIRED));
  }

  if (ride.userId === undefined || ride.userId === '') {
    errors.push(new RideError('error', Messages.USER_ID_REQUIRED));
  }

  return errors;
}

function validateGetRide(ride) {
  let errors = [];
  return errors;
}

class RideError {
  constructor(severity, message) {
    this.severity = severity;
    this.message = message;
  }
}

module.exports = {
  validatePostRide,
  validateGetRide,
  RideError
};
