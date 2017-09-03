'use strict';
const express = require('express');
const Ride = require('../models/rideModel');
const rideController = require('../controllers/rideController')(Ride);

const routes = function () {
  let rideRouter = express.Router();

  // //auth middleware
  // rideRouter.use('/', function (req, res, next) {
  //   const token = req.body.token || req.query.token || req.headers['x-access-token'];
  //   if (token) {
  //     jwt.verify(token, app.get('superSecret'), function(err, decoded) {
  //       if (err) {
  //         return res.json({ success: false, message: 'Failed to authenticate token.' });
  //       } else {
  //         // if everything is good, save to request for use in other routes
  //         req.decoded = decoded;
  //         next();
  //       }
  //     });
  //   }
  // });

  rideRouter.route('/')
    .post(rideController.post)
    .get(rideController.getRides);

  // id middleware to validate rideId exists
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
