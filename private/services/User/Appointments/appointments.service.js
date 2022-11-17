const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const Appointments = require("../../../schemas/Appointments");

// fetch all user appointments using status
// status can be upcoming, completed, canceled
async function getUserAppointments({ user_id, status }) {
    try {
        const results = await Appointments.aggregate([
            {$match: { user_id: ObjectId(user_id), status }},
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
                    "specialization": "$Staff.specification",
                    "hospital_name": "$Hospital.name",
                }
            }
        ])
        return { message: "success", data: results };
    } catch (error) {
        return { message: "an error occurred, please try again"}
    }
}

module.exports = {
    getUserAppointments
}