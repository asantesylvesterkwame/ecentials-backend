const router = require("express").Router();

const {
  addNewShippingAddress,
  getUserShippingAddresses,
} = require("../../../../private/services/UserAddress/user_address.service");
const { verify } = require("../../../../verifyToken");

router.post("/add-user-shipping-address", verify, async (req, res, next) => {
  const user_id = req.user._id;
  const { name_of_recipient, mobile, street_name, town, district, region } =
    req.body;

  try {
    return res.status(201).json(
      await addNewShippingAddress({
        user_id,
        name_of_recipient,
        mobile,
        street_name,
        town,
        district,
        region,
      })
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

module.exports = router;
