const router = require('express').Router();

const { encryptPassword } = require('../../../private/helpers/functions');
const Store = require('../../../private/schemas/Store');
const verify = require('../../../verifyToken')


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
router.get('/search-for-pharmacy', verify, async (req, res) => {
    const { search_text } = req.body;

    await Store.find({ 
        "$or": [
            {name: { $regex: search_text }},
            {description: { $regex: search_text }},
            {address: { $regex: search_text }}
        ]
     }, (err, result) => {
         if (err) {
             return res.status(400).json({ message: 'Could not find pharmacy. Try again later.'})
         }
         return res.status(200).json({ message: "success", data: result })
     }).clone();

});



module.exports = router;
    