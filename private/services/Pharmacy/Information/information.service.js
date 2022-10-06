const Store = require("../../../schemas/Store");

// retrieve pharmacy details using pharmacy id
async function getPharmacyDetails({ pharmacy_id }) {
    try {
        const results = await Store.findOne({ _id: pharmacy_id });
        return { message: "success", data: results };
    } catch (error) {
        return { message: "No pharmacy found", data: [] };
    }
}


module.exports = {
    getPharmacyDetails
}