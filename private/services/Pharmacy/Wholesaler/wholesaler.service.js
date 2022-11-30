const Customer = require("../../../schemas/Customers");

// Create new customer
async function createWholesaler({ req }) {
  try {
    const result = await Wholesaler.create({
      ...req.body,
    });
    if (result != null) {
      return { message: "success", data: result };
    }
    return { message: "failed to add new wholesaler, please try again." };
  } catch (error) {
    return { message: "an error occurred, please try again ", error };
  }
}

// Fetch Wholesalers information
async function fetchWholesaler({ facility_id }) {
  try {
    const result = await Wholesaler.find({ facility_id });
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = { createWholesaler, fetchWholesaler };
