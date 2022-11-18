const router = require('express').Router();

const Orders = require('../../../private/schemas/Orders');
const { verify } = require('../../../verifyToken');
const { generateOrderCode, fetchLastInvoiceNumber, generateInvoiceNumber } = require("../../../private/services/User/Orders/orders.service");


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

//create an order item. This is triggered when a user clicks on the checkout button
router.post('/create-order-item', verify, async (req, res) => {
    const user_id = req.user._id;
    const {
        store_id,
        delivery_address_id,
        delivery_date, 
        shipping_fee, 
        grand_total,
        products_summary
    } = req.body;

    const order_code = await generateOrderCode();
    const last_no = await fetchLastInvoiceNumber();

    const invoice_number = generateInvoiceNumber(last_no);

    try {
        await Orders.create({
            store_id, user_id, order_code, invoice_number, delivery_address_id, delivery_date, shipping_fee, grand_total, products_summary
        }, (err, result) => {
            if (err) {
                return res.status(400).json({ message: "Failed to create checkout item.", data: err });
            }
            return res.status(200).json({ message: "success", data: result });
        })
    } catch (error) {
        return res.status(400).json({ message: "Failed to create checkout item.", data: error });
    }
});

module.exports = router;
