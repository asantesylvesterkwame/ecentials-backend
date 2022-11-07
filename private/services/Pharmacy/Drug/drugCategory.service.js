const DrugCategory = require("../../../schemas/DrugCategory");

// add a drug category
async function addDrugCategory({ name, status, pharmacy_id }) {
    try {
        const result = await DrugCategory.create({ name, status, pharmacy_id });
        
        if (result != null) {
            return { message: "success", data: result }
        }
        
        return { message: "could not add drug category"} 
    } catch (error) {
        return { message: "an error occurred, please try again" }
    }
}

module.exports = {
    addDrugCategory
}
