/* eslint-disable camelcase */

const router = require("express").Router();

const {
  addDrugCategory,
  getDrugCategories,
} = require("../../../../private/services/Pharmacy/Drug/drugCategory.service");
const { verify } = require("../../../../verifyToken");

// create a new drug category
router.post("/add-drug-category", verify, async (req, res, next) => {
  const { name, status, pharmacy_id } = req.body;

  try {
    return res
      .status(200)
      .json(await addDrugCategory({ name, status, pharmacy_id }));
  } catch (error) {
    return next(error);
  }
});

// fetch all drug categories
router.post("/fetch-drug-categories", verify, async (req, res, next) => {
  const { pharmacy_id } = req.body;

  try {
    return res.status(200).json(await getDrugCategories({ pharmacy_id }));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
