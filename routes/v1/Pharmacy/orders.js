const router = require('express').Router();

const Orders = require('../../../private/schemas/Orders');
const verify = require('../../../verifyToken')


// retrieve the total orders placed at a particular pharmacy/shop
router.get('/total-orders', verify, async (req, res) => {
    const { store_id } = req.body;

    await Orders.find({ store_id }).count((err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to get total orders." })
        }
        return res.status(200).json({ message: "success", data: result})
    }).clone();
});


module.exports = router;
