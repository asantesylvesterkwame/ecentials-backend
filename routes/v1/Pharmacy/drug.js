const router = require('express').Router();

const Drug = require('../../../private/schemas/Drug');
const { searchDrugInSpecificPharmacy } = require('../../../private/services/Pharmacy/Drug/drug.service');
const verify = require('../../../verifyToken')


// allows a verified pharmacy to add a new drug to their 
// drugs catalog.
router.post('/add-new-drug', verify, async (req, res) => {
    const {
        store_id,
        name,
        prize,
        description,
        dosage,
        quantity,
        dosage_form,
        manufacturer,
        views,
        discount,
        nhis
    } = req.body;

    if (!!name && !!manufacturer && !!description) {
        Drug.create({
            store_id, name, prize, description, dosage, quantity, dosage_form, manufacturer, views,
            discount, nhis 
        }, (err, result) => {
            if (err) {
                return res.status(400).json({ message: "Failed to add drug. Try again later." });
            }
            return res.status(200).json({ message: 'success', data: result })
        });
    } else {
        res.status(403).json({ message: 'Please make sure you have provided the needed details.'});
    }
});

// list all drugs associated to a particular pharmacy or shop
router.post('', verify, async (req, res) => {
    const { store_id } = req.body;

    await Drug.find({ store_id }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: 'Failed to retrieve drugs. Try again later.' });
        }
        return res.status(200).json({ message: "ok", data: result });
    }).clone();
});

// search for a drug using name, manufacturer, description
router.post('/drug-search', verify, async (req, res) => {
    const { search_text } = req.body;

    await Drug.find({ 
        "$or": [
            {name: { $regex: search_text }},
            {description: { $regex: search_text }},
            {manufacturer: { $regex: search_text }}
        ]
     }, { }, (err, result) => {
         if (err) {
             return res.status(400).json({ message: 'Could not find drug. Try again later.'})
         }
         return res.status(200).json({ message: "success", data: result })
     }).clone();
});

// list details about a drug
router.post('/view-drug-details', verify, async (req, res) => {
    const { drug_id } = req.body;

    try {
        await Drug.findOne({ _id: drug_id }, async (err, result) => {
            if (err) {
                return res.status(400).json({ message: "Drug details not found" });
            }

            if (result) {
                // await Drug.updateOne({ _id: drug_id }, {$inc : { views: 1 }}, (err, _) => {
                //     if (err) {
                //         return res.status(400).json({ message: "Something went wrong. Please try again later."})
                //     }
                //     return res.status(200).json({ message: "success", data: result });
                // }).clone()
                let update_view_count = await Drug.updateOne({ _id: drug_id }, {$inc : { views: 1 }})

                if (update_view_count) {
                    return res.status(200).json({ message: "success", data: result });
                }
            }
        }).clone();
    } catch (error) {
        return res.status(400).json({ message: "An error occurred.", error })
    }
});

// list popular drug. This uses the views added during each detail view
// this can be reviewed later on to show how drug popularity is being displayed.
router.get('/list-popular-drugs', verify, async (req, res) => {
    try {
        const drugs = await Drug.find().sort({views: -1})

        if (drugs) {
            return res.status(200).json({ message: "success", data: drugs})
        }

        return res.status(200).json({ message: "success", data: [] })
    } catch (error) {
        return res.status(200).json({ message: "Something went wrong", })        
    }
})


// search for a drug in a particular pharmacy
router.post('/pharmacy-specific-drug-search', verify, async (req, res, next) => {
    const { search_text, store_id } = req.body;

    try {
        return res.json(await searchDrugInSpecificPharmacy({ search_text, store_id }));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
