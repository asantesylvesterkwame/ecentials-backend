const mongoose = require("mongoose");

const defaulDrugSchema = new mongoose.Schema(
  {
    drug_code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dosage_form: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    unit_of_pricing: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    level_of_prescribing: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DefaultDrug", defaulDrugSchema);
