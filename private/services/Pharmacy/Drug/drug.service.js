const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;
const Drug = require("../../../schemas/Drug");
const { uploadFile } = require("../../Firebase/imageUpload.service");

// This service allows a user to search for drugs
// in a specific pharmacy using keywords
async function searchDrugInSpecificPharmacy({ search_text, store_id }) {
  try {
    const results = await Drug.find({
      $or: [
        { name: { $regex: search_text } },
        { description: { $regex: search_text } },
        { manufacturer: { $regex: search_text } },
      ],
      store_id,
    });

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
    const drugs = await Drug.find({ ...req.body });
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
      // {
      //     $addFields: {
      //         "category_name": "$category.name",
      //         "category_status": "$category.status",
      //         "store_name": "$store.name",
      //         "store_location": "$store_location",
      //         "store_description": "$store.description"
      //     }
      // }
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

module.exports = {
  searchDrugInSpecificPharmacy,
  addDrugToInventory,
  fetchAllPharmacyDrugs,
  countPharmacyDrugs,
  getDrugInformation,
  getPopularDrugs,
  updateDrugDetail,
};
