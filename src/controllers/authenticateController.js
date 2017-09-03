'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

const authController = (User) => {

  const post = ((req, res) => {
    User.findOne({
      name: req.body.name
    }, function (err, user) {

      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, hash) {
          if (err) throw err;
          //TODO handle err better
          const passwordsMatch = hash;
          if (!passwordsMatch) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {
            // if user is found and password is right
            // create a token
            const payload = {
              isAdmin: user.admin,
              name: user.name
            };
            const token = jwt.sign(payload, config.secret, {
              expiresIn: '24h' // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }
        });
      }
    });
  });

  return {
    post: post,
  };
};

module.exports = authController;
