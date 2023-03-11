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
      required: false,
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
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    medicine_group: {
      type: String,
      required: false,
    },
    dosage: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: false,
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
      required: false,
      default: "N/A",
    },
    otc: {
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
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drug", drugSchema);
