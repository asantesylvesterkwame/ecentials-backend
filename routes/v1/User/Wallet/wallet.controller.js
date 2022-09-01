const router = require('express').Router();

const { createWallet, getWalletBalance } = require('../../../../private/services/wallet/wallet.service');
const verify = require('../../../../verifyToken')


// handle wallet creation for a user
router.post('/create-ecentials-wallet', verify, async (req, res, next) => {
    const user_id = req.user._id;
    try {
        res.json(await createWallet(user_id))
    } catch (error) {
        next(error);
    }
});


router.get('/get-ecentials-wallet-balance', verify, async (req, res, next) => {
    const user_id = req.user._id;
    try {
        res.json(await getWalletBalance(user_id));
    } catch (error) {
        next(error);
    }
});


module.exports = router;
