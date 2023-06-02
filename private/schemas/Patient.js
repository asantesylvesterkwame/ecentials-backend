const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Hospital",
    },
    patient: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
