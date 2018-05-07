'use strict';

class ValidationError {
  constructor(severity, message) {
    this.severity = severity;
    this.message = message;
  }
}

const getErrorList = function (validationErrors) {
  const returnMessage = validationErrors.map((error) => {
    return error.message;
  });
  return returnMessage.join(', ');
};

module.exports = {
  ValidationError,
  getErrorList
};
