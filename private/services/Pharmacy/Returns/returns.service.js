const Drug = require("../../../schemas/Drug");
const Invoice = require("../../../schemas/Invoice");
const Orders = require("../../../schemas/Orders");
const Returns = require("../../../schemas/Returns");

async function addReturns({ req }) {
  const { invoice_number, store_id } = req.body;
  console.log(invoice_number, store_id);
  try {
    const invoices = Invoice.find({
      store_id,
      invoice_number,
    });
    const orders = Orders.find({ store_id, invoice_number });
    const [invoicesRes, ordersRes] = await Promise.all([
      invoices.exec(),
      orders.exec(),
    ]);

    const newData = [...invoicesRes, ...ordersRes];
    if (newData.length === 0) {
      return {
        status: "success",
        message: `No order found with the invoice number ${invoice_number}`,
      };
    } else {
      const exist = await Returns.find({ invoice_number });
      if (exist.length === 0) {
        newData.length !== 0 &&
          (await Returns.create({ invoice_number, store_id }));
        newData[0].products_summary.forEach(async ({ drug_id, quantity }) => {
          await Drug.updateOne(
            {
              _id: drug_id,
            },
            {
              $inc: { total_stock: +quantity },
            }
          );
        });
      } else {
        return { status: "success", message: "Order already returned" };
      }
    }
    return {
      status: "success",
      message: "sales data retrieved successfully",
      data: newData,
    };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

async function fetchReturns({ store_id }) {
  let newResults = [];
  try {
    const results = await Returns.find({ store_id });
    for (let result of results) {
      newResults.push(await Orders.find({ ...result.invoice_number }));
      newResults.push(await Invoice.find({ ...result.invoice_number }));
      // console.log(result.invoice_number);
    }
    return { message: "success", data: results };
  } catch (error) {
    return { message: error };
  }
}
module.exports = { addReturns, fetchReturns };
