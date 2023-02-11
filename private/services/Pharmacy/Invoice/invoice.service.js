const Drug = require("../../../schemas/Drug");
const Invoice = require("../../../schemas/Invoice");
const Orders = require("../../../schemas/Orders");
const {
  generateOrderCode,
  generateInvoiceNumber,
  // fetchLastInvoiceNumber,
} = require("../../User/Orders/orders.service");

async function fetchInvoice({ store_id }) {
  try {
    const result = await Invoice.find({ store_id }).sort({ createdAt: -1 });

    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

async function addInvoice({ req }) {
  const { name } = req.body;

  try {
    const order_code = await generateOrderCode("INVOICE", name);
    const invoice_number = generateInvoiceNumber();
    await Invoice.create({
      ...req.body,
      order_code,
      invoice_number,
    });
    const { products_summary } = req.body;
    products_summary.forEach(
      async ({ _id, quantity }) =>
        await Drug.updateOne(
          {
            _id: _id,
          },
          { $inc: { total_stock: -quantity } }
        )
    );

    return { message: "success" };
  } catch (error) {
    return { message: "Failed to add invoice.", data: error };
  }
}

module.exports = { fetchInvoice, addInvoice };
