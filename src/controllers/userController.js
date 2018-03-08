'use strict';
const bcrypt = require('bcrypt');
const VerificationToken = require('../models/verificationToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../models/verificationToken');
const messages = require('../common/messages');
const config = require('../config');

const userController = (User) => {
  const sendVerificationEmail = ((req, res, user) => {
    let token = crypto.randomBytes(16).toString('hex');

    if (req.body.isMobile) {
      token = crypto.randomBytes(6).toString('base64');
      //remove characters that messup the stuff
      token = token.replace(/\//g, crypto.randomBytes(1).toString('hex'));
      token = token.replace(/\+/g, crypto.randomBytes(1).toString('hex'));
    }

    const verificationToken = new VerificationToken({
      _userId: user._id,
      token: token
    });

    //TODO log error return generic message
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

      let body = config.verificationEmailOptions.emailBody(req.headers.host, verificationToken.token);
      if (req.body.isMobile) {
        body = config.verificationEmailOptions.mobileEmailBody(verificationToken.token);
      }
      const mailOptions = {
        from: config.verificationEmailOptions.from,
        to: user.email,
        subject: config.verificationEmailOptions.subject,
        text: body
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          //TODO log error and return generic response
          return res.status(500).send({ message: err.message });
        }
        res.status(200).send({message: `A verification email has been sent to ${user.email}.`});
      });
    });
  });

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
    User.findOne({ email: req.validatedUser.email }, (err, user) => {

      // Make sure user doesn't already exist
      if (user) return res.status(400).send({ message: messages.USER_EMAIL_IN_USE });

      bcrypt.hash(req.validatedUser.password, config.saltRounds).then((hashedPassword) => {
        user = new User({
          name: req.validatedUser.name,
          email: req.validatedUser.email,
          password: hashedPassword
        });

        user.save((err) => {
          if (err) {
            //TODO log error return generic message
            return res.status(500).send({ message: err.message });
          }
          sendVerificationEmail(req, res, user);
        });
      }).catch((resultErr) => {
        console.log(resultErr);
        //TODO handle error
      });
    });
  });

  const postResend = ((req, res) => {
    User.findOne({ email: req.validatedUser.email }, function (err, user) {
      if (!user) return res.status(400).send({ message: 'We were unable to find a user with that email.' });
      if (user.isVerified) return res.status(400).send({ message: 'This account has already been verified. Please log in.' });

      sendVerificationEmail(req, res, user);
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
          //TODO log error return generic message
          if (err) { return res.status(500).send({ message: err.message }); }
          res.status(200).send({message: messages.VERIFICATION_SUCCESSFUL});
        });
      });
    });
  });

  return {
    getUsers: getUsers,
    postSignup: postSignup,
    postResend: postResend,
    postConfirmation: postConfirmation
  };
};

module.exports = userController;
