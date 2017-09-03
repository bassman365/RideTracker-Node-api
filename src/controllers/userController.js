'use strict';
const bcrypt = require('bcrypt');

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

  const setup = ((req, res) => {
  // create a sample user

    const saltRounds = 10;
    const userProvidedPassword = 'password';
    bcrypt.hash(userProvidedPassword, saltRounds, function(err, hash) {
      var nick = new User({
        name: 'Nick Cerminara',
        password: hash,
        admin: true
      });

      // save the sample user
      nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
      });
    });
  });

  return {
    getUsers: getUsers,
    setup : setup
  };
};

module.exports = userController;
