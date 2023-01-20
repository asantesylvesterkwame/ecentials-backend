const Invoice = require("../../../schemas/Invoice");
const Orders = require("../../../schemas/Orders");

async function fetchSalesPayment({ req }) {
  try {
    const invoices = Invoice.find({ fulfilled: true, ...req.body });
    const orders = Orders.find({ fulfilled: true, ...req.body });
    const [invoicesRes, ordersRes] = await Promise.all([
      invoices.exec(),
      orders.exec(),
    ]);

    return {
      status: "success",
      message: "sales data retrieved successfully",
      data: [...invoicesRes, ...ordersRes],
    };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

module.exports = { fetchSalesPayment };
