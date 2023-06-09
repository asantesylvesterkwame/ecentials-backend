/* eslint-disable no-underscore-dangle */
const { ObjectId } = require("mongoose").Types;

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

async function addPatientVisit({ req }) {
  try {
    const num = (Math.floor(Math.random() * 900000) + 100000).toString();

    const currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    const lastTwoDigitsOfYear = currentDate.getFullYear().toString().slice(-2);

    const visitNo = `${req.body.visitTypeCode}-${num}${month}${lastTwoDigitsOfYear}`;

    const result = await Patient.findByIdAndUpdate(req.params.patientId, {
      $push: {
        visits: {
          ...req.body,
          visitNo,
        },
      },
      $set: {
        updatedAt: currentDate,
      },
    });

    if (!result) {
      return {
        status: "failed",
        message: "could not add patient visit",
      };
    }

    return {
      status: "success",
      message: "patient visit added successfully",
    };
  } catch (error) {
    throw new HospitalPatientException(`could not add patient visit. ${error}`);
  }
}

async function searchPatientByPatientId(req) {
  try {
    const result = await Patient.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "user.uniqueId": req.query.patientId,
          hospital: ObjectId(req.params.hospitalId),
        },
      },
      {
        $project: {
          _id: 1,
          hospital: 1,
          createdAt: 1,
          updatedAt: 1,
          visits: 1,
          patientPersonalInfo: "$user.personal",
          patientHealthInfo: "$user.health",
          patientId: "$user.uniqueId",
        },
      },
    ]);
    if (!result) {
      return {
        status: "failed",
        message: "patient not found",
      };
    }
    return {
      status: "success",
      message: "patient found successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalPatientException(`patient not found. ${error}`);
  }
}

async function getPatientHealthHistory(req) {
  try {
    const result = await Patient.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "user.uniqueId": req.params.patientId,
          hospital: ObjectId(req.params.hospitalId),
        },
      },
      {
        $project: {
          patientHealthHistory: "$user.health_history",
          patientMedicalConditions: "$user.medical_conditions",
          patientId: "$user.uniqueId",
        },
      },
    ]);
    if (!result) {
      return {
        status: "failed",
        message: "patient not found",
      };
    }
    return {
      status: "success",
      message: "patient history retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalPatientException(
      `could not retrieve health history. ${error}`
    );
  }
}

module.exports = {
  addExistingEcentialsUserAsPatient,
  registerNewPatient,
  addPatientVisit,
  searchPatientByPatientId,
  getPatientHealthHistory,
};
