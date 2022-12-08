const mongoose = require("mongoose");

const labFileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    lab_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    status: {
        type: Number,
        required: false,
        default: 0
    },
    image: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("LabFile", labFileSchema);
