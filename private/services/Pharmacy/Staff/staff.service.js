const { encryptPassword } = require("../../../helpers/functions");
const Staff = require("../../../schemas/Staff");
const { uploadFile } = require("../../Firebase/imageUpload.service");
const ObjectId = require("mongoose").Types.ObjectId;
const AccountID = require("../../../schemas/AccountID");
const StaffAccount = require("../../../helpers/staff_account_created");
const sendMail = require("../../send_email");


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
      employee_id,
    });

    if (result != null) {
      await _sendEmail({
        email: req.body.email,
        password: req.body.password, 
        accountID: employee_id,
        staffID: result._id
      });

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

async function _sendEmail({ email, password, accountID, staffID }) {
  let mail_body = StaffAccount(
    accountID,
    password,
    "imgs/logo_ios.png",
    "not-me-password-reset"
  );
  sendMail(email, mail_body)
    .then((result) => {
      // create a record for the accountID which would be later
      // used for verification.
      AccountID.create(
        { account_id: accountID, staff: staffID },
        (err, _) => {
          if (err) {
            throw new Error("failed to save account id");
          }
        }
      );
    })
    .catch((err) => {
      throw Error("failed to send mail");
    });
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

// update pharmacy staff information
async function updatePharmacyStaffInformation({ req }) {
  try {
    let update_data = {
      ...req.body,
    };

    if (req.files["photo"]) {
      const photo_url = await uploadFile(
        req.files["photo"][0],
        `pharmacyStaff/${req.body.employee_id}`
      );
      update_data.photo = photo_url;
    }

    if (req.files["cv"]) {
      const cv_url = await uploadFile(
        req.files["cv"][0],
        `pharmacyStaff/${req.body.employee_id}`
      );
      update_data.cv = cv_url;
    }

    if (req.files["certificate"]) {
      const certificate_url = await uploadFile(
        req.files["certificate"][0],
        `pharmacyStaff/${req.body.employee_id}`
      );
      update_data.certificate = certificate_url;
    }

    const result = await Staff.updateOne(
      {
        facility_id: req.body.facility_id,
        employee_id: req.body.employee_id,
      },
      { ...update_data }
    );

    if (result.modifiedCount > 0) {
      return {
        status: "success",
        message: "update staff information successful",
      };
    }

    return { status: "failed", message: "failed to update staff information" };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

// terminate a staff
async function terminateStaff(req) {
  try {
    const result = await Staff.updateOne(
      {
        facility_id: ObjectId(req.body.facility_id),
        _id: ObjectId(req.body.staff_id),
      },
      { $set: { terminated: true } }
    );
    if (result.modifiedCount > 0) {
      return { status: "success", message: "staff successfully terminated" };
    }
    return { status: "failed", message: "failed to terminate staff" };
  } catch (error) {
    return { status: "error", message: "error occurred, please try again" };
  }
}

module.exports = {
  getPharmacyStaff,
  createPharmacyStaff,
  getPharmacyStaffCount,
  updatePharmacyStaffInformation,
  terminateStaff,
};
