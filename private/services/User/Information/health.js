const User = require("../../../schemas/User");
/**
 * Returns the allergies of a user
 * */
async function getAllergies(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findById(req.user._id);
    if (result === null) {
      return {
        status: "failed",
        message: "failed to fetch allergies",
      };
    }
    return {
      status: "success",
      message: "retrieved allergies successfully",
      data: result.health.allergies,
    };
  } catch (e) {
    throw new Error("failed to retrieve allergies");
  }
}

/**
 * editAllergies edits a user's allergies
 * */
async function editAllergies(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findByIdAndUpdate(req.user._id, {
      $set: { "health.allergies": req.body.allergies },
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to edit allergies",
      };
    }
    return {
      status: "success",
      message: "allergies edited successfully",
    };
  } catch (e) {
    throw new Error("failed to edit allergies");
  }
}

module.exports = {
  getAllergies,
  editAllergies,
};
