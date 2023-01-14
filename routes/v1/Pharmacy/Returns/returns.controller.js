const router = require("express").Router();
const {
  addReturns,
  fetchReturns,
} = require("../../../../private/services/Pharmacy/Returns/returns.service");

router.post("", async (req, res, next) => {
  const { store_id, invoice_number } = req.body;
  try {
    return res.status(200).json(await addReturns({ store_id, invoice_number }));
  } catch (error) {
    next(error);
  }
});

// fetch Returns
router.post("/fetch-returns", async (req, res, next) => {
  const { store_id } = req.body;
  try {
    return res.status(200).json(await fetchReturns({ store_id }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
