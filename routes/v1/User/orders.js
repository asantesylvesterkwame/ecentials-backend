/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const router = require("express").Router();

const Orders = require("../../../private/schemas/Orders");
const { verify } = require("../../../verifyToken");
const {
  createOrderItem,
  cancelOrder,
} = require("../../../private/services/User/Orders/orders.service");

// list all orders for a verified user
router.get("", verify, async (req, res) => {
  const user_id = req.user._id;

  await Orders.find({ user_id }, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "Failed to load orders." });
    }
    return res.status(200).json({ message: "success", data: result });
  }).clone();
});

// create an order item. This is triggered when a user clicks on the checkout button
router.post("/create-order-item", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await createOrderItem(req));
  } catch (error) {
    return next(error);
  }
});

router.post("/cancel-order", verify, async (req, res, next) => {
  try {
    const result = await cancelOrder(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
