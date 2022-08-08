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
        required: false,
        default: 0
    },
    image: {
        data: Buffer,
        contentType: String,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
