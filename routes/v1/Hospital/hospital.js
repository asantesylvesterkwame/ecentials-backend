const router = require('express').Router();

const Hospital = require('../../../private/schemas/Hospital');
const verify = require('../../../verifyToken')


// create a new hospital using data from request body
router.post('/add-new-hospital', (req, res) => {
    const {
        name,
        address,
        opening_hours,
        phone_number,
        gps_address,
    } = req.body;

    Hospital.create({
        name, address, opening_hours, phone_number, gps_address
    }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to create a hospital" });
        }
        return res.status(200).json({ message: "success", data: result });
    })
});


module.exports = router;
