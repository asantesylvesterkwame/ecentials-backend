class UserHealthInformationException extends Error {
  constructor(message) {
    super(message);
    this.name = "UserHealthInformationException";
  }
}

module.exports = {
  UserHealthInformationException,
};
