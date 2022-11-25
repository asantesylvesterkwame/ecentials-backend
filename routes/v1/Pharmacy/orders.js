const router = require('express').Router();

const Orders = require('../../../private/schemas/Orders');
const PaymentTransaction = require('../../../private/schemas/PaymentTransaction');
const { verify } = require('../../../verifyToken')


// retrieve the total orders placed at a particular pharmacy/shop
router.post('/total-orders', verify, async (req, res) => {
    const { store_id } = req.body;

    await Orders.find({ store_id }).count((err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to get total orders." })
        }
        return res.status(200).json({ message: "success", data: result})
    }).clone();
});


// get a count of all the total products sold by a pharmacy
router.post('/total-products-sold', verify, async (req, res) => {
    const { store_id } = req.body;

    await Orders.find({ store_id, fulfilled: true }).count((err, result) => {
        if (err) {
            return res.status(400).json({ message: "Could not retrieve total products sold." });
        }
        return res.status(200).json({ message: "success", data: result });
    }).clone();
});


// total income made by a pharmacy
// this implementation might change in the future as this is 
// calculated only based on orders made in the system.
router.post('/total-income-made-by-pharmacy', verify, async (req, res) => {
    const { facility_id } = req.body;

    await PaymentTransaction.aggregate([{
        "$group": {
            "_id": "$facility_id",
            "total": {
                "$sum": "$amount_paid"
            }
        }
    }], (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to get total income" });
        }
        return res.status(200).json({ message: "success", data: result });
    });
});


// get all the orders that have been completed
// an order has been completed if the fulfilled is set to true
router.post('/fetch-sales', verify, async (req, res) => {
    const { store_id } = req.body;

    await Orders.find({ store_id, fulfilled: true }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to fetch pharmacy sales" });
        }
        return res.status(200).json({ message: "success", data: result });
    }).clone();
});

module.exports = router;
