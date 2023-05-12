/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const Appointments = require("../../../schemas/Appointments");
const User = require("../../../schemas/User");
const BaseTemplate = require("../../../helpers/base_mail");
const sendMail = require("../../send_email");
const { getDoctorById } = require("../../Hospital/Doctor/doctor.service");
const { findUserById } = require("../Account/account.service");

// fetch all user appointments using status.
// status can be upcoming, completed, canceled
async function getUserAppointments({ user_id, status, facility_type }) {
  try {
    const results = await Appointments.aggregate([
      { $match: { user_id: ObjectId(user_id), status, facility_type } },
      { $sort: { date: 1 } },
      {
        $lookup: {
          from: "staffs",
          localField: "staff_id",
          foreignField: "_id",
          as: "Staff",
        },
      },
      {
        $unwind: {
          path: "$Staff",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "facility_id",
          foreignField: "_id",
          as: "Hospital",
        },
      },
      {
        $unwind: {
          path: "$Hospital",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "labs",
          localField: "facility_id",
          foreignField: "_id",
          as: "Lab",
        },
      },
      {
        $unwind: {
          path: "$Lab",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          date: 1,
          time: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          staff_name: "$Staff.name",
          staff_photo: "$Staff.photo",
          staff_first_name: "$Staff.first_name",
          staff_last_name: "$Staff.last_name",
          specialization: "$Staff.specification",
          hospital_name: "$Hospital.name",
          hospital_id: "$Hosptial._id",
          hospital_images: "$Hospital.images",
          lab_name: "$Lab.name",
          lab_id: "$Lab._id",
          lab_images: "$Lab.images",
        },
      },
    ]);
    return { message: "success", data: results };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// cancel an appointment
async function cancelUserAppointment({ req }) {
  try {
    const result = await Appointments.updateOne(
      {
        _id: req.body.appoint_id,
        user_id: req.user._id,
      },
      // eslint-disable-next-line prettier/prettier
      { status: "cancelled" },
    );

    if (result.modifiedCount > 0) {
      return { message: "success" };
    }

    return { message: "failed to cancel appointment, please try again" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

const _checkifDoctorIsPrimaryDoctor = async (user_id, doctor_id) => {
  try {
    const doctor = await getDoctorById(doctor_id);

    if (doctor !== null) {
      const result = await User.find({
        _id: user_id,
        primary_doctors: { $in: [doctor_id] },
      });

      if (result !== null) {
        return true;
      }
    }
    return false;
  } catch (error) {
    throw new Error("failed checking for primary doctor");
  }
};

const _sendAppointmentEmail = async (user_id, appointment_date, doctor_id) => {
  try {
    const doctor = await getDoctorById(doctor_id);
    const user = await findUserById(user_id);

    const email_body = BaseTemplate(
      "New Appointment Scheduled",
      "Appointment details",
      `Doctor's name: ${doctor.last_name} ${doctor.first_name}, 
            date: ${appointment_date.toDateString()} at ${appointment_date.toLocaleTimeString()}`,
      "imgs/logo_ios.png",
      "not-me-password-reset"
    );

    await sendMail(user.email, email_body);
  } catch (error) {
    throw new Error("failed to send appointment email");
  }
};

/**
 * Allow a user to book an appointment with a primary doctor
 * if doctor is not in primary doctor's appointment booking
 * is denied
 */
async function bookAppointmentWithDoctor(req) {
  try {
    const isDoctorAPrimaryDoctor = await _checkifDoctorIsPrimaryDoctor(
      req.user._id,
      req.body.doctor_id
    );

    if (!isDoctorAPrimaryDoctor) {
      return {
        status: "failed",
        message: "you can only book appointment with primary doctor",
      };
    }

    const result = await Appointments.create({
      user_id: req.user._id,
      date: req.body.date,
      time: req.body.time,
    });

    if (result === null) {
      return {
        status: "failed",
        message: "failed to book appointment with doctor",
      };
    }

    // send appointment email to user
    await _sendAppointmentEmail(req.user._id, result.date, req.body.doctor_id);

    return {
      status: "success",
      message: "appointment successfully booked",
      data: result,
    };
  } catch (error) {
    throw new Error("failed to book appointment");
  }
}

module.exports = {
  getUserAppointments,
  cancelUserAppointment,
  bookAppointmentWithDoctor,
};
