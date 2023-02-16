// this service allows a user to upload a

const Prescription = require("../../schemas/Prescription");
const { uploadFile } = require("../Firebase/imageUpload.service");
const { getPharmacyDetails } = require("../Pharmacy/Information/information.service");

const ObjectId = require('mongoose').Types.ObjectId;

// pescription to pharmacy
async function uploadPrescription({ user_id, store_id, file }) {
  try {
    const image = await uploadFile(file, "images");
    
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

    for (let i = 0; i < results.length; i++) {
      const prescription = results[i];
      const store_detail = await getPharmacyDetails({ pharmacy_id: prescription["store_id"] });
      const store_name = store_detail.data.name;

      data.push({ ...prescription._doc, store_name })
    }  
    return { message: "success", data };
  } catch (error) {
    return { message: "An error occurred. Please try again", error }
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

// get all prescriptions sent to a particular pharmacy
async function getPrescriptionsSentToPharmacy(req) {
  try {
    const result = await Prescription.aggregate([
      { $match: { store_id: ObjectId(req.body.store_id) }},
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          status: 1,
          image: 1,
          "user_id": '$user._id',
          "user_name": '$user.personal.name',
          "user_phone": '$user.personal.phone',
          'user_email': '$user.email',
          'user_address': '$user.personal.address'
        }
      }
    ])
    return { status: 'success', message: 'retrieved successfully', data: result };
  } catch (error) {
    return { status: 'error', message: 'an error occurred, please try again' };
  }
}

module.exports = {
  uploadPrescription,
  getUserPrescription,
  deleteUserPrescription,
  getPrescriptionsSentToPharmacy
};
