'use strict';
const express = require('express');
const User = require('../models/userModel');
const userController = require('../controllers/userController')(User);
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const middleware = require('../common/middleware');

const routes = function () {
  let userRouter = express.Router();

  userRouter.use('/signup', [
    sanitize('name')
      .trim(),
    sanitize('email')
      .trim()
      .normalizeEmail({ remove_dots: false }),
    check('name')
      .not().isEmpty()
      .withMessage('Name is required'),
    check('email')
      .not().isEmpty()
      .isEmail()
      .withMessage('Email is required and must be a valid email'),
    check('password')
      .not().isEmpty()
      .matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
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

  // userRouter.route('/setup')
  //   .get(userController.setup);

  userRouter.route('/signup')
    .post(userController.postSignup);

  userRouter.route('/confirmation/:verificationToken')
    .post(userController.postConfirmation);

  userRouter.route('/resend')
    .post(userController.postResend);

  userRouter.route('/')
    .get(userController.getUsers);

  return userRouter;
};

module.exports = routes;
