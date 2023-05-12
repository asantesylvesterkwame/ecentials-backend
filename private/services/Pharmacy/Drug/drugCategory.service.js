/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const DrugCategory = require("../../../schemas/DrugCategory");

// add a drug category
async function addDrugCategory({ name, status, pharmacy_id }) {
  try {
    const result = await DrugCategory.create({ name, status, pharmacy_id });

    if (result != null) {
      return { message: "success", data: result };
    }

    return { message: "could not add drug category" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// fetch all drug categories
async function getDrugCategories({ pharmacy_id }) {
  try {
    const results = await DrugCategory.find({ pharmacy_id });
    return { message: "success", data: results };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = {
  addDrugCategory,
  getDrugCategories,
};
