const Staff = require("../../../schemas/Staff");

// get all the staff registered to a pharmacy
async function getPharmacyStaff({ facility_id }) {
    try {
        const results = await Staff.find({ facility_id });
        return { message: "success", data: results };
    } catch (error) {
        return { message: "An error occurred. Please try again."};
    }
}


module.exports = {
    getPharmacyStaff
}
