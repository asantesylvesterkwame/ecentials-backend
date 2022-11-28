const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  facility_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  name: { type: String, required: true },
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

module.exports = mongoose.model("Customers", customerSchema);
