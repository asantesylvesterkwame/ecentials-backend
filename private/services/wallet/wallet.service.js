const Wallet = require("../../schemas/Wallet");
const WalletTransactions = require("../../schemas/WalletTransactions");

// create a new ecentials wallet
async function createWallet(userId) {
  try {
    const results = await Wallet.create({ userId });

    if (results == null) {
      return { message: "Failed to create wallet. Try again later" };
    }
    return { message: "success", data: results };
  } catch (error) {
    return { message: "An error occurred when creating wallet" };
  }
}

// get user wallet's balance
async function getWalletBalance(userId) {
  try {
    const balance = await Wallet.findOne({ userId }, { _id: 0, balance: 1 });
    return { message: "success", data: balance };
  } catch (error) {
    return { message: "An error occurred when retrieving using balance" };
  }
}

// retrieve recently performed wallet transactions
async function recentWalletTransactions(userId) {
  try {
    const transactions = await WalletTransactions.find({ userId }).limit(5);
    return { message: "success", data: transactions };
  } catch (error) {
    return {
      message: "An error occurred when retrieving recent wallet transactions",
    };
  }
}

module.exports = {
  createWallet,
  getWalletBalance,
  recentWalletTransactions,
};
