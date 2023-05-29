const User = require("../../../schemas/User");
const { uploadFile } = require("../../Firebase/imageUpload.service");

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
async function updatePreventiveCare({ req }) {
  try {
    let fileUrl;
    if (req.file) {
      // eslint-disable-next-line no-underscore-dangle
      fileUrl = await uploadFile(req.file, `${req.user._id}/preventiveCare/`);
    }
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findByIdAndUpdate(req.user._id, {
      $push: {
        "health.preventive_care": {
          ...req.body,
          result: fileUrl,
        },
      },
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

/**
 * getHealthIssues return's a user's gynecological history
 */
async function getHealthIssues(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findById(req.user._id);
    if (!result) {
      return {
        status: "failed",
        message: "failed to retrieve health issues",
      };
    }
    return {
      status: "success",
      message: "health issues retrieved successfully",
      data: result.health.issues,
    };
  } catch (e) {
    throw new Error(`failed to get health issues. {e}`);
  }
}

/**
 * updateHealthIssues updates a user's preventive care
 */
async function updateHealthIssues(req) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const result = await User.findByIdAndUpdate(req.user._id, {
      $set: { "health.issues": req.body.issues },
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to update health issues",
      };
    }
    return {
      status: "success",
      message: "successfully updated health issues",
    };
  } catch (error) {
    throw new Error(`could not update health issues. ${error}`);
  }
}

/**
 * getSexualHistory returns a user's sexual history
 */
async function getSexualHistory(req) {
  try {
    const result = await User.findById(req.user._id);
    if (!result) {
      return {
        status: "failed",
        message: "failed to get sexual history",
      };
    }
    return {
      status: "success",
      message: "sexual history successfully retrieved",
      data: result.health.sexualHistory,
    };
  } catch (error) {
    throw new Error(`could not get sexual history. ${error}`);
  }
}

async function updateSexualHistory(req) {
  try {
    const result = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        "health.sexualHistory.sexualPartners": req.body.sexualPartners,
        "health.sexualHistory.moreThanOneSexualPartner":
          req.body.moreThanOneSexualPartner,
      },
      $push: {
        "health.sexualHistory.history": req.body.history,
      },
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to update sexual history",
      };
    }
    return {
      status: "success",
      message: "successfully updated sexual history",
    };
  } catch (error) {
    throw new Error(`could not update sexual history. ${error}`);
  }
}

//  [{ immunization: String, result: File, filename: String }]
async function getImmunizations(req) {
  try {
    const result = await User.findById(req.user._id);
    if (!result) {
      return {
        status: "failed",
        message: "failed to retrieve immunizations",
      };
    }
    return {
      status: "success",
      message: "successfully retrieved immunizations",
      data: result.health.immunizations,
    };
  } catch (error) {
    throw new Error(`could not get immunizations. ${error}`);
  }
}

async function updateImmunizations(req) {
  try {
    let fileUrl;
    if (req.file) {
      fileUrl = await uploadFile(req.file, `${req.user._id}/immunizations/`);
    }
    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          "health.immunizations": {
            ...req.body,
            result: fileUrl
          }
        }
      }
    );
    if (!result) {
      return {
        status: "failed",
        message: "failed to update immunizations",
      };
    }
    return {
      status: "success",
      message: "successfully updated immunizations"
    };
  } catch (error) {
    throw new Error(`could not update immunizations. ${error}`);
  }
}

async function getSurgicalHistory(req) {
  try {
    const result = await User.findById(req.user._id);
    if (!result) {
      return {
        status: "failed",
        message: "failed to get surgical history",
      };
    }
    return {
      status: "success",
      message: "surgical history successfully retrieved",
      data: result.health.surgeries,
    };
  } catch (error) {
    throw new Error(`could not get surgical history. ${error}`);
  }
}

async function updateSurgicalHistory(req) {
  const date = new Date();
  try {
    const result = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        "health.surgeries": req.body.surgeries,
        "updatedAt": date,
      },
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to update surgical history",
      };
    }
    return {
      status: "success",
      message: "successfully updated surgical history",
    };
  } catch (error) {
    throw new Error(`could not update surgical history. ${error}`);
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
  getHealthIssues,
  updateHealthIssues,
  getSexualHistory,
  updateSexualHistory,
  getImmunizations,
  updateImmunizations,
  getSurgicalHistory,
  updateSurgicalHistory,
};
