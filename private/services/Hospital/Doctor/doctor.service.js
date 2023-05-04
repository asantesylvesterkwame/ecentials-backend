const ObjectId = require("mongoose").Types.ObjectId;

const Ratings = require("../../../schemas/Ratings");
const Staff = require("../../../schemas/Staff");
const User = require("../../../schemas/User");

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
    const result = await Staff.aggregate([
      {
        $match: {
          _id: ObjectId(doctor_id),
          facility_id: ObjectId(hospital_id),
          staff_type,
        },
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "facility_id",
          foreignField: "_id",
          as: "hospital",
        },
      },
      {
        $unwind: "$hospital",
      },
      {
        $project: {
          _id: 1,
          facility_type: 1,
          facility_name: "$hospital.name",
          employee_id: 1,
          first_name: 1,
          last_name: 1,
          photo: 1,
          specification: 1,
          experience: 1,
          staff_type: 1,
          username: 1,
          about: 1,
        },
      },
    ]);
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// retrieve all doctor ratings and reviews
async function getDoctorReviews({ recipient_id, recipient_type }) {
  try {
    const results = await Ratings.aggregate([
      { $match: { recipient_id: ObjectId(recipient_id), recipient_type } },
      {
        $lookup: {
          from: "users",
          localField: "reviewer_id",
          foreignField: "_id",
          as: "Reviewer",
        },
      },
      {
        $unwind: "$Reviewer",
      },
      {
        $addFields: {
          reviewer_name: "$Reviewer.personal.name",
        },
      },
      {
        $project: {
          _id: 1,
          recipient_id: 1,
          recipient_type: 1,
          message: 1,
          rating: 1,
          reviewer_name: "$Reviewer.personal.name",
          reviewer_image: "$Reviewer.profile_image",
          reviewer_id: "$Reviewer._id",
          createdAt: 1,
        },
      },
    ]);
    return { message: "success", data: results };
  } catch (error) {
    return { message: "an error occurred. please try again", error };
  }
}

// get all primary doctors for a user
async function getPrimaryDoctorsForUser({ user_id }) {
  try {
    const results = await User.aggregate([
      { $match: { _id: ObjectId(user_id) } },
      {
        $lookup: {
          from: "staffs",
          localField: "primary_doctors",
          foreignField: "_id",
          as: "staff",
        },
      },
      {
        $unwind: "$staff",
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "staff.facility_id",
          foreignField: "_id",
          as: "hospital",
        },
      },
      {
        $unwind: "$hospital",
      },
      {
        $project: {
          _id: 0,
          staff_id: "$staff._id",
          staff_first_name: "$staff.first_name",
          staff_last_name: "$staff.last_name",
          staff_image: "$staff.photo",
          specialisation: "$staff.specification",
          experience: "$staff.experience",
          about: "$staff.about",
          hospital: "$hospital.name",
          facility_id: "$hospital._id",
        },
      },
    ]);
    return { message: "success", data: results };
  } catch (error) {
    return { message: "an error occurred, please try again." };
  }
}

// add a doctor as a user's primary
async function addPrimaryDoctorForUser({ user_id, doctor_id }) {
  try {
    const result = await User.updateOne(
      { _id: user_id },
      { $push: { primary_doctors: ObjectId(doctor_id) } }
    );
    if (result != null) {
      return { message: "success" };
    }
    return { message: "failed to add doctor to primary doctors" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// search for a doctor irrespective of hospital
async function searchDoctor({ search_text }) {
  try {
    const result = await Staff.aggregate([
      { $match: { $text: { $search: "Dennis" } } },
      {
        $lookup: {
          from: "hospitals",
          localField: "facility_id",
          foreignField: "_id",
          as: "hospital",
        },
      },
      {
        $unwind: "$hospital",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          specification: 1,
          experience: 1,
          about: 1,
          staff_type: 1,
          availability: 1,
          hospital_name: "$hospital.name",
        },
      },
    ]);
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// remove primary doctor
async function removePrimaryDoctor({ user_id, doctor_id }) {
  try {
    const result = await User.updateOne(
      {
        _id: user_id,
      },
      {
        $pull: { primary_doctors: ObjectId(doctor_id) },
      }
    );
    return { message: "success" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

/**
 * get doctor by id
 */
async function getDoctorById(doctor_id) {
  try {
    const result = await Staff.findById(doctor_id);
    if (result === null) {
      throw new Error("doctor not found");
    }
    return result;
  } catch (error) {
    throw new Error("failed to retrieve doctor");
  }
}

module.exports = {
  getDoctorsInHospital,
  getDoctorInformaion,
  getDoctorReviews,
  getPrimaryDoctorsForUser,
  addPrimaryDoctorForUser,
  searchDoctor,
  removePrimaryDoctor,
  getDoctorById,
};
