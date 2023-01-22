const router = require("express").Router();
const {
  addReturns,
  fetchReturns,
} = require("../../../../private/services/Pharmacy/Returns/returns.service");
const { verify } = require("../../../../verifyToken");

router.post("/add-return", verify, async (req, res, next) => {
  try {
    const result = await addReturns({ req });
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
});

// fetch Returns
router.post("", verify, async (req, res, next) => {
  const { store_id } = req.body;
  try {
    return res.status(200).json(await fetchReturns({ store_id }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
