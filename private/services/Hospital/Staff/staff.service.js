/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const { HospitalStaffException } = require("../../../exceptions/hospital");
const {
  generateEmployeeID,
  sendAccountCreationEmail,
} = require("../../../helpers/employee_account");
const { encryptPassword } = require("../../../helpers/functions");
const getFacility = require("../../../helpers/get_facility");
const Staff = require("../../../schemas/Staff");
const { uploadFile } = require("../../Firebase/imageUpload.service");

/**
 * createHospitalStaff creates a new hospital staff
 */
async function createHospitalStaff({ req }) {
  //   try {
  const employeeId = generateEmployeeID(
    req.body.first_name,
    req.body.last_name
  );

  const cvUrl = await uploadFile(
    req.files.cv[0],
    `hospitalStaff/${req.body.facility_id}/${employeeId}`
  );

  const certificateUrl = await uploadFile(
    req.files.certificate[0],
    `hospitalStaff/${req.body.facility_id}/${employeeId}`
  );

  const photoUrl = await uploadFile(
    req.files.photo[0],
    `hospitalStaff/${req.body.facility_id}/${employeeId}`
  );

  const result = await Staff.create({
    ...req.body,
    cv: cvUrl,
    certificate: certificateUrl,
    photo: photoUrl,
    password: encryptPassword(req.body.password),
    employee_id: employeeId,
  });

  const facility = await getFacility(
    req.body.facility_id,
    req.body.facility_type
  );

  if (result != null) {
    await sendAccountCreationEmail({
      email: req.body.email,
      password: req.body.password,
      accountID: employeeId,
      staffID: result._id,
      staff_name: req.body.first_name,
      facility_name: facility.name,
    });

    return {
      status: "success",
      message: "successfully added hospital staff",
      data: result,
    };
  }
  return {
    status: "failed",
    message: "failed to add hospital staff",
  };
  //   } catch (error) {
  //     throw new Error(`error adding new staff. ${error}`);
  //   }
}

async function getHospitalStaff(req) {
  try {
    const result = await Staff.find({ facility_id: req.body.hospitalId });
    if (!result) {
      return {
        status: "failed",
        message: "failed to retrieve hospital staff.",
      };
    }
    return {
      status: "success",
      message: "successfully retrieved hospital staff",
      data: result,
    };
  } catch (error) {
    throw new HospitalStaffException(`could not get staff. ${error}`);
  }
}

module.exports = {
  createHospitalStaff,
  getHospitalStaff,
};
