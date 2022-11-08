const { encryptPassword } = require("../../../helpers/functions");
const Store = require("../../../schemas/Store");
const { uploadFile } = require("../../Firebase/imageUpload.service");

// allow a business owner to create a new pharmacy
async function createNewPharmacy({
    req
}) {
    try {
        const uploadedDocumentUrl = await uploadFile(req.file, "businessDocument")
        const result = await Store.create({
            ...req.body,
            owner_id: req.user._id,
            password: encryptPassword(req.body.password),
            business_registration_document: uploadedDocumentUrl
        })

        if (!result) {
            return { message: "success", data: result }
        }
        return { message: "failed to create pharmacy, please try again" }
    } catch (error) {
        return { message: "an error occurred, please try again" }
    }
}

module.exports = {
    createNewPharmacy,
}