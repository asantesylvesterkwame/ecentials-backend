const router = require("express").Router();
const { verify } = require("../../../../verifyToken");
const {
  createWholesaler,
  fetchWholesaler,
  deleteWholesaler,
  updateWholesaler,
} = require("../../../../private/services/Pharmacy/Wholesaler/wholesaler.service");

// Add customers to pharmacy
router.post("/add-new-wholesaler", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await createWholesaler({ req }));
  } catch (error) {
    return next(error);
  }
});

// Fetch Wholesaler information
router.post("/fetch-wholesalers", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await fetchWholesaler());
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete-wholesaler", verify, async (req, res, next) => {
  try {
    const result = await deleteWholesaler(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.patch("/update-wholesaler", verify, async (req, res, next) => {
  try {
    const result = await updateWholesaler({ req });
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
