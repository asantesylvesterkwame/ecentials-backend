const router = require('express').Router();
const multer = require('multer')

const { getPharmacyStaff, createPharmacyStaff, getPharmacyStaffCount, updatePharmacyStaffInformation, terminateStaff } = require('../../../private/services/Pharmacy/Staff/staff.service');
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

// get a total count of the pharmacy staff
router.post('/get-staff-count', verify, upload, async (req, res, next) => {
    try {
        return res.status(200).json(await getPharmacyStaffCount({ req }))
    } catch (error) {
        next(error)
    }
})

// update staff information
router.post('/update-staff-information', verify, upload, async (req, res, next) => {
    try {
        return res.status(200).json(await updatePharmacyStaffInformation({ req }))
    } catch (error) {
        next(error)
    }
})

router.post('/terminate-staff', verify, async (req, res, next) => {
    try {
        const result = await terminateStaff(req);
        if (result.status === 'success') {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } catch (error) {
        next(error);
    }
})

module.exports = router;
