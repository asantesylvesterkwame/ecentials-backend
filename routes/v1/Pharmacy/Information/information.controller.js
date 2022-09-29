const router = require('express').Router();

const { getPharmacyInformation } = require('../../../../private/services/Pharmacy/Information/information.service');
const verify = require('../../../../verifyToken');


// retrieve information about a pharmacy
router.post('/fetch-pharmacy-information', verify, async (req, res, next) => {
    const { pharmacy_id } = req.body;

    try {
        return res.status(200).json(await getPharmacyInformation(pharmacy_id));    
    } catch (error) {
        next(error);
    }
});

module.exports = router;
