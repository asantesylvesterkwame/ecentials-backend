const router = require("express").Router();

const {
  addNewShippingAddress,
  getUserShippingAddresses,
  updateShippingAddress,
  deleteShippingAddress,
} = require("../../../../private/services/UserAddress/user_address.service");
const { verify } = require("../../../../verifyToken");

router.post("/add-user-shipping-address", verify, async (req, res, next) => {
  try {
    return res.status(201).json(
      await addNewShippingAddress({ req })
    );
  } catch (error) {
    next(error);
  }
});

// retrieve all user added shipping addresses
router.get("/fetch-all-shipping-addresses", verify, async (req, res, next) => {
  const user_id = req.user._id;

  try {
    return res.status(200).json(await getUserShippingAddresses({ user_id }));
  } catch (error) {
    next(error);
  }
});

router.post('/update-shipping-address', verify, async (req, res, next) => {
  try {
    return res.status(200).json(await updateShippingAddress({ req }))
  } catch (error) {
    next(error)
  }
})

router.post('/delete-shipping-address', verify, async (req, res, next) => {
  try {
    return res.json(await deleteShippingAddress({ req }))
  } catch (error) {
    next(error)
  }
})

module.exports = router;
