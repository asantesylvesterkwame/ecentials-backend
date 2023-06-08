const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    facility_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    facility_type: {
      type: String,
      required: true,
    },
    // hospital_id: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     required: true
    // },
    employee_id: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      text: true,
    },
    phone_number: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
      text: true,
    },
    photo: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    place_of_birth: {
      type: String,
      required: true,
    },
    ghana_card_number: {
      type: String,
      required: true,
    },
    pay_grade: {
      type: String,
      required: true,
    },
    mode_of_payment: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    supervisor: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
    },
    university: {
      type: String,
      required: false,
    },
    degree: {
      type: String,
      required: false,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    cv: {
      type: String,
      required: true,
    },
    certificate: {
      type: String,
      required: false,
    },
    specification: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
      text: true,
    },
    staff_type: {
      type: String,
      required: true,
      text: true,
    },
    availability: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
      default: "Staff",
    },
    privileges: [],
    terminated: {
      type: Boolean,
      default: false,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    availableDates: [
      {
        type: mongoose.SchemaTypes.Date,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
