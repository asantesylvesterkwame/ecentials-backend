const router = require('express').Router();

const { encryptPassword } = require('../../../private/helpers/functions');
const Store = require('../../../private/schemas/Store');
const verify = require('../../../verifyToken');
const getDistance = require('../../../private/helpers/get_distance');


// list all pharmacies
router.get('', verify, async (req, res) => {
    await Store.find({}, (err, result) => {
        if (err) {
            return res.status(400).json({message: 'Failed to retrieve pharmacies'});
        }
        res.status(200).json({message: 'success', data: result})
    }).clone();
});


// create a new pharmacy
router.post('/create-new-pharmacy', async (req, res) => {
    const { 
        store_pin, 
        name, 
        description, 
        address, 
        city, 
        licence_no,
        logo,
        accept_nhis,
        gps_lat,
        gps_lng,
     } = req.body;

     if (!!name && !!licence_no && !!city) {
         await Store.create({
             name, description, address, city, licence_no, logo, accept_nhis,
             gps_lat, gps_lng, store_pin: encryptPassword(store_pin)
         }, (err, result) => {
             if (err) {
                 return res.status(400).json({ message: 'Failed to create pharmacy.' });
             }
             return res.status(200).json({ message: 'success', data: result});
         });
     } else {
         return res.status(403).json({ message: 'Please make sure the correct data is provided' });
     }
});


// allow a user to search for a pharmacy using keywords,
// name, city, address
router.post('/search-for-pharmacy', verify, async (req, res) => {
    const { search_text } = req.body;

    await Store.find({ 
        "$or": [
            {name: { $regex: search_text, '$options' : 'i' }},
            {description: { $regex: search_text, '$options' : 'i' }},
            {address: { $regex: search_text, '$options' : 'i' }}
        ]
     }, (err, result) => {
         if (err) {
             return res.status(400).json({ message: 'Could not find pharmacy. Try again later.'})
         }
         return res.status(200).json({ message: "success", data: result })
     }).clone();

});


// allow a user to search verified pharmacies at a distance
// specified. This distance should not exceed 20 km.
// This might be a heavy task, in the future, it should be 
// refactored to make use of a queuing mechanism to avoid
// http request timeout
router.post('/search-nearby-pharmacies', verify, async (req, res) => {
    const { search_text, user_latitude, user_longitude } = req.body;

    try {
        const pharmacies = await Store.find({});
        
        if (pharmacies == null) {
            return res.status(400).json({ message: "No pharmacy available"});
        }

        let results = []

        let text = search_text.toLowerCase();

        pharmacies.forEach(pharmacy => {
            // get the distance between
            const distance = getDistance({lat1: user_latitude, lng1: user_longitude, lat2: pharmacy.gps_lat, 
                lng2: pharmacy.gps_lng});
            
            if (distance < 50.0) {
                // check if search text matches any of the params
                if (pharmacy.name.toLowerCase().includes(text) || pharmacy.description.toLowerCase().includes(text) || 
                pharmacy.address.toLowerCase().includes(text)) {
                    results.push(pharmacy);    
                }
            }
        });
        
        if (results.length == 0) {
            return res.status(200).json({ message: "No pharmacy found", data: [] });
        }

        return res.status(200).json({ message: "success", data: results})

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "An error occurred. Please try again later.", data: error});
    }
})

module.exports = router;
    