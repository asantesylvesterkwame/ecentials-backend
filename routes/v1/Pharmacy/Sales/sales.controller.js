const router = require("express").Router();
const { verify } = require("../../../../verifyToken");
const {
  fetchSalesPayment,
} = require("../../../../private/services/Pharmacy/Sales/sales.service");

// Fetch Orders that are fulfilled (SALES)
router.post("/sales-payment", verify, async (req, res, next) => {
  try {
    const result = await fetchSalesPayment({ req });
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
