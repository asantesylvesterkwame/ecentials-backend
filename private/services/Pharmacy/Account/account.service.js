/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const { encryptPassword } = require("../../../helpers/functions");
const Store = require("../../../schemas/Store");
const { uploadFile } = require("../../Firebase/imageUpload.service");

// allow a business owner to create a new pharmacy
async function createNewPharmacy({ req }) {
  try {
    const uploadedDocumentUrl = await uploadFile(req.file, "businessDocument");
    const result = await Store.create({
      ...req.body,
      owner_id: req.user._id,
      password: encryptPassword(req.body.password),
      business_registration_document: uploadedDocumentUrl,
    });

    if (result != null) {
      return { message: "success", data: result };
    }
    return { message: "failed to create pharmacy, please try again" };
  } catch (error) {
    return { message: "an error occurred, please try again", error };
  }
}

async function updatePharmacyInformation({ req }) {
  try {
    let logo_url;

    const update_data = {
      ...req.body,
    };

    if (req.file) {
      logo_url = await uploadFile(req.file, `${req.body.store_id}/logo`);
      update_data.logo = logo_url;
    }

    const result = await Store.updateOne(
      {
        _id: req.body.store_id,
      },
      { ...update_data }
    );

    if (result.modifiedCount > 0) {
      return {
        status: "success",
        message: "update pharmacy information successfully",
      };
    }

    return { status: "fail", message: "failed to update pharmacy information" };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

module.exports = {
  createNewPharmacy,
  updatePharmacyInformation,
};
