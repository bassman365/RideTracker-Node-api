'use strict';
const express = require('express');
const ProgramCollection = require('../models/programCollectionModel');
const programCollectionController = require('../controllers/programCollectionController')(ProgramCollection);
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

const routes = function () {
  let programCollectionRouter = express.Router();

  programCollectionRouter.post('/', [
    check('name')
      .exists()
      .withMessage('name is required'),
    check('programs')
      .exists()
      .isLength({ min: 1 })
      .withMessage('please include a program'),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const validatedProgramCollection = matchedData(req);
    req.validatedProgramCollection = validatedProgramCollection;
    next();
  });

  programCollectionRouter.route('/')
    .post(programCollectionController.postProgramCollections)
    .get(programCollectionController.getProgramCollections);

  programCollectionRouter.use('/:programCollectionId', function (req, res, next) {
    ProgramCollection.findById(req.params.programCollectionId, (err, programCollection) => {
      if (err) {
        res.status(500).send(err);
      } else if (programCollection) {
        req.programCollection = programCollection;
        next();
      } else {
        res.status(404).send('No Program Collection Found');
      }
    });
  });

  programCollectionRouter.put('/:programCollectionId', [
    check('name')
      .exists()
      .withMessage('name is required'),
    check('programs')
      .exists()
      .isLength({ min: 1 })
      .withMessage('please include a program'),
    check('programs.*.name').exists(),
    check('programs.*.hexColor').exists()
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const validatedProgramCollection = matchedData(req);
    req.validatedProgramCollection = validatedProgramCollection;
    next();
  });

  programCollectionRouter.route('/:programCollectionId')
    .get(programCollectionController.getProgramCollection)
    .put(programCollectionController.putProgramCollection)
    .delete(programCollectionController.deleteProgramCollection);

  return programCollectionRouter;
};

module.exports = routes;
