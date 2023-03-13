const Wholesaler = require("../../../schemas/Wholesaler");

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
async function fetchWholesaler() {
  try {
    const result = await Wholesaler.find();
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

async function deleteWholesaler(req) {
  try {
    await Wholesaler.findByIdAndDelete(req.body.wholesaler_id);
    return { status: "success", message: "wholesaler deleted successfully" };
  } catch (error) {
    return { status: "error", message: "an error occurred" }
  }
}

module.exports = { createWholesaler, fetchWholesaler, deleteWholesaler };
