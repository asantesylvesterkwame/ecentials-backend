const router = require("express").Router();
const Orders = require("../../../../private/schemas/Orders");
const Drug = require("../../../schemas/Drug");
const Invoice = require("../../../schemas/Invoice");

async function generateOrderCode(orderInitial, pharmacyInitial) {
  let initials = orderInitial.slice(0, 2).toUpperCase();
  let pharmacy = await pharmacyInitial.slice(0, 2).toUpperCase();
  let randomDigits1 = (Math.floor(Math.random() * 9) + 9).toString();
  let randomDigits2 = (Math.floor(Math.random() * 999) + 99).toString();
  let randomDigits3 = (Math.floor(Math.random() * 999) + 99).toString();

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
  month = month.toString().length === 1 ? "0" + month : month;
  day = day.toString().length === 1 ? "0" + day : day;
  let randomDigits = (Math.floor(Math.random() * 99999) + 100000).toString();
  return "ec" + year + month + day + randomDigits;
}

async function createOrderItem(req) {
  const user_id = req.body[0].user_id;
  const name = req.body[0].name;
  // console.log(req.body);
  try {
    const order = req.body;
    order.forEach(async (element) => {
      // console.log(element.delivery_date)

      const order_code = await generateOrderCode("ORDER", name);
      // const last_no = await fetchLastInvoiceNumber();

      const invoice_number = generateInvoiceNumber();
      var store_id = element.store_id;
      var delivery_address_id = element.delivery_address_id;
      var delivery_date = element.delivery_date;
      var delivery_method = element.delivery_method;
      var coordinates = element.coordinates;
      var shipping_fee = element.shipping_fee;
      var note = element.note;
      var grand_total = element.grand_total;
      var products_summary = element.products_summary;

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
          }
        );
      });
    });
    return { message: "Order created successfully" };
  } catch (error) {
    return { message: "Failed to create checkout item.", data: error };
  }
}

module.exports = {
  generateOrderCode,

  generateInvoiceNumber,
  createOrderItem,
};
