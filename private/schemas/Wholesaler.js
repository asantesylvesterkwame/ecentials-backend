const mongoose = require("mongoose");

const WholesalerSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  region: {
    type: String,
  },
  country: {
    type: String,
  },
});

module.exports = mongoose.model("Wholesaler", WholesalerSchema);
