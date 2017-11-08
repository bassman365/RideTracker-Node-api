'use strict';
const bcrypt = require('bcrypt');
const VerificationToken = require('../models/verificationToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../models/verificationToken');
const messages = require('../common/messages');
const config = require('../config');

const userController = (User) => {

  const getUsers = ((req, res) => {
    const query = {};
    // if (req.query.program) {
    //   query.program = req.query.program;
    // }
    User.find(query, (err, users) => {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        let returnUsers = [];
        users.forEach((element) => {
          let newUser = element.toJSON();
          newUser.links = {};
          //newUser.links.self = 'http://' + req.headers.host + '/api/rides/' + newUser._id;
          returnUsers.push(newUser);
        });
        res.json(returnUsers);
      }
    });
  });

  const postSignup = ((req, res) => {
    User.findOne({ email: req.validatedUser.email }, function (err, user) {

      // Make sure user doesn't already exist
      if (user) return res.status(400).send({ message: messages.USER_EMAIL_IN_USE });

      user = new User({
        name: req.validatedUser.name,
        email: req.validatedUser.email,
        password: req.validatedUser.password
      });

      user.save(function (err) {
        if (err) {
          return res.status(500).send({ message: err.message });
        }

        // Create a verification token for this user
        const verificationToken = new VerificationToken({
          _userId: user._id,
          token: crypto.randomBytes(16).toString('hex')
        });

        // Save the verification token
        verificationToken.save(function (err) {
          if (err) { return res.status(500).send({ message: err.message }); }

          const transporter = nodemailer.createTransport({
            host: config.nodeMailerOptions.host,
            port: config.nodeMailerOptions.port,
            secure: config.nodeMailerOptions.secure,
            auth: {
              user: config.nodeMailerOptions.auth.user,
              pass: config.nodeMailerOptions.auth.pass
            }
          });

          const mailOptions = {
            from: config.verificationEmailOptions.from,
            to: user.email,
            subject: config.verificationEmailOptions.subject,
            text: config.verificationEmailOptions.emailBody(req.headers.host, verificationToken.token)
          };

          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.status(500).send({ message: err.message });
            }
            res.status(200).send(`A verification email has been sent to ${user.email}.`);
          });
        });
      });
    });
  });

  const postConfirmation = ((req, res) => {
    // Find a matching token
    Token.findOne({ token: req.verificationToken }, function (err, token) {
      if (!token) return res.status(400).send({ type: 'not-verified', message: messages.VERIFICATION_TOKEN_NOT_FOUND });

      // If we found a token, find a matching user
      User.findOne({ _id: token._userId }, function (err, user) {
        if (!user) return res.status(400).send({ message: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', message: 'This user has already been verified.' });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) { return res.status(500).send({ message: err.message }); }
          res.status(200).send('The account has been verified. Please log in.');
        });
      });
    });
  });

  // const postResend = ((req, res) => {});

  const setup = ((req, res) => {
    // create a sample user
    const saltRounds = 10;
    const userProvidedPassword = 'abc123';
    bcrypt.hash(userProvidedPassword, saltRounds, function (err, hash) {
      //TODO use async for better peformance
      var testUser = new User({
        name: 'Test User',
        email: 'test@test.com',
        password: hash,
        admin: true
      });

      // save the sample user
      testUser.save(function (err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
      });
    });
  });

  return {
    getUsers: getUsers,
    setup: setup,
    postSignup: postSignup,
    postConfirmation: postConfirmation
  };
};

module.exports = userController;
