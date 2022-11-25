const { encryptPassword } = require("../../../helpers/functions");
const Staff = require("../../../schemas/Staff");
const { uploadFile } = require("../../Firebase/imageUpload.service");

// get all the staff registered to a pharmacy
async function getPharmacyStaff({ facility_id }) {
  try {
    const results = await Staff.find({ facility_id });
    return { message: "success", data: results };
  } catch (error) {
    return { message: "An error occurred. Please try again." };
  }
}

// create a new pharmacy staff
async function createPharmacyStaff({ req }) {
  try {
    const employee_id = _generateEmployeeID(req);

    const photo_url = await uploadFile(
      req.files["photo"][0],
      `pharmacyStaff/${employee_id}`
    );
    const cv_url = await uploadFile(
      req.files["cv"][0],
      `pharmacyStaff/${employee_id}`
    );
    const certificate_url = await uploadFile(
      req.files["certificate"][0],
      `pharmacyStaff/${employee_id}`
    );

    const result = await Staff.create({
      ...req.body,
      photo: photo_url,
      cv: cv_url,
      certificate: certificate_url,
      password: encryptPassword(req.body.password),
    });

    if (result != null) {
      return { message: "success", data: result };
    }

    return { message: "failed to add new staff, please try again." };
  } catch (error) {
    return { message: "an error occurred, please try again ", error };
  }
}

function _generateEmployeeID(req) {
  let id = req.body.first_name.substring(0, 1) + req.body.last_name;
  return id + (Math.floor(Math.random() * 1000) + 1).toString();
}

// get a count of the pharmacy staffs
async function getPharmacyStaffCount({ req }) {
  try {
    const staffCount = await Staff.find({
      facility_id: req.body.facility_id,
      facility_type: req.body.facility_type,
    }).count();

    return { message: "success", count: staffCount };
  } catch (error) {
    return { message: "an error occurred, please try again." };
  }
}

module.exports = {
  getPharmacyStaff,
  createPharmacyStaff,
  getPharmacyStaffCount,
};
