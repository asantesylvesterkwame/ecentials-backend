/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */

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
async function addNewShippingAddress({ req }) {
  try {
    if (req.body.primary_address) {
      await UserShippingAddress.updateMany({
        user_id: req.user._id,
        primary_address: false,
      });
    }

    const result = await UserShippingAddress.create({
      user_id: req.user._id,
      ...req.body,
    });

    if (result != null) {
      return { message: "success", data: result };
    }
    return { message: "Could not add address. Try again later" };
  } catch (error) {
    return { message: "An error occurred. Please try again later" };
  }
}

async function updateShippingAddress({ req }) {
  try {
    if (req.body.primary_address) {
      await UserShippingAddress.updateMany({
        user_id: req.user._id,
        primary_address: false,
      });
    }

    const result = await UserShippingAddress.updateOne(
      {
        _id: req.body.address_id,
        user_id: req.user._id,
      },
      // eslint-disable-next-line prettier/prettier
      { ...req.body }
    );

    if (result.matchedCount > 0) {
      return { message: "success" };
    }

    return { message: "failed to update shipping address, please try again" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

async function deleteShippingAddress({ req }) {
  try {
    await UserShippingAddress.deleteOne({
      _id: req.body.address_id,
      user_id: req.user._id,
    });

    return { message: "success" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = {
  getUserShippingAddresses,
  addNewShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
