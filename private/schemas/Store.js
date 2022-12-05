const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "businessowners"
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String, 
        required: true,
        unique: true
    },
    email: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
        required: false,
    },
    gps_address: {
        type: String, 
        required: true,
    },
    location: {
        type: String, 
        required: true,
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    phone_number: {
        type: String,
        required: true
    },
    open_hours: {
        type: String,
        required: true
    },
    licence_no: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: false
    },
    accept_nhis: {
        type: Boolean,
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
    business_registration_document: {
        type: String,
        required: true
    },
    courier_type: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);
