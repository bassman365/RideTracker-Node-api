'use strict';
const API_WELCOME = 'Welcome to my Ride Api!';
const PROGRAM_REQUIRED = 'program is required';
const USER_ID_REQUIRED = 'userId is required';
const USER_EMAIL_IN_USE = 'The email address you have entered is already associated with another account.';
const VERIFICATION_TOKEN_NOT_FOUND = 'We were unable to find a valid token. Your token may have expired.';

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

  static get USER_EMAIL_IN_USE() {
    return USER_EMAIL_IN_USE;
  }

  static get VERIFICATION_TOKEN_NOT_FOUND() {
    return VERIFICATION_TOKEN_NOT_FOUND;
  }
}

module.exports = Messages;
