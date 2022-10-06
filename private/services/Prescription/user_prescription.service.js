// this service allows a user to upload a

const Prescription = require("../../schemas/Prescription");
const { uploadImage } = require("../Firebase/imageUpload.service");
const { getPharmacyDetails } = require("../Pharmacy/Information/information.service");

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

    // loop over the results obtained
    // and map the store id to the store name
    data = [];
    results.map(async (result) => {
      const store_detail = await getPharmacyDetails({ pharmacy_id: result["store_id"] });
      
      const store_name = store_detail.data["name"];
      data.push({ ...result._doc, store_name })
    });

    return { message: "success", data };
  } catch (error) {
    return { message: "An error occurred. Please try again"}
  }
}


// delete a prescription using the prescription id
async function deleteUserPrescription({ prescription_id, user_id }) {
  try {
    await Prescription.deleteOne({ _id: prescription_id, user_id });
    return { message: "success" };
  } catch (error) {
    return { message: "failed to delete prescription. please try again" };
  }
}


module.exports = {
  uploadPrescription,
  getUserPrescription,
  deleteUserPrescription
};
