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

  const postRenew = ((req, res) => {
    User.findById(req.decoded.id, (err, user) => {
      if (err) throw err;

      if (!user.roles.includes('renewable')) {
        return res.status(401).send({
          success: false,
          message: 'renewal failed'
        });
      }

      const tempPayload = Object.assign({}, req.decoded);
      delete tempPayload.iat;
      delete tempPayload.exp;
      delete tempPayload.nbf;
      delete tempPayload.jti;
      delete tempPayload.roles;

      const payload = Object.assign({}, tempPayload, {roles: user.roles});

      const token = jwt.sign(payload, config.secret, {
        expiresIn: '4d'
      });

      res.status(200).send({
        success: true,
        message: 'Renew Successful',
        token: token
      });

    });
  });

  return {
    post: post,
    postRenew: postRenew
  };

};

module.exports = authController;
