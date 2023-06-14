/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const { ObjectId } = require("mongoose").Types;

const { UserAccountInformationException } = require("../../../exceptions/user");
const Patient = require("../../../schemas/Patient");
const User = require("../../../schemas/User");
const { uploadFile } = require("../../Firebase/imageUpload.service");

// upload user profile image
async function uploadProfileImage({ req }) {
  try {
    const image_url = await uploadFile(req.file, "profileImages");

    const result = await User.updateOne(
      {
        _id: req.user._id,
      },
      { profile_image: image_url }
    );

    if (result != null) {
      return { message: "success", image_url };
    }
    return { message: "failed to update profile image, try again" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// fetch users name when provided with the user id
async function fetchUsersName(user_id) {
  const user_details = await User.find({ _id: user_id });
  if (user_details) {
    let theName = "";
    // extracting users name from personal details
    user_details.forEach((user_element) => {
      theName = user_element.personal.name;
    });

    return theName;
  }

  return {
    message: "No user with the provided user id",
  };
}

async function findUserById(id) {
  try {
    return User.findById(id);
  } catch (error) {
    throw new Error("failed to load user");
  }
}

async function findUserByUniqueId(uniqueId) {
  try {
    return User.find({ uniqueId });
  } catch (error) {
    throw new UserAccountInformationException(`user not found. ${error}`);
  }
}

async function findUserByPatientId(patientId) {
  const result = await Patient.aggregate([
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
      $match: {
        _id: ObjectId(patientId),
      },
    },
    {
      $project: {
        user: "$user",
      },
    },
  ]);
  return result;
}

module.exports = {
  uploadProfileImage,
  fetchUsersName,
  findUserById,
  findUserByUniqueId,
  findUserByPatientId,
};
