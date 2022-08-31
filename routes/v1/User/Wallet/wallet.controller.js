const router = require('express').Router();

const { createWallet } = require('../../../../private/services/wallet/wallet.service');
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


module.exports = router;
