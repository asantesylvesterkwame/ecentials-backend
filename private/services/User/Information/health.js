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
      message: "successfully updated allergies",
    };
  } catch (error) {
    throw new Error(`could not get preventive care. ${error}`);
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
  } catch (e) {
    throw new Error("failed to get allergies");
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

/**
 * getGynecologicalHistory return's a user's gynecological history
 */
async function getGynecologicalHistory(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findById(req.user._id);
    if (!result) {
      return {
        status: "failed",
        message: "failed to retrieve history",
      };
    }
    return {
      status: "success",
      message: "history retrieved successfully",
      data: result.health.gynecological_history,
    };
  } catch (e) {
    throw new Error(`failed to get history. {e}`);
  }
}

/**
 * updateGynecologicalHistory update's a user's gynecological history
 */
async function updateGynecologicalHistory(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findByIdAndUpdate(req.user._id, {
      $set: { "health.gynecological_history": req.body.gynecological_history },
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to update gynecological history",
      };
    }
    return {
      status: "success",
      message: "successfully updated gynecological history",
    };
  } catch (error) {
    throw new Error(`could not update gynecological history. ${error}`);
  }
}

module.exports = {
  getMedicalConditions,
  updateMedicalConditions,
  getAllergies,
  editAllergies,
  getPreventiveCare,
  updatePreventiveCare,
  getGynecologicalHistory,
  updateGynecologicalHistory,
};
