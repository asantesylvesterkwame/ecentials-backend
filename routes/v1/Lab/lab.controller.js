const { createNewLab, fetchAllLabs, searchForLab } = require("../../../private/services/Lab/lab.service");
const verify = require("../../../verifyToken");

const router = require("express").Router();

// this route creates a new lab using
// data from the request body
router.post("/create-new-lab", async (req, res, next) => {
  const {
    name,
    address,
    opening_hours,
    phone_numbers,
    gps_address,
    hospital_id,
  } = req.body;

  try {
    return res.status(200).json(
      await createNewLab({
        name,
        address,
        opening_hours,
        phone_numbers,
        gps_address,
        hospital_id,
      })
    );
  } catch (error) {
    next(error);
  }
});

// fetch all labs for a verified user on the platform
router.get("", verify, async (req, res, next) => {
    try {
        return res.status(200).json(await fetchAllLabs());
    } catch (error) {
        next(error);
    }
});


// allow a verified user to search for a lab
router.post('/search-for-lab', verify, async (req, res, next) => {
    const { search_text } = req.body;
    try {
        return res.status(200).json(await searchForLab(search_text));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
