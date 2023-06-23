class OrderException extends Error {
  constructor(message) {
    super(message);
    this.name = "OrderException";
  }
}

module.exports = {
  OrderException,
};
