const router = require('express').Router();

const Orders = require('../../../private/schemas/Orders');
const { verify } = require('../../../verifyToken');
const { createOrderItem } = require("../../../private/services/User/Orders/orders.service");


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
    })
});

//create an order item. This is triggered when a user clicks on the checkout button
router.post('/create-order-item', verify, async (req, res, next) => {
    try{
        return res.status(200).json(await createOrderItem({req}))
    }catch(error){
        next(error);
    }
});

module.exports = router;