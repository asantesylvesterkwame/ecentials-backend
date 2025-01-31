/* eslint-disable camelcase */

const router = require("express").Router();
const { verify } = require("../../../../verifyToken");
const {
  createCustomer,
  fetchCustomers,
  updateCustomer,
  deleteCustomer,
  searchCustomer,
} = require("../../../../private/services/Pharmacy/Customers/customer.service");

// Add customers to pharmacy
router.post("/add-new-customer", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await createCustomer({ req }));
  } catch (error) {
    return next(error);
  }
});

// Fetch customer information
router.post("/fetch-customers", verify, async (req, res, next) => {
  const { facility_id } = req.body;
  try {
    return res.status(200).json(await fetchCustomers({ facility_id }));
  } catch (error) {
    return next(error);
  }
});

router.post("/update-customer", verify, async (req, res, next) => {
  try {
    const result = await updateCustomer({ req });
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete-customer", verify, async (req, res, next) => {
  try {
    const result = await deleteCustomer(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/search-customer", verify, async (req, res, next) => {
  try {
    const result = await searchCustomer(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
