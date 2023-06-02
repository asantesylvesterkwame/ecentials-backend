/* eslint-disable max-classes-per-file */
class UserHealthInformationException extends Error {
  constructor(message) {
    super(message);
    this.name = "UserHealthInformationException";
  }
}

class UserAccountInformationException extends Error {
  constructor(message) {
    super(message);
    this.name = "UserAccountInformationException";
  }
}

module.exports = {
  UserHealthInformationException,
  UserAccountInformationException,
};
