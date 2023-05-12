const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    delivery_address: {
      type: String,
      required: true,
    },
    delivery_date: {
      type: String,
      required: true,
    },
    shipment_summary: [
      {
        drug_name: {
          type: String,
          required: true,
        },
        total_number: {
          type: Number,
          required: false,
        },
        pharmacy: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
        },
      },
    ],
    total_items_cost: {
      type: Number,
      required: true,
    },
    shipping_fee: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    pharmacy_image: {
      type: String,
      required: false,
    },
    nhis: {
      type: Boolean,
      required: false,
      default: false,
    },
    location: {
      type: String,
      required: false,
    },
    pickup_mode: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
