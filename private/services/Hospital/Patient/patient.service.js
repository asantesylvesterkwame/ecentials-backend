/* eslint-disable no-underscore-dangle */

const { HospitalPatientException } = require("../../../exceptions/hospital");
const { encryptPassword } = require("../../../helpers/functions");
const generateRandomPassword = require("../../../helpers/random_password");
const Patient = require("../../../schemas/Patient");
const User = require("../../../schemas/User");

async function addExistingEcentialsUserAsPatient(req) {
  try {
    const result = await Patient.create({
      hospital: req.params.hospitalId,
      patient: req.body.userId,
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to register ecentials' user as patient",
      };
    }
    return {
      status: "success",
      message: "ecentials's user registered as patient successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalPatientException(
      `could not add ecentials user as patient. ${error}`
    );
  }
}

async function registerNewPatient({ req }) {
  try {
    let { email } = req.body;
    if (!email) {
      email = `${req.body.personal.phoneNumber}@gmail.com`;
    }
    const password = generateRandomPassword(14);

    const user = await User.create({
      ...req.body,
      email,
      password: encryptPassword(password),
    });

    if (!user) {
      return {
        status: "failed",
        message: "failed to register patient",
      };
    }

    const result = await Patient.create({
      hospital: req.params.hospitalId,
      patient: user._id,
    });

    if (!result) {
      return {
        status: "failed",
        message: "failed to register patient",
      };
    }
    return {
      status: "success",
      message: "successfully registered new patient",
      data: result,
    };
  } catch (error) {
    throw new HospitalPatientException(
      `could not register new patient. ${error}`
    );
  }
}

module.exports = {
  addExistingEcentialsUserAsPatient,
  registerNewPatient,
};
