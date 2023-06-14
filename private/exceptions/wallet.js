/* eslint-disable max-classes-per-file */
class WalletException extends Error {
    constructor(message) {
      super(message);
      this.name = "WalletException";
    }
  }

module.exports = {
    WalletException,
}
