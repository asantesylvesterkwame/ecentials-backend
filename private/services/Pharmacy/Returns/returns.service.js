const { Data } = require("@react-google-maps/api");
const Drug = require("../../../schemas/Drug");
const Orders = require("../../../schemas/Orders");
const Returns = require("../../../schemas/Returns");

async function addReturns({ store_id, invoice_number }) {
  const invoice_num = invoice_number;
  try {
    const result = await Orders.find({ store_id });
    const results = result.filter(
      ({ invoice_number }) => invoice_number == invoice_num
    );
    const newresults = await Returns.create({
      invoice_number,
    });

    results[0].products_summary.forEach(async (item) => {
      // reduce total drug stock
      await Drug.updateOne(
        {
          _id: item.drug_id,
        },
        {
          $inc: { total_stock: +item.quantity },
        }
      );
    });

    return { message: "success" };
  } catch (error) {
    return { message: error };
  }
}

async function fetchReturns({ store_id }) {
  let newResults = [];
  try {
    const results = await Returns.find({ store_id });
    for (let result of results) {
      newResults.push(await Orders.find({ ...result.invoice_number }));
      // console.log(result.invoice_number);
    }
    return { message: "success", data: newResults[0] };
  } catch (error) {
    return { message: error };
  }
}

module.exports = { addReturns, fetchReturns };
