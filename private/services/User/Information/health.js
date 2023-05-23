const User = require("../../../schemas/User");

/**
 * getMedicalConditions returns a user's medical condition
 */
async function getMedicalConditions(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findById(req.user._id);
    if (!result) {
      return {
        status: "failed",
        message: "could not retrieve medical conditions",
      };
    }
    return {
      status: "success",
      message: "successfully retrieved medical conditions",
      data: result.health.medical_conditions,
    };
  } catch (error) {
    throw new Error(`could not get medical conditions. ${error}`);
  }
}

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
 * updateMedicalConditions changes a user's medical conditions
 */
async function updateMedicalConditions(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findByIdAndUpdate(req.user._id, {
      $set: { "health.medical_conditions": req.body.medical_conditions },
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to update medical conditions",
      };
    }
    return {
      status: "success",
      message: "successfully updated medical conditions",
    };
  } catch (error) {
    throw new Error(`failed to update medical conditions. ${error}`);
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
  getMedicalConditions,
  updateMedicalConditions,
  getAllergies,
  editAllergies,
};
