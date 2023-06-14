/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const router = require("express").Router();

const {
  createWallet,
  getWalletBalance,
  recentWalletTransactions,
  getWalletInformation,
} = require("../../../private/services/wallet/wallet.service");
const { verify } = require("../../../verifyToken");

// handle wallet creation for a user
router.post("/create-ecentials-wallet", verify, async (req, res, next) => {
  try {
    const result = await createWallet(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.get("/get-ecentials-wallet-balance", verify, async (req, res, next) => {
  const user_id = req.user._id;
  try {
    return res.json(await getWalletBalance(user_id));
  } catch (error) {
    return next(error);
  }
});

router.get(
  "/recent-ecentials-wallet-transactions",
  verify,
  async (req, res, next) => {
    const user_id = req.user._id;

    try {
      return res.json(await recentWalletTransactions(user_id));
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/information",
  verify,
  async (req, res, next) => {
    try {
      const result = await getWalletInformation(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
