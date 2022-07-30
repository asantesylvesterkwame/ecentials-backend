const router = require('express').Router();

const Prescription = require('../../../private/schemas/Prescription');
const verify = require('../../../verifyToken')


// upload a new prescription
// this is done by a user on the ecentials themselves.
router.post('/new-prescription', verify, async (req, res) => {
   const user_id = req.user._id;
   const { status, image } = req.body;
   
   if (!!user_id && !!status ) {
    await Prescription.create({
        user_id, status, image
    }, (err, result) => {
        if (err) {
            return res.status(400).json({message: 'Failed to save prescription'})
        }
        return res.status(200).json({message: 'success', data: result});
    } );
   } else {
       return res.status(400).json({message: "Please provide the necessary data"});
   }
});


// upload a new prescription - pharmacists
// this upload is done by the pharmacists on behalf of the user.
// if the user details is not in the system, the pharmacists add them.
router.post('/upload-prescription-by-pharmacists', verify, async (req, res) => {
    const { user_id, status, store_id } = req.body; 

    if (!!user_id && !!store_id ) {
        await Prescription.create({
            user_id, status, store_id
        }, (err, result) => {
            if (err) {
                return res.status(400).json({message: 'Failed to save prescription'})
            }
            return res.status(200).json({message: 'success', data: result});
        } );
       } else {
           return res.status(400).json({message: "Please provide the necessary data"});
       }
});


module.exports = router;
