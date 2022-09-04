const Wallet = require('../../schemas/Wallet');
const WalletTransactions = require('../../schemas/WalletTransactions');

// create a new ecentials wallet
async function createWallet(user_id) {
    try {
        const results = await Wallet.create({ user_id });

        if (results == null) {
            return { message: "Failed to create wallet. Try again later"};
        }
        return { message: "success", data: results };
    } catch (error) {
        return { message: "An error occurred when creating wallet" }
    }
}


// get user wallet's balance
async function getWalletBalance(user_id) {
    try {
        const balance = await Wallet.findOne({ user_id }, { _id: 0, balance: 1 });
        return { message: "success", data: balance };
    } catch (error) {
        return { message: "An error occurred when retrieving using balance" };
    }
}


// retrieve recently performed wallet transactions
async function recentWalletTransactions(user_id) {
    try {
        const transactions = await WalletTransactions.find({ user_id }).limit(5);
        return { message: "succes", data: transactions };
    } catch (error) {
        return { message: "An error occurred when retrieving recent wallet transactions"}
    }
}


module.exports = {
    createWallet,
    getWalletBalance,
    recentWalletTransactions
}