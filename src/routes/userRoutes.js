'use strict';
const express = require('express');
const User = require('../models/userModel');
const userController = require('../controllers/userController')(User);

const routes = function () {
  let userRouter = express.Router();
  userRouter.route('/')
    .get(userController.getUsers);

  userRouter.route('/setup')
    .get(userController.setup);

  return userRouter;
};

module.exports = routes;
