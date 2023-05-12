/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const router = require("express").Router();

const {
  addNewReview,
  getReviews,
  deleteReview,
} = require("../../../private/services/Reviews/reviews.service");
const { verify } = require("../../../verifyToken");

router.post("/add-new-review", verify, async (req, res, next) => {
  try {
    const result = await addNewReview({ req });

    if (result.status === "success") {
      return res.status(201).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/get-reviews", verify, async (req, res, next) => {
  try {
    const result = await getReviews({ req });

    if (result.status === "success") {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete-review", verify, async (req, res, next) => {
  try {
    const result = await deleteReview(req);

    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
