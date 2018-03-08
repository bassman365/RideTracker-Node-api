'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

const authController = (User) => {
  const post = ((req, res) => {

    User.findOne({
      email: req.validatedUser.email
    }, function (err, user) {

      if (err) throw err;

      if (!user) {
        res.status(401);
        res.json({ success: false, message: 'Authentication failed. Invalid email or password.' });
      } else if (user) {
        bcrypt.compare(req.validatedUser.password, user.password).then(function (result) {
          const passwordsMatch = result;
          if (!passwordsMatch) {
            res.status(401);
            res.json({
              success: false,
              message: 'Authentication failed. Invalid email or password.'
            });
          } else {
            // Make sure the user has been verified
            if (!user.isVerified) {
              return res.status(401).send({
                type: 'not-verified',
                success: false,
                message: 'Your account has not been verified.'
              });
            }

            const payload = {
              id: user.id,
              roles: user.roles,
            };
            const token = jwt.sign(payload, config.secret, {
              expiresIn: '24h'
            });

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Sign In Successful',
              token: token
            });
          }
        }).catch(function (resultErr) {
          console.log(resultErr);
          //TODO handle error
        });
      }
    });
  });

  return {
    post: post,
  };
};

module.exports = authController;
