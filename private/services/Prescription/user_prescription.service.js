/* eslint-disable  */

const Prescription = require("../../schemas/Prescription");
const { uploadFile } = require("../Firebase/imageUpload.service");
const {
  getPharmacyDetails,
} = require("../Pharmacy/Information/information.service");

const ObjectId = require("mongoose").Types.ObjectId;

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
    const results = await Prescription.find({ user_id }).sort({
      createdAt: -1,
    });

    // loop over the results obtained
    // and map the store id to the store name
    data = [];

    for (let i = 0; i < results.length; i++) {
      const prescription = results[i];
      const store_detail = await getPharmacyDetails({
        pharmacy_id: prescription["store_id"],
      });
      const store_name = store_detail.data.name;

      data.push({ ...prescription._doc, store_name });
    }
    return { message: "success", data };
  } catch (error) {
    return { message: "An error occurred. Please try again", error };
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
      { $match: { store_id: ObjectId(req.body.store_id) } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          image: 1,
          user_id: "$user._id",
          user_name: "$user.personal.name",
          user_phone: "$user.personal.phone",
          user_email: "$user.email",
          user_address: "$user.personal.address",
        },
      },
    ]);
    return {
      status: "success",
      message: "retrieved successfully",
      data: result,
    };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

async function getPescriptionDetails(req) {
  try {
    // const result = await Prescription.findById(req.body.prescription_id);
    const result = await Prescription.aggregate([
      {
        $match: {
          _id: ObjectId(req.body.prescription_id),
        },
      },
      {
        $lookup: {
          from: "orders",
          foreignField: "prescription_id",
          localField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "stores",
          foreignField: "_id",
          localField: "store_id",
          as: "store",
        },
      },
      {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "drugs",
          foreignField: "_id",
          localField: "order.products_summary.drug_id",
          as: "prescription_drug",
        },
      },
      {
        $unwind: {
          path: "$prescription_drug",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          status: { $first: "$status" },
          user_id: { $first: "$user_id" },
          image: { $first: "$image" },
          store_name: { $first: "$store.name" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          prescription_drugs: { $push: "$prescription_drug" },
        },
      },
      // {
      //   $project: {
      //     "_id": 1,
      //     "user_id": 1,
      //     "status": 1,
      //     "image": 1,
      //     "store_id": 1,
      //     "store_name": "$store.name",
      //     "drugs": "$prescription_drug",
      //     "createdAt": 1,
      //     "updatedAt": 1,
      //   }
      // }
    ]);

    if (result === null) {
      return {
        status: "failed",
        message: "no prescription found",
        data: {},
      };
    }
    return {
      status: "success",
      message: "prescription details retrieved",
      data: result,
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  uploadPrescription,
  getUserPrescription,
  deleteUserPrescription,
  getPrescriptionsSentToPharmacy,
  getPescriptionDetails,
};
