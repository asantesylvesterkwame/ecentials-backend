const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    store_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    who_ordered: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    who_ordered_type: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    fulfilled: {
        type: Boolean,
        required: true,
        default:false
    },
    order_item_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    item_type: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    prize: {
        type: Number,
        required: true
    },
    delivery_method: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Orders", ordersSchema);
