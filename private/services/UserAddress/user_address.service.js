const UserShippingAddress = require("../../schemas/UserAddress");

// retrieve all user added addresses
async function getUserShippingAddresses({ user_id }) {
  try {
    const results = await UserShippingAddress.find({ user_id });

    if (results != null) {
      return { message: "success", data: results };
    }
    return { message: "No addresses found", data: [] };
  } catch (error) {
    return { message: "An error occurred. Please try again" };
  }
}

// add a new address for a user
async function addNewShippingAddress({
  user_id,
  name_of_recipient,
  mobile,
  street_name,
  town,
  district = "",
  region = "",
}) {
  try {
    const result = await UserShippingAddress.create({
      user_id,
      name_of_recipient,
      mobile,
      street_name,
      town,
      district,
      region,
    });

    if (result != null) {
        return { message: "success", data: result };
    }
    return { message: "Could not add address. Try again later" };
  } catch (error) {
    return { message: "An error occurred. Please try again later" };
  }
}

module.exports = {
  getUserShippingAddresses,
  addNewShippingAddress,
};
