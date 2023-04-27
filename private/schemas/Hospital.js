const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    opening_hours: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    gps_address: {
        type: String,
        required: false
    },
    gps_lat: {
        type: Number,
        required: false
    },
    gps_lng: {
        type: Number,
        required: false
    },
    images: [],
    owner_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "businessowners"
    },
    available_appointment_dates: [
        {
            type: mongoose.SchemaTypes.Date,
            required: false
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema);
