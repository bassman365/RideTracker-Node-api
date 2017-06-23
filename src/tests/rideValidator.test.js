'use strict';
const should = require('should');
const validators = require('../validators/rideValidator');
const Messages = require('../common/messages');

describe('Ride Validator Tests:', function () {
  describe('validatePostRide', function () {
    it('should not allow an empty program on post', function () {
      const ride = {
      };
      const errors = validators.validatePostRide(ride);
      errors.should.containEql(new validators.RideError('error', Messages.PROGRAM_REQUIRED));
    });
  });
});

describe('Ride Validator Tests:', function () {
  describe('validatePostRide', function () {
    it('should not allow an empty program on post', function () {
      const ride = {
      };
      const errors = validators.validatePostRide(ride);
      errors.should.containEql(new validators.RideError('error', Messages.USER_ID_REQUIRED));
    });
  });
});
