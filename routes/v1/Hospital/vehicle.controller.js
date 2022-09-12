const { verify } = require("jsonwebtoken");
const {
  createNewAmbulance,
} = require("../../../private/services/Hospital/Vehicle/vehicle.service");

const router = require("express").Router();

router.post("/add-new-ambulance", verify, async (req, res, next) => {
  const { driver_id, name, licence_no, brand, color, insurance } = req.body;

  try {
    return res
      .status(201)
      .json(
        await createNewAmbulance(
          driver_id,
          name,
          licence_no,
          brand,
          color,
          insurance
        )
      );
  } catch (error) {
      next(error);
  }
});

module.exports = router;
