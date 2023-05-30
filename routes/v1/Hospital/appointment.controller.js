const router = require("express").Router();
const {
  fetchAvailableAppointmentDates, getHospitalAppointments,
} = require("../../../private/services/Hospital/Appointment/appointment.service");
const { verify } = require("../../../verifyToken");

router.get(
  "/:hospital_id/appointments/fetch-available-appointments",
  verify,
  async (req, res, next) => {
    try {
      return res.status(200).json(await fetchAvailableAppointmentDates(req));
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/:hospitalId/appointments", verify, async (req, res, next) => {
  try {
    const result = await getHospitalAppointments(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(404).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
