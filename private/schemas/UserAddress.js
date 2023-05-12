const mongoose = require("mongoose");

const userShippingAddressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    name_of_recipient: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    street_name: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: false,
    },
    primary_address: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "UserShippingAddress",
  userShippingAddressSchema
);
