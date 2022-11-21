const {
  createBusinessOwner,
  loginBusinessOwner,
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

router.post("/login-business-owner", async (req, res, next) => {
  const { account_id, password } = req.body;
  try {
    const result = await loginBusinessOwner({ account_id, password });

    if (!("token" in result)) {
      return res.status(200).json(result);
    }
    return res
      .status(200)
      .header("auth_token", result.token)
      .json({ result:result, roles: ["isAdmin", "isHRM"] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
