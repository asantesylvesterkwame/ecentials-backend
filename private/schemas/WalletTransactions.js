const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    transaction_type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: [true, "payment status is required"],
      enum: ["successful", "pending", "failed"],
    },
    paymentMethod: {
      type: String,
      default: "flutterwave",
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
      enum: ["GH", "USD", "EUR", "GBP"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
