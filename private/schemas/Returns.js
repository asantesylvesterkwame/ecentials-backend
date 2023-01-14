const mongoose = require("mongoose");

const returnsSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    customer_name: {
      type: String,
      required: false,
    },
    order_code: {
      type: String,
      required: false,
    },
    invoice_number: {
      type: String,
      required: false,
    },
    payment_type: {
      type: String,
      required: false,
      default: "Momo",
    },
    payment_status: {
      type: String,
      required: false,
      default: "Pending",
    },
    grand_total: {
      type: Number,
      required: true,
    },
    delivery_date: {
      type: String,
      required: true,
    },
    delivery_method: {
      type: String,
      required: false,
      default: "Delivery",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Returns", returnsSchema);
