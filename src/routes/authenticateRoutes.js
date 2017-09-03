'use strict';
const express = require('express');
const User = require('../models/userModel');
const authController = require('../controllers/authenticateController')(User);

const routes = function () {
  let authRouter = express.Router();
  authRouter.route('/')
    .post(authController.post);

  return authRouter;
};

module.exports = routes;
