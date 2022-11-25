const router = require('express').Router();

const Orders = require('../../../private/schemas/Orders');
const { verify } = require('../../../verifyToken')


// list all orders for a verified user
router.get('', verify, async (req, res) => {
    const user_id = req.user._id;

    await Orders.find({}, {
        who_ordered: user_id
    }, (err, result) => {
        if (err) {
            return res.status(400).json({message: "Failed to load orders."})
        }
        return res.status(200).json({message: 'success', data: result});
    }).clone();
});


// list information about an order item for a verified user
router.post('/order-item', verify, async (req, res) => {
    user_id = req.user._id;
    const { order_id } = req.body;

    await Orders.findOne({
        _id: order_id,
        who_ordered: user_id, 
    }, (err, result) => {
        if (err) {
            return res.status(400).json({message: 'Failed to load order item'});
        }
        data = []
        if (result != null) {
            data = result;
        }
        return res.status(200).json({message: 'success', data: data});
    }).clone();
});

module.exports = router;
