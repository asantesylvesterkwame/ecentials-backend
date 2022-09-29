const Store = require("../../../schemas/Store");

// retrieve information about a particular pharmacy
async function getPharmacyInformation(pharmacy_id) {
    try {
        const result = await Store.findById(pharmacy_id).exec();

        return { message: "success", data: result };
    } catch (error) {
        return { message: "An error occurred. Please try again.", error };
    }
}

module.exports = {
    getPharmacyInformation,
}
