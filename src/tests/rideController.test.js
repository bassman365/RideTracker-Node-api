'use strict';
const should = require('should');
const sinon = require('sinon');
const validators = require('../validators/rideValidator');
const validatorHelper = require('../validators/validatorHelper');

describe('Ride Controller Tests:', function () {
  describe('Post failure', function () {
    it('should return bad request status on validation failure', function () {
      let Ride = function (ride) { this.save = function () {};};
      let req = {
        body: {
        }
      };

      let res = {
        status: sinon.spy(),
        send: sinon.spy()
      };

      let validatorStub = sinon.stub(validators, 'validatePostRide');
      validatorStub.onFirstCall().returns([new validatorHelper.ValidationError('error', 'test error')]);
      const rideController = require('../controllers/rideController')(Ride);
      rideController.post(req, res);
      res.status.calledWith(400).should.equal(true, 'Bad Request ' + res.status.args[0][0]);
      res.send.calledWith('test error').should.equal(true);
      validatorStub.restore();
    });
  });

  describe('Post success', function () {
    it('should return success created status code', function () {
      let Ride = function (ride) { this.save = function () {};};
      let req = {
        body: {
          userId: 123,
          program: 'Test Program',
          duration: 1800
        }
      };

      let res = {
        status: sinon.spy(),
        send: sinon.spy()
      };

      const rideController = require('../controllers/rideController')(Ride);
      rideController.post(req, res);
      res.status.calledWith(201).should.equal(true, 'Created Status ' + res.status.args[0][0]);
      res.send.calledOnce.should.equal(true);
    });
  });
});
