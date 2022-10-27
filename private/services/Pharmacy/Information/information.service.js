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

// check whether an business owner has a pharmacy
async function isBusinessOwnerHavingPharmacy({ owner_id }) {
    try {
        const result = await Store.find({ owner_id });
        
        if (result.length > 0) return { message: "success", data: result, has_pharmacy: true };
        
        return { message: "success", has_pharmacy: false };
    } catch (error) {
        return { message: "an error occurred, please try again" };
    }
}

module.exports = {
    getPharmacyDetails,
    isBusinessOwnerHavingPharmacy,
}