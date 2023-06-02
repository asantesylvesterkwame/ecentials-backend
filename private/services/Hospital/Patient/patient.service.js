const { HospitalPatientException } = require("../../../exceptions/hospital");
const Patient = require("../../../schemas/Patient");

async function addExistingEcentialsUserAsPatient(req) {
    try {
        const result = await Patient.create({
            hospital: req.params.hospitalId,
            patient: req.body.userId,
        });
        if (!result) {
            return {
                status: "failed",
                message: "failed to register ecentials' user as patient",
            };
        }
        return {
            status: "success",
            message: "ecentials's user registered as patient successfully",
            data: result,
        };
    } catch (error) {
        throw new HospitalPatientException(`could not add ecentials user as patient. ${error}`);
    }
}

module.exports = {
    addExistingEcentialsUserAsPatient,
}