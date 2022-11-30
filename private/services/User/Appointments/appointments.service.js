const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const Appointments = require("../../../schemas/Appointments");

// fetch all user appointments using status
// status can be upcoming, completed, canceled
async function getUserAppointments({ user_id, status }) {
    try {
        const results = await Appointments.aggregate([
            {$match: { user_id: ObjectId(user_id), status }},
            { $sort: { date: 1 } },
            {
                $lookup: {
                    from: 'staffs',
                    localField: "staff_id",
                    foreignField: "_id",
                    as: "Staff"
                }
            },
            { 
                $unwind: {
                    path: '$Staff',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hospitals",
                    localField: "facility_id",
                    foreignField: "_id",
                    as: "Hospital"
                }
            },
            { 
                $unwind: '$Hospital'
            },
            {
                $project: {
                    "_id": 1,
                    "user_id": 1,
                    "date": 1,
                    "time": 1,
                    "status": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "staff_name": "$Staff.name",
                    "staff_photo": "$Staff.photo",
                    "staff_first_name": "$Staff.first_name",
                    "staff_last_name": "$Staff.last_name",
                    "specialization": "$Staff.specification",
                    "hospital_name": "$Hospital.name",
                    "hospital_images": "$Hospital.images"
                }
            }
        ])
        return { message: "success", data: results };
    } catch (error) {
        return { message: "an error occurred, please try again"}
    }
}

// cancel an appointment 
async function cancelUserAppointment({ req }) {
    try {
        const result = await Appointments.updateOne({ 
            _id: req.body.appoint_id, 
            user_id: req.user._id 
        }, {
            "status": "cancelled"
        })

        if (result.modifiedCount > 0) {
            return { message: "success" }
        }

        return { message: "failed to cancel appointment, please try again" }
    } catch (error) {
        return { message: "an error occurred, please try again" }
    }
}

module.exports = {
    getUserAppointments,
    cancelUserAppointment,
}