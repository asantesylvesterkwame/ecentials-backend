const mongoose = require("mongoose");
const { DRUG_RETURN_DATA, STORE_AND_CATEGORY_LOOKUP } = require("../../../helpers/constants");
const DefaultDrug = require("../../../schemas/DefaultDrug");

const ObjectId = mongoose.Types.ObjectId;
const Drug = require("../../../schemas/Drug");
const { uploadFile } = require("../../Firebase/imageUpload.service");

// This service allows a user to search for drugs
// in a specific pharmacy using keywords
async function searchDrugInSpecificPharmacy({ search_text, store_id }) {
  try {
    const results = await Drug.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: search_text, '$options' : 'i' } },
            { description: { $regex: search_text, '$options' : 'i' } },
            { manufacturer: { $regex: search_text, '$options' : 'i' } },
          ],
          store_id: ObjectId(store_id)
        }
      },
      ...STORE_AND_CATEGORY_LOOKUP,
      {
        $project: {
          ...DRUG_RETURN_DATA
        }
      }
    ])

    if (results) {
      return { message: "success", data: results };
    }
    return { message: "Drug not available in specified pharmacy" };
  } catch (error) {
    return { message: "An error occurred. Please try again." };
  }
}

// add a drug / product to a pharmacy inventory
async function addDrugToInventory({ req }) {
  try {
    const image_url = await uploadFile(req.file, `drugs/${req.body.store_id}`);

    const result = await Drug.create({
      ...req.body,
      image: image_url,
    });

    if (result) {
      return { message: "success", data: result };
    }

    return { message: "failed to add drug, please try again" };
  } catch (error) {
    return { message: "an error occurred, please try again", error };
  }
}

// get all drugs/products associated to a pharmacy
async function fetchAllPharmacyDrugs({ req }) {
  try {
    const drugs = await Drug.aggregate([
      {
        $match: {
          store_id: ObjectId(req.body.store_id)
        }
      },
      ...STORE_AND_CATEGORY_LOOKUP,
      {
        $project: {
          ...DRUG_RETURN_DATA
        }
      }
    ])
    return { message: "success", data: drugs };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// return a count of drugs/products in a pharmacy
async function countPharmacyDrugs({ req }) {
  try {
    const count = await Drug.find({ ...req.body }).count();
    return { message: "success", data: count };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// get information about a drug
async function getDrugInformation({ req }) {
  try {
    // this update code would be reviewed and refactored
    await Drug.updateOne({ _id: req.body.drug_id }, { $inc: { views: 1 } });

    const drug = await Drug.aggregate([
      { $match: { _id: ObjectId(req.body.drug_id) } },
      {
        $lookup: {
          from: "drugcategories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "stores",
          localField: "store_id",
          foreignField: "_id",
          as: "store",
        },
      },
      {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          ...DRUG_RETURN_DATA
        }
      }
    ]);
    return { message: "success", data: drug };
  } catch (error) {
    return { message: "an error occurred, please try again", error };
  }
}

// list popular drugs
async function getPopularDrugs() {
  try {
    const result = await Drug.aggregate([
      { 
        $match: { 
          total_stock: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: "drugcategories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "stores",
          localField: "store_id",
          foreignField: "_id",
          as: "store",
        },
      },
      {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          ...DRUG_RETURN_DATA
        }
      }
    ])
      .sort({ views: -1 })
      .limit(5);
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

async function updateDrugDetail({ req }) {
  try {
    let image_url, result;

    if (req.file) {
      image_url = await uploadFile(req.file, `drugs/${req.body.store_id}`);

      result = await Drug.updateOne(
        {
          _id: req.body.drug_id,
        },
        {
          ...req.body,
          image: image_url,
        }
      );
    } else {
      result = await Drug.updateOne(
        {
          _id: req.body.drug_id,
        },
        {
          ...req.body,
        }
      );
    }

    if (result.matchedCount > 0) {
      return { message: "success" };
    }
    return { message: "failed to update drug" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

// list top drugs in a pharmacy
async function getPopularDrugsInPharmacy({ req }) {
    try {
        const result = await Drug.aggregate([
            { $match: { store_id: ObjectId(req.body.store_id) }},
            {
                $lookup: {
                  from: "drugcategories",
                  localField: "category_id",
                  foreignField: "_id",
                  as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "stores",
                    localField: "store_id",
                    foreignField: "_id",
                    as: "store",
                },
            },
            {
                $unwind: {
                  path: "$store",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
              $project: {
                ...DRUG_RETURN_DATA
              }
            }
        ])
        .sort({ views: -1 })
        .limit(100);

        return { status: 'success', message: 'successfully found drugs', data: result}
    } catch (error) {
        return { status: 'error', message: 'an error occurred, please try again' }
    }
}

// search drug on system
async function searchDrug(req) {
  try {
    const result = await Drug.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: req.body.search_text, '$options' : 'i' } },
            { description: { $regex: req.body.search_text, '$options' : 'i' } },
            { manufacturer: { $regex: req.body.search_text, '$options' : 'i' } },
          ]
        }
      },
      ...STORE_AND_CATEGORY_LOOKUP,
      {
        $project: {
          ...DRUG_RETURN_DATA
        }
      }
    ])
    return { status: 'success', message: 'drug search successful', data: result }
  } catch (error) {
    return { status: 'error', message: 'an error occurred, please try again' }
  }
}

async function searchDefaultDrugs(req) {
  try {
    const result = await DefaultDrug.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: req.body.search_text, '$options' : 'i' } },
            { drug_code: { $regex: req.body.search_text, '$options' : 'i' } },
            { unit_of_pricing: { $regex: req.body.search_text, '$options' : 'i' } },
            { dosage_form: { $regex: req.body.search_text, '$options' : 'i' } },
          ]
        }
      },
    ])
    return { 
      status: 'success', 
      message: 'successfully retrieved default drugs', 
      data: result 
    }
  } catch (error) {
    return { status: 'error', message: 'an error occurred, please try again' }
  }
}

async function fetchDefaultDrugs() {
  try {
    const result = await DefaultDrug.find({})
    return { 
      status: 'success', 
      message: 'drugs fetched successful', 
      data: result 
    }
  } catch (error) {
    return { status: 'error', message: 'an error occurred' }
  }
}

async function deleteDrug(req) {
  try {
    await Drug.findByIdAndDelete(req.body.drug_id);
    return { status: 'success', message: 'drug deleted successfully' }
  } catch (error) {
    return { status: 'failed', message: 'an error occurred while deleting drug'}
  }
}

module.exports = {
  searchDrugInSpecificPharmacy,
  addDrugToInventory,
  fetchAllPharmacyDrugs,
  countPharmacyDrugs,
  getDrugInformation,
  getPopularDrugs,
  updateDrugDetail,
  getPopularDrugsInPharmacy,
  searchDrug,
  searchDefaultDrugs,
  fetchDefaultDrugs,
  deleteDrug
};
