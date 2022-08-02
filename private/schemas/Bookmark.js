const mongoose = require('mongoose');


const bookmarkSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    item_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    bookmark_type: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model("Bookmark", bookmarkSchema);
