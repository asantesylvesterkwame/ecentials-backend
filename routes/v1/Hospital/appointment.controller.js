const router = require("express").Router();
const {
  isCorrectDate,
} = require("../../../private/middlewares/custom_middlewares");
const {
  fetchAvailableAppointmentDates,
  getHospitalAppointments,
  createHospitalAppointment,
  cancelHospitalAppointment,
  rescheduleHospitalAppointment,
  getBookedAppointmentDatesForHospital,
  getHospitalAppointmentsForADay,
  getHospitalAppointmentsForAWeek,
  getHospitalAppointmentsForAMonth,
  getBookedAppointmentsForWeek,
  getBookedAppointmentsByMonth,
  getADayAppointmentForDoctors,
  setAvailabilityDatesForDoctor,
  getAppointmentsForSpecificDoctor,
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

router.post(
  "/:hospitalId/appointments/create",
  [verify, isCorrectDate],
  async (req, res, next) => {
    try {
      const result = await createHospitalAppointment({ req });
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.patch(
  "/:hospitalId/appointments/:appointmentId/cancel",
  verify,
  async (req, res, next) => {
    try {
      const result = await cancelHospitalAppointment(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.patch(
  "/:hospitalId/appointments/:appointmentId/reschedule",
  [verify, isCorrectDate],
  async (req, res, next) => {
    try {
      const result = await rescheduleHospitalAppointment(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/:hospitalId/appointments/booked-appointment-date",
  verify,
  async (req, res, next) => {
    try {
      const result = await getBookedAppointmentDatesForHospital(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/:hospitalId/appointments/day", verify, async (req, res, next) => {
  try {
    const result = await getHospitalAppointmentsForADay(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(404).json(result);
  } catch (error) {
    return next(error);
  }
});

router.get("/:hospitalId/appointments/week", verify, async (req, res, next) => {
  try {
    const result = await getHospitalAppointmentsForAWeek(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(404).json(result);
  } catch (error) {
    return next(error);
  }
});

router.get(
  "/:hospitalId/appointments/month",
  verify,
  async (req, res, next) => {
    try {
      const result = await getHospitalAppointmentsForAMonth(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/:hospitalId/appointments/booked/week",
  verify,
  async (req, res, next) => {
    try {
      const result = await getBookedAppointmentsForWeek(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/:hospitalId/appointments/booked/month",
  verify,
  async (req, res, next) => {
    try {
      const result = await getBookedAppointmentsByMonth(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/:hospitalId/doctor/appointments/day",
  verify,
  async (req, res, next) => {
    try {
      const result = await getADayAppointmentForDoctors(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.patch(
  "/:hospitalId/doctor/available-days",
  verify,
  async (req, res, next) => {
    try {
      const result = await setAvailabilityDatesForDoctor(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/:hospitalId/doctor/appointments",
  verify,
  async (req, res, next) => {
    try {
      const result = await getAppointmentsForSpecificDoctor(req);
      if (result.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
