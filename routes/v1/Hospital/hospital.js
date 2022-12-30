const router = require('express').Router();
const multer = require('multer')

const Hospital = require('../../../private/schemas/Hospital');
const { uploadHospitalImages, searchNearbyHospital, getHospitalDetails} = require('../../../private/services/Hospital/hospital.service');
const { verify } = require('../../../verifyToken');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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


// upload images of a hospital
router.post('/upload-hospital-images', upload.array("pictures", 15), async (req, res, next) => {
    const { hospital_id } = req.body;

    const pictures = req.files;

    try {
        if (pictures.length > 0) {
            return res.status(200).json(await uploadHospitalImages({ hospital_id, files: pictures }))
        }
        return res.status(400).json({ message: "Please upload images" });
    } catch (error) {
        next(error)
    }
})


// search for a hospital using specific keywords like name, address, 
// gps_address, phone number
router.post('/search-for-hospital', verify, async (req, res) => {
    const { search_text } = req.body;

    try {
        const results =  await Hospital.find({ 
            "$or": [
                {name: { $regex: search_text, '$options' : 'i' }},
                {address: { $regex: search_text, '$options' : 'i' }},
                {gps_address: { $regex: search_text, '$options' : 'i' }},
                {phone_number: { $regex: search_text }}
            ]
        });
    
        if (results == null) {
            return res.status(200).json({ message: "No hospital found", data: []})
        }
        return res.status(200).json({ message: "success", data: results });
    } catch (error) {
        return res.status(400).json({ message: "Something went wrong. Please try again" });
    }
});


// search for a nearby hospitals
router.post('/search-nearby-hospitals', verify, async (req, res, next) => {
    const { search_text, user_latitude, user_longitude } = req.body;

    try {
        return res.status(200).json(await searchNearbyHospital({ search_text, user_latitude, user_longitude }))
    } catch (error) {
        next(error);
    }
});

router.post('/fetch-hospital-information', verify, async (req, res, next) => {
    try {
        const result = await getHospitalDetails(req)

        if (result.status === 'success') {
            return res.status(200).json(result)
        }
        return res.status(400).json(result)
    } catch (error) {
        next(error)
    }
})

router.get('/check-if-user-has-hospital', verify, async (req, res,next) => {
    
})
module.exports = router;
