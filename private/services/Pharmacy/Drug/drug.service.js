const Drug = require("../../../schemas/Drug");


// This service allows a user to search for drugs
// in a specific pharmacy using keywords
async function searchDrugInSpecificPharmacy({ search_text, store_id }) {
    try {
        const results = await Drug.find({
            "$or": [
                {name: { $regex: search_text }},
                {description: { $regex: search_text }},
                {manufacturer: { $regex: search_text }}
            ],
            store_id
        });
        
        if (results) {
            return { message: "success", data: results };
        }
        return { message: "Drug not available in specified pharmacy"}
    } catch (error) {
        return { message: "An error occurred. Please try again."}
    }
}

module.exports = {
    searchDrugInSpecificPharmacy,
}