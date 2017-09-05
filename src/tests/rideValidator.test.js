'use strict';
const should = require('should');
const validators = require('../validators/rideValidator');
const validatorHelper = require('../validators/validatorHelper');
const Messages = require('../common/messages');

describe('Ride Validator Tests:', function () {
  describe('validatePostRide', function () {
    it('should not allow an empty program on post', function () {
      const ride = {
      };
      const errors = validators.validatePostRide(ride);
      errors.should.containEql(new validatorHelper.ValidationError('error', Messages.PROGRAM_REQUIRED));
    });
  });
});

describe('Ride Validator Tests:', function () {
  describe('validatePostRide', function () {
    it('should not allow an empty program on post', function () {
      const ride = {
      };
      const errors = validators.validatePostRide(ride);
      errors.should.containEql(new validatorHelper.ValidationError('error', Messages.USER_ID_REQUIRED));
    });
  });
});
