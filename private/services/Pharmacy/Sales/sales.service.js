const Orders = require("../../../schemas/Orders");

async function fetchSalesPayment({ req }) {
  try {
    const data = await Orders.find({ req });
    const result = data.filter(({ fulfilled }) => fulfilled === true);
    return { message: "success", data: result };
  } catch (error) {
    throw error;
  }
}

module.exports = { fetchSalesPayment };
