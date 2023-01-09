const { verify } = require("jsonwebtoken");
const { getAmbulances, getTotalAmbulanceCount, createNewAmbulance } = require("../../../private/services/Ambulance/Vehicle/vehicle.service");

const router = require("express").Router();

router.post("/add-new-ambulance", verify, async (req, res, next) => {
  try {
    return res
      .status(201)
      .json(
        await createNewAmbulance(req)
      );
  } catch (error) {
    next(error);
  }
});

router.get("/get-total-ambulance-count", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await getTotalAmbulanceCount());
  } catch (error) {
    next(error);
  }
});

router.get("/get-all-ambulances", verify, async (req, res, next) => {
  try {
    const result = await getAmbulances()
    if (result.status === 'success') {
      return res.status(200).json(result)
    }
    return res.status(400).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
