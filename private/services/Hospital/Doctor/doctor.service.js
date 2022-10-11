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


module.exports = {
    getDoctorsInHospital,
}
