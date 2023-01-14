const Orders = require("../../../schemas/Orders");

async function fetchInvoice() {
  try {
    const result = await Orders.find();
    const results = result.filter(
      ({ delivery_method }) => delivery_method == "Pickup"
    );
    return { message: "success", data: results };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

async function AddInvoice({ req }) {
  try {
    const result = Orders.create({
      ...req.body,
    });
  } catch (error) {}
}

module.exports = { fetchInvoice };
