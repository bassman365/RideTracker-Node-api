'use strict';
const express = require('express');
const User = require('../models/userModel');
const authController = require('../controllers/authenticateController')(User);
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const middleware =  require('../common/middleware');

const routes = function () {
  let authRouter = express.Router();

  authRouter.use('/renew', middleware.tokenIsValid);

  authRouter.route('/renew')
    .post(authController.postRenew);

  authRouter.use('/', [
    sanitize('email')
      .trim()
      .normalizeEmail({ remove_dots: false }),
    check('email')
      .not().isEmpty()
      .isEmail()
      .withMessage('Email is required and must be a valid email'),
    check('password')
      .not().isEmpty()
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(x => x.msg);
      return res.status(422).json({ success: false, message: messages.join(', ') });
    }
    const validatedUser = matchedData(req);
    req.validatedUser = validatedUser;
    next();
  });

  authRouter.route('/')
    .post(authController.post);

  return authRouter;
};

module.exports = routes;
