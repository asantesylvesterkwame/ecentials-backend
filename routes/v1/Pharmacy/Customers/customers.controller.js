const router = require("express").Router();
const { verify } = require("../../../../../ecentials-backend/verifyToken");
const {
  createCustomer,
} = require("../../../../private/services/Pharmacy/Customers/customer.service");

// Add customers to pharmacy
router.post("/add-new-customer", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await createCustomer({ req }));
  } catch (error) {
    next(error);
  }
});

// Fetch customer information
router.post("/fetch-customers", verify, async (req, res, next) => {
  const { facility_id } = req.body;
  try {
    return res.status(200).json(await fetchCustomers({ facility_id }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
