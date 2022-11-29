const router = require("express").Router();
const { verify } = require("../../../../verifyToken");
const {
  fetchSalesPayment,
} = require("../../../../private/services/Pharmacy/Sales/sales.service");

// Fetch Orders that are fulfilled (SALES)
router.post("/sales-payment", verify, async (req, res, next) => {
  const { store_id } = req.body;
  try {
    return res.status(200).json(await fetchSalesPayment({ store_id }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
