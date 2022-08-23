const router = require('express').Router();


const Staff = require('../../../private/schemas/Staff');
const verify = require('../../../verifyToken')


// returns top rated doctors on the platform
// for simplicity sake, the current data returned is just
// the first five doctors from the db.
// implementations to be change later
router.get('/fetch-top-doctors', verify, async (req, res) => {
    try {
        const doctors = await Staff.find({}).limit(5)
        if (doctors == null) {
            return res.status(400).json({ message: "Could not fetch top doctors." });
        }
        return res.status(200).json({ message: "success", data: doctors });
    } catch (error) {
        return res.status(400).json({ message: "An error occurred", data: error })
    }
});

module.exports = router;
