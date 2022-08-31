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


module.exports = {
    createWallet
}