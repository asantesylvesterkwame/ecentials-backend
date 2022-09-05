const Lab = require("../../schemas/Lab");

// create a new lab using information about the lab
async function createNewLab({
  name,
  address,
  opening_hours,
  phone_numbers,
  gps_address,
  hospital_id = null,
}) {
  try {
    const results = await Lab.create({
      name,
      address,
      opening_hours,
      phone_numbers,
      gps_address,
      hospital_id,
    });

    if (results == null) {
        return { message: "Failed to create lab. Please try again"};
    }
    return { message: "success", data: results };
  } catch (error) {
      return { message: "An error occurred, could not create lab."}
  }
}



module.exports = {
    createNewLab
}
