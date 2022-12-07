const router = require('express').Router();


const Checkout = require('../../../private/schemas/Checkout');
const { verify } = require('../../../verifyToken')


// create a new checkout item for a user
router.post('/create-checkout-item', verify, async (req, res, next) => {
    const user_id = req.user._id;
    
    try {
        await Checkout.create({
            user_id, ...req.body
            // delivery_address, delivery_date, total_items_cost, shipping_fee, shipment_summary, total
        }, (err, result) => {
            if (err) {
                return res.status(400).json({ message: "Failed to create checkout item.", data: err });
            }
            return res.status(200).json({ message: "success", data: result });
        })
    } catch (error) {
        next(error)
    }
});

module.exports = router;
