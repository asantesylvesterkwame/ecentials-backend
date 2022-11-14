const router = require('express').Router();
const multer = require('multer')

const { getPharmacyStaff, createPharmacyStaff } = require('../../../private/services/Pharmacy/Staff/staff.service');
const { verify } = require("../../../verifyToken");

const storage = multer.memoryStorage()
const upload = multer({ storage }).fields([
    { name: 'photo', maxCount: 1},
    { name: 'cv', maxCount: 1},
    { name: 'certificate', maxCount: 1}
])

// fetch all staff registered to a pharmacy
router.post('/fetch-pharmacy-staff', verify, async (req, res, next) => {
    const { facility_id } = req.body;
    try {
        return res.status(200).json(await getPharmacyStaff({ facility_id }));
    } catch (error) {
        next(error);
    }
})

// create new pharmacy staff
router.post('/add-new-staff', verify, upload, async (req, res, next) => {
    try {
        return res.status(200).json(await createPharmacyStaff({ req }))
    } catch (error) {
       next(error) 
    }
})

module.exports = router;
