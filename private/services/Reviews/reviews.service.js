/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const { ObjectId } = require("mongoose").Types;

const Ratings = require("../../schemas/Ratings");

async function addNewReview({ req }) {
  try {
    const result = await Ratings.create({
      reviewer_id: req.user._id,
      ...req.body,
    });

    return {
      status: "success",
      message: "review added successfully",
      data: result,
    };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

async function getReviews({ req }) {
  try {
    const result = await Ratings.aggregate([
      {
        $match: {
          recipient_type: req.body.recipient_type,
          recipient_id: ObjectId(req.body.recipient_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reviewer_id",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $unwind: {
          path: "$User",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          recipient_id: 1,
          recipient_type: 1,
          rating: 1,
          message: 1,
          reviewer_id: 1,
          reviewer_name: "$User.personal.name",
          reviewer_image: "$User.profile_image",
          createdAt: 1,
        },
      },
    ]).sort({ createdAt: -1 });

    return {
      status: "success",
      message: "reviews successfully retrieved",
      data: result,
    };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

async function deleteReview(req) {
  try {
    await Ratings.findByIdAndDelete(req.body.review_id);
    return { status: "success", message: "review deleted successfully" };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

module.exports = {
  addNewReview,
  getReviews,
  deleteReview,
};
