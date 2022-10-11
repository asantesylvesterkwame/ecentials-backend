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
        required: true
    },
    phone_number: {
        type: String,
        required: false
    },
    specification: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: false
    },
    staff_type: {
        type: String,
        required: true
    },
    availability: {
        type: String,
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
