const mongoose = require('mongoose')


const drugCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Inactive"
    },
    pharmacy_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "stores"
    }
})

module.exports = mongoose.model('DrugCategory', drugCategorySchema)
