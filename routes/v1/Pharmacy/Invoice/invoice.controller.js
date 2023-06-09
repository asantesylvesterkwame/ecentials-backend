/* eslint-disable camelcase */

const router = require("express").Router();
const { verify } = require("../../../../verifyToken");

const {
  fetchInvoice,
  addInvoice,
  deleteInvoice,
  searchInvoice,
  fetchCustomerName,
} = require("../../../../private/services/Pharmacy/Invoice/invoice.service");

// FETCH POS INVOICE
router.post("", verify, async (req, res, next) => {
  const { store_id } = req.body;
  try {
    return res.status(200).json(await fetchInvoice({ store_id }));
  } catch (error) {
    return next(error);
  }
});

router.get("/get-invoice", verify, fetchCustomerName);

// ADD INVOICE
router.post("/add-invoice", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await addInvoice({ req }));
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete-invoice", verify, async (req, res, next) => {
  try {
    const result = await deleteInvoice(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/search-invoice", verify, async (req, res, next) => {
  try {
    const result = await searchInvoice(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
