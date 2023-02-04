const mongoose = require('mongoose');


const accountID = new mongoose.Schema({
    account_id: {
        type: String,
        required: true
    },
    business_owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    staff: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
    }
});


module.exports = mongoose.model("AccountID", accountID);
