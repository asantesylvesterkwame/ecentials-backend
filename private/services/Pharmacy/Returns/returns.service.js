const Orders = require("../../../schemas/Orders");
const Returns = require("../../../schemas/Returns");

async function fetchReturns({ store_id, invoice_number }) {
  try {
    const results = Orders.find({ store_id, invoice_number });
    const {
      store_id,
      order_code,
      invoice_number,
      payment_type,
      grand_total,
      delivery_method,
    } = results;
    const result = Returns.create({
      store_id,
      order_code,
      invoice_number,
      payment_type,
      grand_total,
      delivery_method,
    });
    return { message: result };
  } catch (error) {
    return { message: error };
  }
}

module.exports = { fetchReturns };
