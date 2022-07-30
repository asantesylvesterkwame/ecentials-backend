const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    store_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    status: {
        type: Number,
        required: true
    },
    image: {
        type: String, 
        required: false, 
        min: 2,
        max: 255
    },
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
