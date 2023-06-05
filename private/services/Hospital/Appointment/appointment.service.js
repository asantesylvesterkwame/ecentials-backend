/* eslint-disable no-underscore-dangle */
const {
  HospitalAppointmentException,
} = require("../../../exceptions/hospital");
const CancelledAppointmentTemplate = require("../../../helpers/email_templates/Hospital/cancelled_appointment");
const RescheduledAppointmentTemplate = require("../../../helpers/email_templates/Hospital/rescheduled_appointment");
const HospitalAppointmentTemplate = require("../../../helpers/email_templates/hospital_appointment");
const sendAndCreateNotification = require("../../../helpers/send_and_create_notification");
const Appointments = require("../../../schemas/Appointments");
const Hospital = require("../../../schemas/Hospital");
const { findUserById } = require("../../User/Account/account.service");
const sendMail = require("../../send_email");
const { findHospitalById } = require("../hospital.service");

/**
 * @param [req] request object
 * @returns [Object] object of available appointment dates if a there exists
 * @returns [Object] object if an error occurs
 *
 * checks the available appointment dates for a hospital
 */
async function fetchAvailableAppointmentDates(req) {
  try {
    const result = await Hospital.findById(req.params.hospital_id);
    if (result != null) {
      return {
        status: "success",
        message: "appointment dates retrieved successfully",
        data: result.available_appointment_dates,
      };
    }
    return {
      status: "success",
      message: "no appointment dates found",
      data: [],
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function getHospitalAppointments(req) {
  try {
    const result = await Appointments.find({
      facility_id: req.params.hospitalId,
    });
    if (!result) {
      return {
        status: "failed",
        message: "could not retrieve hospital appointments",
      };
    }
    return {
      status: "success",
      message: "successfully retrieved appointments",
      data: result,
    };
  } catch (error) {
    throw new Error(`could not retrieve hospital appointments. ${error}`);
  }
}

async function createHospitalAppointment({ req }) {
  try {
    const user = await findUserById(req.body.user_id);
    const hospital = await findHospitalById(req.params.hospitalId);

    const result = await Appointments.create({
      ...req.body,
      facility_id: req.params.hospitalId,
    });

    if (!result) {
      return {
        status: "failed",
        message: "could not create new appointment",
      };
    }

    const mailBody = HospitalAppointmentTemplate(
      user.personal.name,
      result.date.toDateString(),
      result.time.toLocaleTimeString(),
      hospital.name,
      hospital.location,
      hospital.phone_number
    );

    Promise.all([
      sendMail(user.email, mailBody),
      sendAndCreateNotification(
        user.fcm_token,
        user._id,
        "New Appointment Scheduled",
        "please find details of your appointment",
        { launch_url: "appointment", id: `${result._id}` }
      ),
    ]);

    return {
      status: "success",
      message: "successfully created appointment",
      data: result,
    };
  } catch (error) {
    throw new Error(`could not create appointment. ${error}`);
  }
}

async function cancelHospitalAppointment(req) {
  try {
    const currentDate = new Date();
    const user = await findUserById(req.body.user_id);
    const hospital = await findHospitalById(req.params.hospitalId);

    const result = await Appointments.findByIdAndUpdate(
      req.params.appointmentId,
      {
        $set: { status: "cancelled", updatedAt: currentDate },
      }
    );

    if (!result) {
      return {
        status: "failed",
        message: "could not cancel appointment",
      };
    }

    const mailBody = CancelledAppointmentTemplate(
      user.personal.name,
      result.date.toDateString(),
      result.time.toLocaleTimeString(),
      hospital.name,
      hospital.location,
      hospital.phone_number
    );

    Promise.all([
      sendMail(user.email, mailBody),
      sendAndCreateNotification(
        user.fcm_token,
        user._id,
        "Appointment cancelled",
        "your hospital appointment was cancelled",
        { launch_url: "appointment", id: `${result._id}` }
      ),
    ]);

    return {
      status: "success",
      message: "successfully cancelled appointment",
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not cancel appointment. ${error}`
    );
  }
}

async function rescheduleHospitalAppointment(req) {
  try {
    const currentDate = new Date();
    const user = await findUserById(req.body.user_id);
    const hospital = await findHospitalById(req.params.hospitalId);

    const initialAppointmentState = await Appointments.findById(
      req.params.appointmentId
    );

    const result = await Appointments.findByIdAndUpdate(
      req.params.appointmentId,
      {
        $set: {
          status: "upcoming",
          date: req.body.date,
          time: req.body.time,
          updatedAt: currentDate,
        },
      }
    );

    if (!result) {
      return {
        status: "failed",
        message: "could not reschedule appointment",
      };
    }

    const mailBody = RescheduledAppointmentTemplate(
      user.personal.name,
      result.date.toDateString(),
      result.time.toLocaleTimeString(),
      hospital.name,
      hospital.location,
      hospital.phone_number,
      initialAppointmentState.date.toLocaleDateString(),
      initialAppointmentState.time.toLocaleTimeString()
    );

    Promise.all([
      sendMail(user.email, mailBody),
      sendAndCreateNotification(
        user.fcm_token,
        user._id,
        "Appointment rescheduled",
        "your hospital appointment has been rescheduled",
        { launch_url: "appointment", id: `${result._id}` }
      ),
    ]);

    return {
      status: "success",
      message: "successfully rescheduled appointment",
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not reschedule appointment. ${error}`
    );
  }
}

async function getBookedAppointmentDatesForHospital(req) {
  try {
    const result = await Appointments.find({
      facility_id: req.params.hospitalId,
    }).select("date time");
    if (!result) {
      return {
        status: "failed",
        message: "booked appointments not found",
      };
    }
    return {
      status: "success",
      message: "booked appointment dates retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve booked appointment dates. ${error}`
    );
  }
}

module.exports = {
  fetchAvailableAppointmentDates,
  getHospitalAppointments,
  createHospitalAppointment,
  cancelHospitalAppointment,
  rescheduleHospitalAppointment,
  getBookedAppointmentDatesForHospital,
};
