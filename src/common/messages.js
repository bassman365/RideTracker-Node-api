'use strict';
const API_WELCOME = 'Welcome to my Ride Api!';
const PROGRAM_REQUIRED = 'program is required';
const USER_ID_REQUIRED = 'userId is required';

class Messages {
  static get API_WELCOME() {
    return API_WELCOME;
  }

  static get PROGRAM_REQUIRED() {
    return PROGRAM_REQUIRED;
  }

  static get USER_ID_REQUIRED() {
    return USER_ID_REQUIRED;
  }
}

module.exports = Messages;
