const mongoose = require('mongoose')


const labSchema = new mongoose.Schema({
    hospital_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    opening_hours: {
        type: Date,
        required: true
    },
    phone_numbers: {
        type: Array,
        required: true
    },
    gps_address: {
        type: String,
        required: false
    },
    images: [
        {
            image: Buffer,
            contentType: String,
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Lab', labSchema);
