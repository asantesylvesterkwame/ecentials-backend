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

module.exports = {
  uploadPrescription,
};
