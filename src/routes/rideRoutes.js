'use strict';
const express = require('express');
const Ride = require('../models/rideModel');
const rideController = require('../controllers/rideController')(Ride);

const routes = function () {
  let rideRouter = express.Router();
  rideRouter.route('/')
    .post(rideController.post)
    .get(rideController.getRides);

  //middleware to validate rideId exists
  rideRouter.use('/:rideId', function (req, res, next) {
    Ride.findById(req.params.rideId, (err, ride) => {
      if (err) {
        res.status(500).send(err);
      } else if (ride) {
        req.ride = ride;
        next();
      } else {
        res.status(404).send('no ride found');
      }
    });
  });

  rideRouter.route('/:rideId')
    .get(rideController.getRide)
    .put(rideController.putRide)
    .patch(rideController.patchRide)
    .delete(rideController.deleteRide);

  return rideRouter;
};

module.exports = routes;
