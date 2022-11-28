const Customer = require("../../../schemas/Customers");

// Create new customer
async function createCustomer({ req }) {
  try {
    const result = await Customer.create({
      ...req.body,
    });
    if (result != null) {
      return { message: "success", data: result };
    }
    return { message: "failed to add new Customer, please try again." };
  } catch (error) {
    return { message: "an error occurred, please try again ", error };
  }
}

// Fetch customers information
async function fetchCustomers({ facility_id }) {
  try {
    const result = await Customer.find({ facility_id });
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = { createCustomer, fetchCustomers };
