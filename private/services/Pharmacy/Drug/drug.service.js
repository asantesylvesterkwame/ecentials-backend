const { async } = require("@firebase/util");
const Drug = require("../../../schemas/Drug");
const { uploadFile } = require("../../Firebase/imageUpload.service");


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

// add a drug / product to a pharmacy inventory
async function addDrugToInventory({ req }) {
    try {
        const image_url = await uploadFile(req.file, `drugs/${req.body.store_id}`)

        const result = await Drug.create({
            ...req.body,
            image: image_url
        })

        if (result) {
            return { message: "success", data: result }
        }

        return { message: "failed to add drug, please try again" }
    } catch (error) {
        return { message: "an error occurred, please try again", error }
    }
}

// get all drugs/products associated to a pharmacy
async function fetchAllPharmacyDrugs({ req }) {
    try {
        const drugs = await Drug.find({ ...req.body })
        return { message: "success", data: drugs }
    } catch (error) {
        return { message: "an error occurred, please try again" }
    }
}

// return a count of drugs/products in a pharmacy
async function countPharmacyDrugs({ req }) {
    try {
        const count = await Drug.find({ ...req.body }).count()
        return { message: "success", data: count }
    } catch (error) {
        return { message: "an error occurred, please try again" }
    }
}

module.exports = {
    searchDrugInSpecificPharmacy,
    addDrugToInventory,
    fetchAllPharmacyDrugs,
    countPharmacyDrugs,
}