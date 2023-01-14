const Orders = require("../../../schemas/Orders");

async function fetchInvoice({ store_id }) {
  try {
    const result = await Orders.find({ store_id });
    const results = result.filter(
      ({ delivery_method }) => delivery_method === "Invoice"
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
