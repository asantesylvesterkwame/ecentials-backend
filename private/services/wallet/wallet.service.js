const Wallet = require('../../schemas/Wallet');

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



module.exports = {
    createWallet,
    getWalletBalance
}