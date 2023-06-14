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
    visits: [
      {
        visitNo: {
          type: String,
          required: true,
          unique: true,
        },
        visitDate: {
          type: Date,
          default: Date.now,
        },
        department: String,
        staff: String,
      },
    ],
    refer: {
      hospital: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
      },
      staff: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
    referHistory: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
