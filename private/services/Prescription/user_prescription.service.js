// this service allows a user to upload a

const Prescription = require("../../schemas/Prescription");
const { uploadImage } = require("../Firebase/imageUpload.service");

// pescription to pharmacy
async function uploadPrescription({ user_id, store_id, file }) {
  try {
    const image = await uploadImage(file);
    
    const result = await Prescription.create({
      user_id,
      store_id,
      image,
    });

    return { message: "success", data: result };
  } catch (error) {
    return { message: "Something went wrong" };
  }
}


// retrieve prescriptions for a user
async function getUserPrescription({ user_id }) {
  try {
    const results = await Prescription.find({ user_id });

    if (results != null) {
      return { message: "success", data: results };
    }
    return { message: "No prescriptions found", data: [] };
  } catch (error) {
    return { message: "An error occurred. Please try again"}
  }
}


module.exports = {
  uploadPrescription,
  getUserPrescription
};
