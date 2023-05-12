/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const router = require("express").Router();
const {
  createBusinessOwner,
  loginBusinessOwner,
} = require("../../../private/services/BusinessOwner/businessOwner.service");

router.post("/create-business-owner", async (req, res, next) => {
  // eslint-disable-next-line
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
    return next(error);
  }
});

router.post("/login-business-owner", async (req, res, next) => {
  const { account_id, password } = req.body;
  try {
    const result = await loginBusinessOwner({ account_id, password });

    if (!("token" in result)) {
      return res.status(200).json(result);
    }
    return res.status(200).header("auth_token", result.token).json({ result });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
