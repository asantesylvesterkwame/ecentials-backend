const mongoose = require("mongoose");

const returnsSchema = new mongoose.Schema(
  {
    invoice_number: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Returns", returnsSchema);
