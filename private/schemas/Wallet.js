const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    cards: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
