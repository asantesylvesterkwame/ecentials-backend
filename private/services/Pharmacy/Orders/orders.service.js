const router = require("express").Router();
const Orders = require("../../../../private/schemas/Orders");

async function cancelOrder({ req }) {
  const { order_code } = req.body;

  try {
    const result = await Orders.updateOne(
      { order_code },
      { $set: { order_status: "Cancelled" } }
    );

    if (result != null) {
      return { message: "success", data: result };
    }
    return { message: "Failed to create checkout item.", data: err };
  } catch (error) {
    return { message: "Failed to create checkout item.", data: error };
  }
}

module.exports = {
  cancelOrder,
};
