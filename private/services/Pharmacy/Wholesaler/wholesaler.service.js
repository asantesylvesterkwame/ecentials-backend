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
    return { status: "error", message: "an error occurred" };
  }
}

async function updateWholesaler({ req }) {
  try {
    await Wholesaler.findByIdAndUpdate(req.body.wholesaler_id, { ...req.body });
    return { status: "success", message: "wholesaler updated successfully" };
  } catch (error) {
    return { status: "error", message: "an error occurred" };
  }
}

/**
 * searchWholesaler returns a seller matching a text
 */
async function searchWholesaler(req) {
  try {
    const { searchText } = req.query;
    const filter = {
      $or: [
        { name: { $regex: searchText, $options: "i" } },
        { email: { $regex: searchText, $options: "i" } },
        { city: { $regex: searchText, $options: "i" } },
        { region: { $regex: searchText, $options: "i" } },
        { country: { $regex: searchText, $options: "i" } },
      ],
    };
    const result = await Wholesaler.find(filter);
    return {
      status: "success",
      message: "data retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new Error(`could not retrieve wholesaler. ${error}`);
  }
}

module.exports = {
  createWholesaler,
  fetchWholesaler,
  deleteWholesaler,
  updateWholesaler,
  searchWholesaler,
};
