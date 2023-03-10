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

async function deleteInvoice(req) {
  try {
    await Invoice.findByIdAndDelete(req.body.invoice_id);
    return { status: "success", message: "invoice deleted successfully" };
  } catch (error) {
    return { status: "error", message: "an error occurred" };
  }
}

async function searchInvoice(req) {
  try {
    const searchText = req.body.searchText;
    const filter = {
      $or: [
        { customer_name: { $regex: searchText, $options: "i" } },
        { invoice_number: { $regex: searchText, $options: "i" } },
        { order_code: { $regex: searchText, $options: "i" } },
        { payment_status: { $regex: searchText, $options: "i" } },
        { order_status: { $regex: searchText, $options: "i" } },
      ],
    };
    const result = await Invoice.find(filter);
    return {
      status: "success",
      message: "data retrieved successfully",
      data: result,
    };
  } catch (error) {
    return {
      status: "error",
      message: "an error occurred",
    };
  }
}

module.exports = { fetchInvoice, addInvoice, deleteInvoice, searchInvoice };
