'use strict';
const validators = require('../validators/rideValidator');
const validatorHelper = require('../validators/validatorHelper');

const rideController = (Ride) => {
  const post = ((req, res) => {
    let ride = new Ride(req.body);
    ride.userId = req.decoded.id;
    const errors = validators.validatePostRide(req.body);
    if (errors.length > 0) {
      res.status(400);
      res.send(validatorHelper.getErrorList(errors));
    } else {
      ride.save();
      console.log(ride);
      res.status(201);
      res.send(ride);
    }
  });

  const getRides = ((req, res) => {
    const query = {};
    query.userId = req.decoded.id;
    if (req.query.program) {
      query.program = req.query.program;
    }
    Ride.find(query, (err, rides) => {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        let returnRides = [];
        rides.forEach((ride) => {
          let newRide = ride.toJSON();
          newRide.links = {};
          newRide.links.self = 'http://' + req.headers.host + '/api/rides/' + newRide._id;
          returnRides.push(newRide);
        });
        res.json(returnRides);
      }
    });
  });

  const getRide = ((req, res) => {
    let returnRide = req.ride.toJSON();
    returnRide.links = {};
    const newLink = `http://${req.headers.host}/api/rides?program=${returnRide.program}`;
    const otherLink = encodeURI(newLink);
    returnRide.links.FilterByThisProgram = otherLink;
    res.json(returnRide);
  });

  const putRide = ((req, res) => {
    req.ride.userId = req.body.userId;
    req.ride.program = req.body.program;
    req.ride.date = req.body.date;
    req.ride.duration = req.body.duration;
    req.ride.weight = req.body.weight;
    req.ride.level = req.body.level;
    req.ride.distance = req.body.distance;
    req.ride.calories = req.body.calories;
    req.ride.notes = req.body.notes;
    req.ride.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(req.ride);
      }
    });
  });

  const patchRide = ((req, res) => {
    if (req.body._id) {
      delete req.body._id;
    }
    for (let p in req.body) {
      req.ride[p] = req.body[p];
    }

    req.ride.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(req.ride);
      }
    });
  });

  const deleteRide = ((req, res) => {
    req.ride.remove((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send('Removed');
      }
    });
  });

  return {
    post: post,
    getRides: getRides,
    getRide: getRide,
    putRide: putRide,
    patchRide: patchRide,
    deleteRide: deleteRide
  };
};

module.exports = rideController;
