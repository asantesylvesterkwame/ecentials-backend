const Ratings = require("../../../schemas/Ratings");
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

// get information about a doctor in a hospital
async function getDoctorInformaion({ doctor_id, hospital_id, staff_type }) {
  try {
    const result = await Staff.find({
      _id: doctor_id,
      facility_id: hospital_id,
      staff_type,
    }, { password: 0 });
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// retrieve all doctor ratings and reviews
async function getDoctorReviews({ recipient_id, recipient_type }) {
  try {
    const results = await Ratings.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "reviewer_id",
          foreignField: "_id",
          as: "Reviewer",
        }
      },
      { 
        $unwind: '$Reviewer'
       },
      {
        $addFields: {
         "reviewer_name": "$Reviewer.personal.name",
        }
       },
       {
        "$project": {
          "_id": 1,
          "recipient_id": 1,
          "recipient_type": 1,
          "message": 1,
          "rating": 1,
          "reviewer_name": "$Reviewer.personal.name",
        }
      }
    ]);
    return { message: "success", data: results };
  } catch (error) {
    return { message: "an error occurred. please try again", error };
  }
}

module.exports = {
  getDoctorsInHospital,
  getDoctorInformaion,
  getDoctorReviews,
};
