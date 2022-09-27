const router = require('express').Router();

const { getPharmacyStaff } = require('../../../private/services/Pharmacy/Staff/staff.service');
const verify = require('../../../verifyToken');


// fetch all staff registered to a pharmacy
router.post('/fetch-pharmacy-staff', verify, async (req, res, next) => {
    const { facility_id } = req.body;
    try {
        return res.status(200).json(await getPharmacyStaff({ facility_id }));
    } catch (error) {
        next(error);
    }
})

module.exports = router;
