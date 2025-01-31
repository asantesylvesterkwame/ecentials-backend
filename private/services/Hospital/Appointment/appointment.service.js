/* eslint-disable no-underscore-dangle */
const { ObjectId } = require("mongoose").Types;

const {
  HospitalAppointmentException,
} = require("../../../exceptions/hospital");
const CancelledAppointmentTemplate = require("../../../helpers/email_templates/Hospital/cancelled_appointment");
const RescheduledAppointmentTemplate = require("../../../helpers/email_templates/Hospital/rescheduled_appointment");
const HospitalAppointmentTemplate = require("../../../helpers/email_templates/hospital_appointment");
const sendAndCreateNotification = require("../../../helpers/send_and_create_notification");
const Appointments = require("../../../schemas/Appointments");
const Hospital = require("../../../schemas/Hospital");
const Staff = require("../../../schemas/Staff");
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

async function getHospitalAppointmentsForADay(req) {
  try {
    const date = new Date(req.query.date);
    const endDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

    const result = await Appointments.find({
      facility_id: req.params.hospitalId,
      date: {
        $gte: date,
        $lte: endDate,
      },
    });
    if (!result) {
      return {
        status: "failed",
        message: "no appointments found for specified date",
      };
    }
    return {
      status: "success",
      message: "appointments retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve appointments for specified date. ${error}`
    );
  }
}

async function getHospitalAppointmentsForAWeek(req) {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const result = await Appointments.find({
      facility_id: req.params.hospitalId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    if (!result) {
      return {
        status: "failed",
        message: "no appointments found for specified week",
      };
    }
    return {
      status: "success",
      message: "appointments retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve appointments for specified date. ${error}`
    );
  }
}

async function getHospitalAppointmentsForAMonth(req) {
  try {
    const currentYear = new Date().getFullYear();

    const result = await Appointments.find({
      $expr: {
        $and: [
          { facility_id: ObjectId(req.params.hospitalId) },
          { $eq: [{ $year: "$date" }, currentYear] },
          { $eq: [{ $month: "$date" }, req.query.month] },
        ],
      },
    });

    if (!result) {
      return {
        status: "failed",
        message: "no appointments found for specified month",
      };
    }
    return {
      status: "success",
      message: "appointments retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve appointments for specified date. ${error}`
    );
  }
}

async function getBookedAppointmentsForWeek(req) {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const result = await Appointments.aggregate([
      {
        $match: {
          facility_id: ObjectId(req.params.hospitalId),
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          facility_id: 1,
          staff_id: 1,
          date: 1,
          time: 1,
          status: 1,
          facility_type: 1,
          createdAt: 1,
          updatedAt: 1,
          patientFirstName: "$user.firstName",
          patientLastName: "$user.lastName",
          patientId: "$user.uniqueId",
        },
      },
    ]);
    if (!result) {
      return {
        status: "failed",
        message: "no booked appointments found for specified week",
      };
    }
    return {
      status: "success",
      message: "appointments retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve booked appointments for specified date. ${error}`
    );
  }
}

async function getBookedAppointmentsByMonth(req) {
  try {
    const currentYear = new Date().getFullYear();
    const { month } = req.query;

    const result = await Appointments.aggregate([
      {
        $match: {
          facility_id: ObjectId(req.params.hospitalId),
          date: {
            $gte: new Date(currentYear, month - 1, 1),
            $lt: new Date(currentYear, month, 1),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          facility_id: 1,
          staff_id: 1,
          date: 1,
          time: 1,
          status: 1,
          facility_type: 1,
          createdAt: 1,
          updatedAt: 1,
          patientFirstName: "$user.firstName",
          patientLastName: "$user.lastName",
          patientId: "$user.uniqueId",
        },
      },
    ]);
    if (!result) {
      return {
        status: "failed",
        message: "no booked appointments found for specified month",
      };
    }
    return {
      status: "success",
      message: "appointments retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve booked appointments for specified month. ${error}`
    );
  }
}

async function getADayAppointmentForDoctors(req) {
  try {
    const date = new Date(req.query.date);
    const endDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

    const result = await Appointments.aggregate([
      {
        $match: {
          facility_id: ObjectId(req.params.hospitalId),
          staff_id: ObjectId(req.user._id),
          date: {
            $gte: date,
            $lte: endDate,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          facility_id: 1,
          staff_id: 1,
          date: 1,
          time: 1,
          status: 1,
          facility_type: 1,
          createdAt: 1,
          updatedAt: 1,
          patientFirstName: "$user.firstName",
          patientLastName: "$user.lastName",
          patientId: "$user.uniqueId",
        },
      },
    ]);
    if (!result) {
      return {
        status: "failed",
        message: "no appointments found for specified day",
      };
    }
    return {
      status: "success",
      message: "appointments retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve appointments for specified day. ${error}`
    );
  }
}

async function setAvailabilityDatesForDoctor(req) {
  try {
    const isAvailableDate = await Hospital.findOne({
      _id: req.params.hospitalId,
      available_appointment_dates: {
        $in: [req.body.date],
      },
    });

    if (!isAvailableDate) {
      return {
        status: "failed",
        message: "selected date is not available",
      };
    }

    const result = await Staff.findByIdAndUpdate(req.user._id, {
      $push: { availableDates: req.body.date },
    });

    if (!result) {
      return {
        status: "failed",
        message: "could not set availability date",
      };
    }
    return {
      status: "success",
      message: "availability date set successfully",
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not set availability date for doctor. ${error}`
    );
  }
}

async function getAppointmentsForSpecificDoctor(req) {
  try {
    const result = await Appointments.aggregate([
      {
        $match: {
          facility_id: ObjectId(req.params.hospitalId),
          staff_id: ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          facility_id: 1,
          staff_id: 1,
          date: 1,
          time: 1,
          status: 1,
          facility_type: 1,
          createdAt: 1,
          updatedAt: 1,
          patientPersonalInfo: "$user.personal",
          patientHealthInfo: "$user.health",
          patientId: "$user.uniqueId",
        },
      },
    ]);
    if (!result) {
      return {
        status: "failed",
        message: "no appointments found for doctor",
      };
    }
    return {
      status: "success",
      message: "appointments retrieved successfully",
      data: result,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve doctor's appointment. ${error}`
    );
  }
}

async function getAvailableAppointmentDatesForDoctor(req) {
  try {
    const result = await Staff.find({
      facility_id: req.params.hospitalId,
      _id: req.params.doctorId,
    });

    if (!result) {
      return {
        status: "failed",
        message: "no available dates found",
      };
    }
    return {
      status: "success",
      message: "successfully retrieved available dates",
      data: result[0].availableDates,
    };
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not retrieve available dates. ${error}`
    );
  }
}

async function searchAppointmentByPatientNameAndId(req) {
  try {
    const result = await Appointments.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { "user.uniqueId": req.query.q },
            { "user.personal.firstName": req.query.q },
            { "user.personal.lastName": req.query.q },
          ],
          facility_id: ObjectId(req.params.hospitalId),
        },
      },
      {
        $project: {
          _id: 1,
          facility_id: 1,
          staff_id: 1,
          date: 1,
          time: 1,
          status: 1,
          patientPersonalInfo: "$user.personal",
          patientHealthInfo: "$user.health",
          patientId: "$user.uniqueId",
        },
      },
    ]);

    return result;
  } catch (error) {
    throw new HospitalAppointmentException(
      `could not search patient. ${error}`
    );
  }
}

async function getHospitalAppointments(req) {
  try {
    let result;

    if (req.query.q) {
      result = await searchAppointmentByPatientNameAndId(req);
    } else {
      result = await Appointments.find({
        facility_id: req.params.hospitalId,
      });
    }

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

module.exports = {
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
  getAvailableAppointmentDatesForDoctor,
  searchAppointmentByPatientNameAndId,
};
