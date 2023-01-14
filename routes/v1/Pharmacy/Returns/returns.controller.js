const router = require("express").Router();
const {
  fetchReturns,
} = require("../../../../private/services/Pharmacy/Returns/returns.service");

router.post("", async (req, res, next) => {
  const { store_id, invoice_number } = req.body;
  try {
    return res
      .status(200)
      .json(await fetchReturns({ store_id, invoice_number }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
