/* eslint-disable */

const router = require("express").Router();

const Orders = require("../../../private/schemas/Orders");

const PaymentTransaction = require("../../../private/schemas/PaymentTransaction");
const { verify } = require("../../../verifyToken");
const {
  fetchUsersName,
} = require("../../../private/services/User/Account/account.service");
const {
  cancelOrder,
  approveOrder,
  updateOrderStatus,
  createOrderForUser,
  searchOrder,
} = require("../../../private/services/Pharmacy/Orders/orders.service");
// const { fetchDrugName } = require("../../../private/services/Pharmacy/Drug/drug.service");

// fetch all orders for a pharmacy
router.post("/fetch-all-orders", verify, async (req, res) => {
  const { store_id } = req.body;
  // console.log(pharmacy_id);

  try {
    const orders = await Orders.find(
      { store_id },
      {
        _id: 1,
        order_code: 1,
        payment_type: 1,
        payment_status: 1,
        grand_total: 1,
        order_status: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    if (orders) {
      return res.status(200).json({ message: "success", data: orders });
    }
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

router.post("/fetch-specific-orders", verify, async (req, res) => {
  const { _id } = req.body;
  try {
    const orders = await Orders.find(
      { _id },
      {
        user_id: 1,
        invoice_number: 1,
        payment_type: 1,
        order_code: 1,
        products_summary: 1,
        order_status: 1,
        createdAt: 1,
      }
    );

    const order_details = new Object();
    //extracting user_id from response
    orders.forEach(async (element) => {
      const user_id = element.user_id;

      // combine all the results into one object
      order_details._id = element._id;
      order_details.user_id = user_id;
      order_details.customer_name = await fetchUsersName(
        user_id
      ); /*extracting users name from personal details*/
      order_details.invoice_number = element.invoice_number;
      order_details.payment_type = element.payment_type;
      order_details.order_code = element.order_code;
      order_details.order_status = element.order_status;
      order_details.products_summary = element.products_summary;
      order_details.createdAt = element.createdAt;

      if (orders)
        return res
          .status(200)
          .json({ message: "success", data: order_details });
    });
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

//cancel an order placed to a particular pharmacy
router.post("/cancel-an-order", async (req, res, next) => {
  try {
    return res.status(200).json(await cancelOrder({ req }));
  } catch (error) {
    return next(error);
  }
});

// approve an order placed to a particular pharmacy
router.post("/approve-order", verify, async (req, res, next) => {
  try {
    const result = await approveOrder({ req });
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

// retrieve the total orders placed at a particular pharmacy/shop
router.post("/total-orders", verify, async (req, res) => {
  const { store_id } = req.body;

  await Orders.find({ store_id })
    .count((err, result) => {
      if (err) {
        return res.status(400).json({ message: "Failed to get total orders." });
      }
      return res.status(200).json({ message: "success", data: result });
    })
    .clone();
});

// get a count of all the total products sold by a pharmacy
router.post("/total-products-sold", verify, async (req, res) => {
  const { store_id } = req.body;

  await Orders.find({ store_id, fulfilled: true })
    .count((err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Could not retrieve total products sold." });
      }
      return res.status(200).json({ message: "success", data: result });
    })
    .clone();
});

// total income made by a pharmacy
// this implementation might change in the future as this is
// calculated only based on orders made in the system.
router.post("/total-income-made-by-pharmacy", verify, async (req, res) => {
  await PaymentTransaction.aggregate(
    [
      {
        $group: {
          _id: "$facility_id",
          total: {
            $sum: "$amount_paid",
          },
        },
      },
    ],
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Failed to get total income" });
      }
      return res.status(200).json({ message: "success", data: result });
    }
  );
});

// get all the orders that have been completed
// an order has been completed if the fulfilled is set to true
router.post("/fetch-sales", verify, async (req, res) => {
  const { store_id } = req.body;

  await Orders.find({ store_id, fulfilled: true }, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Failed to fetch pharmacy sales" });
    }
    return res.status(200).json({ message: "success", data: result });
  }).clone();
});

router.post("/update-order-status", verify, async (req, res, next) => {
  try {
    const result = await updateOrderStatus(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/create-order-for-user", verify, async (req, res, next) => {
  try {
    const result = await createOrderForUser({ req });
    if (result.status === "success") {
      return res.status(201).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/search-order", verify, async (req, res, next) => {
  try {
    const result = await searchOrder(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
