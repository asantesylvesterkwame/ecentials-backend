const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Orders",
    },
    customer_name: {
      type: String,
      required: false,
    },
    order_code: {
      type: String,
      required: true,
    },
    invoice_number: {
      type: String,
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
      default: "Cash",
    },
    payment_status: {
      type: String,
      required: true,
      default: "Paid",
    },
    order_status: {
      type: String,
      required: false,
      default: "Done",
    },
    fulfilled: {
      type: Boolean,
      required: true,
      default: true,
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
      default: "Pickup",
    },
    products_summary: [
      {
        drug_id: {
          type: mongoose.SchemaTypes.ObjectId,
          required: false,
        },
        drug_name: {
          type: String,
          required: false,
        },
        drug_image: {
          type: String,
          required: false,
        },
        quantity: {
          type: Number,
          required: false,
        },
        nhis: {
          type: String,
          required: false,
        },
        discount: {
          type: Number,
          required: false,
          default: 0.0,
        },
        prize: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
