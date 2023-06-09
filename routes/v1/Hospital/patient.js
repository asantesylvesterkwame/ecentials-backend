const router = require("express").Router();

const {
  addExistingEcentialsUserAsPatient,
  registerNewPatient,
  addPatientVisit,
  searchPatientByPatientId,
} = require("../../../private/services/Hospital/Patient/patient.service");
const { verify } = require("../../../verifyToken");

router.post(
  "/:hospitalId/patients/add-ecentials-user",
  verify,
  async (req, res, next) => {
    try {
      const result = await addExistingEcentialsUserAsPatient(req);
      if (result.status === "success") {
        return res.status(201).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  "/:hospitalId/patients/register-new-patient",
  verify,
  async (req, res, next) => {
    try {
      const result = await registerNewPatient({ req });
      if (result.status === "success") {
        return res.status(201).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  "/:hospitalId/patients/:patientId/visits/new",
  verify,
  async (req, res, next) => {
    try {
      const result = await addPatientVisit({ req });
      if (result.status === "success") {
        return res.status(201).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/:hospitalId/patients", verify, async (req, res, next) => {
  try {
    const result = await searchPatientByPatientId(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(404).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
