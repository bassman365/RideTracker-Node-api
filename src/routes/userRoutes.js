'use strict';
const express = require('express');
const User = require('../models/userModel');
const userController = require('../controllers/userController')(User);
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const middleware = require('../common/middleware');
const config = require('../config');

const routes = function () {
  let userRouter = express.Router();

  userRouter.use('/signup', [
    sanitize('email')
      .trim()
      .normalizeEmail({ remove_dots: false }),
    check('email')
      .not().isEmpty()
      .isEmail()
      .withMessage('Email is required and must be a valid email')
      .custom(value => {
        if(!config.approvedEmails.includes(value)){
          throw new Error('this email is not approved');
        } else{
          return true;
        }
      }),
    check('password')
      .not().isEmpty()
      .matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})') //eslint-disable-line  no-useless-escape
      .withMessage('passwords must be at least 8 characters and contain at least 1 from each of the following: lowercase letters, uppercase letters, numeric values and special characters')
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const validatedUser = matchedData(req);
    req.validatedUser = validatedUser;
    next();
  });

  userRouter.use('/resend', [
    sanitize('email')
      .trim()
      .normalizeEmail({ remove_dots: false }),
    check('email')
      .not().isEmpty()
      .isEmail()
      .withMessage('Email is required and must be a valid email')
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const validatedUser = matchedData(req);
    req.validatedUser = validatedUser;
    next();
  });

  userRouter.use('/confirmation/:verificationToken', [
    check('verificationToken')
      .not().isEmpty()
      .withMessage('verification token not provided'),
    sanitize('verificationToken')
      .trim(),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    const validatedVerificationToken = matchedData(req);
    req.verificationToken = validatedVerificationToken.verificationToken;
    next();
  });

  userRouter.route('/signup')
    .post(userController.postSignup);

  userRouter.route('/confirmation/:verificationToken')
    .post(userController.postConfirmation);

  userRouter.route('/resend')
    .post(userController.postResend);

  userRouter.use('/', middleware.tokenIsValid);
  userRouter.route('/')
    .get(userController.getUsers);

  userRouter.use('/:userId', function (req, res, next) {
    if (req.decoded.roles && req.decoded.roles.includes('admin')) {
      User.findById(req.params.userId, (err, user) => {
        if (err) {
          res.status(500).send(err);
        } else if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).send('No User Found');
        }
      });
    } else {
      res.status(401).send('Nope');
    }
  });

  userRouter.route('/:userId')
    .patch(userController.patchUserRole);

  return userRouter;
};

module.exports = routes;
