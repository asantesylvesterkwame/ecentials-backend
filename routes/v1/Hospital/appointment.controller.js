const {
  fetchAvailableAppointmentDates,
} = require("../../../private/services/Hospital/Appointment/appointment.service");
const { verify } = require("../../../verifyToken");

const router = require("express").Router();

router.get(
  "/:hospital_id/appointments/fetch-available-appointments",
  verify,
  async (req, res, next) => {
    try {
      return res.status(200).json(await fetchAvailableAppointmentDates(req));
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
