const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "stores",
    },
    category_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "drugcategories",
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    selling_price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    medicine_group: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    total_stock: {
      type: Number,
      required: false,
      default: 0,
    },
    // dosage_form: {
    //     type: String,
    //     required: true
    // },
    manufacturer: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      required: false,
      default: 0,
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
    nhis: {
      type: String,
      required: true,
      default: "N/A",
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drug", drugSchema);
