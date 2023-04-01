const mongoose = require("mongoose");

const businessOwnerSchema = new mongoose.Schema({
    // full_name, email, phone_number, address, password
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 1024, 
        min: 6
    },
    privileges: ["isAdmin", "isHRM"]
}, { timestamps: true });

module.exports = mongoose.model('BusinessOwner', businessOwnerSchema);
