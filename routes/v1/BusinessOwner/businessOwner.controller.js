const {
  createBusinessOwner,
} = require("../../../private/services/BusinessOwner/businessOwner.service");

const router = require("express").Router();

router.post("/create-business-owner", async (req, res, next) => {
  const { full_name, email, phone_number, address, password } = req.body;

  try {
    const results = await createBusinessOwner({
      full_name,
      email,
      phone_number,
      address,
      password,
    });
    return res
      .status(results.status)
      .json({ message: results.message, data: results.data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
