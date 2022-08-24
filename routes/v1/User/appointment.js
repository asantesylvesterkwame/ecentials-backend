const router = require('express').Router();

const verify = require('../../../../verifyToken');
const Appointments = require('../../../private/schemas/Appointments');


router.get('', verify, async (req, res) => {
    const user_id = req.user._id;

    const { appoint_type, status } = req.body;

    Appointments.find({ user_id, appoint_type, status }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: 'Failed to load appointments' });
        }
        return res.status(200).send({ message: 'success', data: result });
    }).clone();
});


// create a new user appointment
router.post('/book-an-appointment', verify, async (req, res) => {
    const {
        user_id,
        staff_id,
        date,
        time,
        status,
        appoint_type
    } = req.body;

    await Appointments.create({
        user_id, staff_id, date, time, status, appoint_type
    }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to book appointment. Try again later" });
        }
        return res.status(200).json({ message: "success", data: result });
    });
});


module.exports = router;
