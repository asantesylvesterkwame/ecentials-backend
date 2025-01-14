/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const { ObjectId } = require("mongoose").Types;

const Invoice = require("../../../schemas/Invoice");
const Orders = require("../../../schemas/Orders");

async function fetchSalesPayment({ req }) {
  try {
    const invoices = Invoice.find({ fulfilled: true, ...req.body });
    const orders = Orders.find({ fulfilled: true, ...req.body });
    const [invoicesRes, ordersRes] = await Promise.all([
      invoices.exec(),
      orders.exec(),
    ]);

    return {
      status: "success",
      message: "sales data retrieved successfully",
      data: [...invoicesRes, ...ordersRes],
    };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

// CALCULATE TOTAL SALES TODAY
async function fetchDaySales({ req }) {
  const { shop_id } = req.body;
  try {
    const results = await Invoice.find({ shop_id });
    const sales = {};
    let total = 0;
    let previousWeekDay = null; // keep track of the previous week day
    results.forEach(({ grand_total, createdAt }) => {
      const dayOfWeek = new Date(createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const revenue = grand_total;
      if (!sales[dayOfWeek]) {
        if (previousWeekDay && dayOfWeek !== previousWeekDay) {
          // if it's a new week day, set the total to zero
          total = 0;
        }
        previousWeekDay = dayOfWeek; // update the previous week day
        total = sales[dayOfWeek] ? (total += revenue) : revenue;
        sales[dayOfWeek] = { name: dayOfWeek, sale: total };
      } else {
        total += revenue;
        sales[dayOfWeek].sale = total;
      }
    });
    const salevalue = Object.values(sales);
    return { message: "success", data: salevalue };
  } catch (error) {
    return { data: error };
  }
}

// Sales for each month
// SALES FOR MONTH
async function fetchMonthSales({ req }) {
  const { store_id } = req.body;
  try {
    const results = await Invoice.find({ store_id });
    const sales = {};
    let total = 0;
    results.forEach(({ grand_total, createdAt }) => {
      const currentMonth = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
      });
      const revenue = grand_total;
      if (!sales[createdAt]) {
        total = sales[currentMonth] ? (total += revenue) : revenue;
        sales[currentMonth] = { name: currentMonth, sale: total };
      } else {
        sales[currentMonth].sale = sales[currentMonth] + revenue;
      }
    });

    const salesvalue = Object.values(sales);

    return { message: "success", data: salesvalue };
  } catch (error) {
    return { data: error };
  }
}

// get sales for every week
async function fetchWeeklySales(req) {
  try {
    const startDate = new Date(req.body.start_date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const result = await Invoice.aggregate([
      {
        $match: {
          store_id: ObjectId(req.body.store_id),
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$grand_total" },
        },
      },
    ]);
    return {
      status: "success",
      message: "weekly sales retrieved",
      data: result,
    };
  } catch (error) {
    return { status: "error", message: "an error occurred" };
  }
}

module.exports = {
  fetchSalesPayment,
  fetchMonthSales,
  fetchDaySales,
  fetchWeeklySales,
};
