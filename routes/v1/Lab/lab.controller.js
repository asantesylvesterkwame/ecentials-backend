const { createNewLab } = require("../../../private/services/Lab/lab.service");

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

module.exports = router;
