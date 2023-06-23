/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const Orders = require("../../../schemas/Orders");
const Drug = require("../../../schemas/Drug");
const { OrderException } = require("../../../exceptions/order");

async function generateOrderCode(orderInitial, pharmacyInitial) {
  const initials = orderInitial.slice(0, 2).toUpperCase();
  const pharmacy = await pharmacyInitial.slice(0, 2).toUpperCase();
  const randomDigits1 = (Math.floor(Math.random() * 9) + 9).toString();
  const randomDigits2 = (Math.floor(Math.random() * 999) + 99).toString();
  const randomDigits3 = (Math.floor(Math.random() * 999) + 99).toString();

  return initials + +randomDigits1 + +randomDigits2 + +randomDigits3 + pharmacy;
}

// async function fetchLastInvoiceNumber() {
//   // pharmacy_id = req.user._id;
//   const today = new Date();

//   const day = today.getDate();
//   const month = today.getMonth();
//   const year = today.getFullYear();

//   const result = await Invoice.find({}, { _id: 0, invoice_number: 1 })
//     .sort({ _id: -1 })
//     .limit(1);
//   data = [];
//   data = result;

//   if (data.length == 0) {
//     return "Ecen" + year + month + day + "001";
//   } else {
//     for (var index = 0; index < data.length; index++) {
//       return data[index].invoice_number;
//     }
//     // data.forEach(element => {
//     //     console.log(element);
//     // });
//     // return data;
//   }
// }

function generateInvoiceNumber() {
  // var count = oldInvoiceNumber.match(/\d*$/);

  // // Take the substring up until where the integer was matched
  // // Concatenate it to the matched count incremented by 1
  // return oldInvoiceNumber.substr(0, count.index) + ++count[0];
  const today = new Date();

  let day = today.getDate();
  let month = today.getMonth() + 1;
  const year = today.getFullYear().toString().substring(2);
  month = month.toString().length === 1 ? `0${month}` : month;
  day = day.toString().length === 1 ? `0${day}` : day;
  const randomDigits = (Math.floor(Math.random() * 99999) + 100000).toString();
  return `ec${year}${month}${day}${randomDigits}`;
}

async function createOrderItem(req) {
  const { user_id } = req.body[0];
  const { name } = req.body[0];
  // console.log(req.body);
  try {
    const order = req.body;
    order.forEach(async (element) => {
      // console.log(element.delivery_date)

      const order_code = await generateOrderCode("ORDER", name);
      // const last_no = await fetchLastInvoiceNumber();

      const invoice_number = generateInvoiceNumber();
      const { store_id } = element;
      const { delivery_address_id } = element;
      const { delivery_date } = element;
      const { delivery_method } = element;
      const { coordinates } = element;
      const { shipping_fee } = element;
      const { note } = element;
      const { grand_total } = element;
      const { products_summary } = element;

      // console.log(order.length)
      await Orders.create({
        order_code,
        invoice_number,
        store_id,
        user_id,
        delivery_address_id,
        delivery_date,
        delivery_method,
        coordinates,
        shipping_fee,
        note,
        grand_total,
        products_summary,
      });

      products_summary.forEach(async (item) => {
        // reduce total drug stock
        await Drug.updateOne(
          {
            _id: item.drug_id,
          },
          {
            $inc: { total_stock: -item.quantity },
            // eslint-disable-next-line prettier/prettier
          }
        );
      });
    });
    return { message: "Order created successfully" };
  } catch (error) {
    return { message: "Failed to create checkout item.", data: error };
  }
}

async function cancelOrder(req) {
  try {
    const result = await Orders.updateOne(
      {
        user_id: req.user._id,
        _id: req.body.order_id,
      },
      {
        $set: {
          order_status: "Cancelled",
        },
        // eslint-disable-next-line prettier/prettier
      }
    );
    if (result.modifiedCount > 0) {
      return { status: "success", message: "order cancelled successfully" };
    }
    return { status: "failed", message: "failed to cancel order" };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

async function getOrderDetails(req) {
  try {
    const result = await Orders.findById(req.params.orderId);
    if (!result) {
      return {
        status: "failed",
        message: "order not found",
      };
    }
    return {
      status: "success",
      message: "order details retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new OrderException(`could not get order details. ${error}`);
  }
}
module.exports = {
  generateOrderCode,

  generateInvoiceNumber,
  createOrderItem,
  cancelOrder,
  getOrderDetails,
};
