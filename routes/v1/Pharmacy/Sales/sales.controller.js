const router = require("express").Router();
const { verify } = require("../../../../verifyToken");
const {
  fetchSalesPayment,
  fetchDaySales,
  fetchWeeklySales,
} = require("../../../../private/services/Pharmacy/Sales/sales.service");

// Fetch Orders that are fulfilled (SALES)
router.post("/sales-payment", verify, async (req, res, next) => {
  try {
    const result = await fetchSalesPayment({ req });
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
});

// Can be sales for the week
router.post("/sales-today", verify, async (req, res, next) => {
  try {
    return res.status(201).json(await fetchDaySales({ req }));
  } catch (error) {
    next(error);
  }
});

// sales for a month
router.post("/monthly-sales", verify, async (req, res, next) => {
  try {
      return res.status(201).json(await fetchMonthSales({ req }));
    } catch (error) {
      next(error);
    }
})

// sales for the week
router.post('/weekly-sales', verify, async (req, res, next) => {
  try {
    const result = await fetchWeeklySales(req);
    if (result.status === 'success') {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
