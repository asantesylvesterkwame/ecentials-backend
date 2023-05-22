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
 * getPreventiveCare returns a user's preventive care
 */
async function getPreventiveCare(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findById(req.user._id);
    if (!result) {
      return {
        status: "failed",
        message: "failed to retrieve preventive care",
      };
    }
    return {
      status: "success",
      message: "preventive care retrieved successfully",
      data: result.health.preventive_care,
    };
  } catch (error) {
    throw new Error(`could not get preventive care. ${error}`);
  }
}

/**
 * updatePreventiveCare updates a user's preventive care
 */
async function updatePreventiveCare(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findByIdAndUpdate(req.user._id, {
      $set: { "health.preventive_care": req.body.preventive_care },
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to update preventive care",
      };
    }
    return {
      status: "success",
      message: "successfully updated preventive care",
    };
  } catch (error) {
    throw new Error(`could not update preventive care. ${error}`);
  }
}

module.exports = {
  getMedicalConditions,
  updateMedicalConditions,
  getPreventiveCare,
  updatePreventiveCare,
};
