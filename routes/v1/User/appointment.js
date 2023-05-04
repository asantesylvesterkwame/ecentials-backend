const router = require("express").Router();

const { verify } = require("../../../verifyToken");
const Appointments = require("../../../private/schemas/Appointments");
const {
  getUserAppointments,
  cancelUserAppointment,
  bookAppointmentWithDoctor,
} = require("../../../private/services/User/Appointments/appointments.service");
const sendMail = require("../../../private/services/send_email");
const {
  findUserById,
} = require("../../../private/services/User/Account/account.service");
const BaseTemplate = require("../../../private/helpers/base_mail");
const getFacility = require("../../../private/helpers/get_facility");
const {
  isCorrectDate,
} = require("../../../private/middlewares/custom_middlewares");

router.post("", verify, async (req, res, next) => {
  const user_id = req.user._id;

  const { status, facility_type } = req.body;

  // Appointments.find({ user_id, status }, (err, result) => {
  //     if (err) {
  //         return res.status(400).json({ message: 'Failed to load appointments' });
  //     }
  //     return res.status(200).send({ message: 'success', data: result });
  // }).clone();
  try {
    return res
      .status(200)
      .json(await getUserAppointments({ user_id, status, facility_type }));
  } catch (error) {
    next(error);
  }
});

// create a new user appointment
router.post("/book-an-appointment", verify, async (req, res, next) => {
  const user_id = req.user._id;
  const { staff_id, facility_id, date, time, status, facility_type } = req.body;

  let current_date = new Date().toJSON().slice(0, 10);

  if (new Date(date) < new Date(current_date)) {
    return res
      .status(400)
      .json({ message: "provide a current or future date" });
  }

  try {
    await Appointments.create(
      {
        user_id,
        staff_id,
        date,
        time,
        status,
        facility_id,
        facility_type,
      },
      async (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({
              message: "Failed to book appointment. Try again later",
              err,
            });
        }

        const user_email = await findUserById(user_id);
        const facility_name = await getFacility(facility_id, facility_type);
        const appointment_date = new Date(date);

        const email_body = BaseTemplate(
          "New Appointment Scheduled",
          "Appointment details",
          `Facility name: ${facility_name.name}, 
                    date: ${appointment_date.toDateString()} at ${appointment_date.toLocaleTimeString()}`,
          "imgs/logo_ios.png",
          "not-me-password-reset"
        );

        await sendMail(user_email.email, email_body);

        return res.status(200).json({ message: "success", data: result });
      }
    );
  } catch (error) {
    next(error);
  }
});

// allow a user to reschedule an appointment to a different date
router.post("/reschedule-appointment-date", verify, async (req, res) => {
  const user_id = req.user._id;
  const { appoint_id, date, time } = req.body;

  try {
    const result = await Appointments.updateOne(
      { user_id, _id: appoint_id },
      { date, time }
    );
    if (result == null) {
      return res
        .status(200)
        .json({ message: "Failed to reschedule appointment." });
    }
    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "An error occurred. Please try again later." });
  }
});

// allow a verified user to cancel an appointment
router.post("/cancel-an-appointment", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await cancelUserAppointment({ req }));
  } catch (error) {
    next(error);
  }
});

/**
 * book appointment with doctor
 */
router.post(
  "/book-appointment-with-doctor",
  [verify, isCorrectDate],
  async (req, res, next) => {
    try {
      const result = await bookAppointmentWithDoctor(req);
      if (req.status === "success") {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
