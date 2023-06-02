const router = require("express").Router();

const { addExistingEcentialsUserAsPatient } = require("../../../private/services/Hospital/Patient/patient.service");
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

module.exports = router;
