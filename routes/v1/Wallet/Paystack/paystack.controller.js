const router = require('express').Router();

const { initializePaymentTransaction } = require('../../../../private/services/wallet/Paystack/paystack.service');
const { verify } = require('../../../../verifyToken')

//initialize paystack transaction
router.post('/initialize-payment-transaction', verify, async (req, res, next) => {

    try {
        res.json(await initializePaymentTransaction(req));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
