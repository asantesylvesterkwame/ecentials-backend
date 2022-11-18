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

//fetch drug name when provided with the drug id
async function fetchDrugName(drug_id){
    console.log(drug_id)
    const drug_details = await Drug.find({_id: drug_id}, {name: 1})
    if(drug_details){
        //extracting drug name from drug details
       return drug_details
    }
    else{
        return {
            message: "No drug with the provided id"
        }
    }
}

module.exports = {
    searchDrugInSpecificPharmacy,
    fetchDrugName
}