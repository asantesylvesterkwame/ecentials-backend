const Staff = require("../../../schemas/Staff");

// get all doctors in a hospital using the hospital
async function getDoctorsInHospital({ hospital_id, staff_type }) {
  try {
    const result = await Staff.find({ facility_id: hospital_id, staff_type });
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// get information about a doctor in a hospital
async function getDoctorInformaion({ doctor_id, hospital_id, staff_type }) {
  try {
    const result = await Staff.find({
      _id: doctor_id,
      facility_id: hospital_id,
      staff_type,
    }, { password: 0 });
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = {
  getDoctorsInHospital,
  getDoctorInformaion,
};
