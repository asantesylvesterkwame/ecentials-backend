const router = require("express").Router();
const verify = require("../../../../verifyToken");

const {
  fetchInvoice,
} = require("../../../../private/services/Pharmacy/Invoice/invoice.service");

// FETCH POS INVOICE
router.post("", async (req, res, next) => {
  const { store_id } = req.body;
  try {
    return res.status(200).json(await fetchInvoice({ store_id }));
  } catch (error) {
    next(error);
  }
});

// ADD INVOICE
router.post("/add-invoice", async (req, res, next) => {
  try {
    return res.status(200).json(await AddInvoice({ req }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
