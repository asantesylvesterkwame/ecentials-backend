const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    facility_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    facility_type: {
        type: String,
        required: true
    },
    // hospital_id: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     required: true
    // },
    employee_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        text: true
    },
    phone_number: {
        type: String,
        required: false
    },
    specification: {
        type: String,
        required: true,
        text: true
    },
    experience: {
        type: Number,
        required: true,
        text: true
    },
    about: {
        type: String,
        required: false,
        text: true
    },
    staff_type: {
        type: String,
        required: true,
        text: true
    },
    availability: {
        type: Date,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
