/* eslint-disable */

const { ObjectId } = require("mongoose").Types;

const Hospital = require("../../schemas/Hospital");

const { encryptPassword } = require("../../helpers/functions");

const { uploadFile } = require("../Firebase/imageUpload.service");
const getDistance = require("../../../private/helpers/get_distance");
const Patient = require("../../schemas/Patient");

// upload hospital images
async function uploadHospitalImages({ hospital_id, files }) {
  try {
    let images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const imageUrl = await uploadFile(file, "images");

      images.push(imageUrl);
    }

    const result = await Hospital.updateOne(
      { _id: hospital_id },
      { $push: { images: { $each: images } } }
    );

    if (result != null) {
      return { message: "Images uploaded successfully" };
    }
    return { message: "Images not uploaded. Try again" };
  } catch (error) {
    return { message: "An error occurred. Please try again." };
  }
}

// search nearby hospital
// uses search text to query the db
// uses the user's current location to make the distance
// to the hospital is less than 50km
async function searchNearbyHospital({
  search_text,
  user_latitude,
  user_longitude,
}) {
  try {
    const hospitals = await Hospital.find({
      $or: [
        { name: { $regex: search_text, $options: "i" } },
        { address: { $regex: search_text, $options: "i" } },
      ],
    });
    if (!hospitals) {
      return { message: "no hospital found", data: [] };
    }

    let results = [];

    hospitals.forEach((hospital) => {
      const distance = getDistance({
        lat1: user_latitude,
        lng1: user_longitude,
        lat2: hospital.gps_lat,
        lng2: hospital.gps_lng,
      });

      if (distance < 50.0) {
        results.push(hospital);
      }
    });
    return { message: "success", data: results };
  } catch (error) {
    return { message: "An error occurred. Please try again." };
  }
}

// get hospital details
async function getHospitalDetails(req) {
  try {
    const result = await Hospital.find({ _id: req.body.hospital_id });
    return {
      status: "success",
      message: "successfully retrieved hospital",
      data: result,
    };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

/**
 * Check if business owner has hospital
 */
async function isBusinessOwnerHavingHospital(req) {
  try {
    const result = await Hospital.find({ owner_id: req.user._id });

    if (result.length > 0) {
      return {
        status: "success",
        message: "user has a hospital",
        has_hospital: true,
        data: result,
      };
    }
    return {
      status: "success",
      message: "user has no hospital",
      has_hospital: false,
    };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

/*
 * Register new hospital
 */
async function registerNewHospital({ req }) {
  try {
    const businessFile = req.file;
    const businessDocumentUrl = await uploadFile(
      businessFile,
      `${req.body.hospital_name}/businessDocument/`
    );

    const result = await Hospital.create({
      ...req.body,
      business_document: businessDocumentUrl,
      password: encryptPassword(req.body.password),
    });

    if (result !== null) {
      return {
        status: "success",
        message: "hospital registration successful",
      };
    }
    return {
      status: "failed",
      message: "hospital registration failed",
    };
  } catch (e) {
    throw new Error(`failed to register new hospital ${e}`);
  }
}

async function findHospitalById(id) {
  return await Hospital.findById(id);
}

async function findHospitalByPatientId(patientId) {
  const result = await Patient.aggregate([
    {
      $lookup: {
        from: "hospitals",
        localField: "hospital",
        foreignField: "_id",
        as: "hospital",
      },
    },
    {
      $unwind: {
        path: "$hospital",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        _id: ObjectId(patientId),
      },
    },
    {
      $project: {
        hospital: "$hospital",
      },
    },
  ]);
  return result;
}

module.exports = {
  registerNewHospital,
  uploadHospitalImages,
  searchNearbyHospital,
  getHospitalDetails,
  isBusinessOwnerHavingHospital,
  findHospitalById,
  findHospitalByPatientId,
};
