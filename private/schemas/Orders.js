const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
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
    order_status: {
      type: String,
      required: false,
      default: "New",
    },
    fulfilled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // order_item_id: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     required: true
    // },
    grand_total: {
      type: Number,
      required: true,
    },
    delivery_address_id: {
      type: String,
      required: false,
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
    coordinates: {
      type: Array,
      required: false,
    },
    shipping_fee: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: false,
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

module.exports = mongoose.model("Orders", ordersSchema);
