const router = require("express").Router();
const { verify } = require("../../../../verifyToken");
const {
  createCustomer,
  fetchCustomers,
  updateCustomer,
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

router.post('/update-customer', verify, async (req, res, next) => {
  try {
    const result = await updateCustomer({ req });
    if (result.status === 'success') {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
})
module.exports = router;
