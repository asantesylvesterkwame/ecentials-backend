const mongoose = require("mongoose");

const appointmentsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    facility_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    staff_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    // appointment_type: {
    //     type: String,
    //     required: true
    // }
}, { timestamps: true })

module.exports = mongoose.model("Appointments", appointmentsSchema);
