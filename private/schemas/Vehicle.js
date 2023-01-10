const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    driver_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    facility_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    licence_no: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    insurance: {
        type: Boolean,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
