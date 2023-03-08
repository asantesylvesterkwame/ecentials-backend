const router = require("express").Router();
const multer = require("multer");

const Drug = require("../../../private/schemas/Drug");
const {
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
  deleteDrug,
  uploadDrugsFromFile,
} = require("../../../private/services/Pharmacy/Drug/drug.service");
const { verify } = require("../../../verifyToken");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("picture");
const fileUpload = multer({ dest: 'uploads' }).single('file')

// list all drugs associated to a particular pharmacy or shop
router.post("", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await fetchAllPharmacyDrugs({ req }));
  } catch (error) {
    next(error);
  }
});

// search for a drug using name, manufacturer, description
router.post("/drug-search", verify, async (req, res, next) => {
  try {
    const result = await searchDrug(req)
    
    if (result.status === 'success') {
      return res.status(200).json(result)
    }
    return res.status(400).json(result)
  } catch (error) {
    next(error)
  }
});

// list details about a drug
router.post("/view-drug-details", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await getDrugInformation({ req }));
  } catch (error) {
    next(error);
  }
});

// list popular drug. This uses the views added during each detail view
// this can be reviewed later on to show how drug popularity is being displayed.
router.get("/list-popular-drugs", verify, async (req, res) => {
  try {
    return res.status(200).json(await getPopularDrugs());
  } catch (error) {
    return res.status(200).json({ message: "Something went wrong" });
  }
});

// search for a drug in a particular pharmacy
router.post(
  "/pharmacy-specific-drug-search",
  verify,
  async (req, res, next) => {
    const { search_text, store_id } = req.body;

    try {
      return res.json(
        await searchDrugInSpecificPharmacy({ search_text, store_id })
      );
    } catch (error) {
      next(error);
    }
  }
);

// allow a verified pharmacy staff to add a drug / product to
// pharmacy inventory
router.post("/add-new-drug", upload, async (req, res, next) => {
  try {
    return res.status(201).json(await addDrugToInventory({ req }));
  } catch (error) {
    next(error);
  }
});

// get a count of drugs/products in a pharmacy
router.post("/count-drugs-in-pharmacy", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await countPharmacyDrugs({ req }));
  } catch (error) {
    next(error);
  }
});

// update drug information
router.post(
  "/update-drug-information",
  verify,
  upload,
  async (req, res, next) => {
    try {
      return res.status(200).json(await updateDrugDetail({ req }));
    } catch (error) {
      next(error);
    }
  }
);

// list popular pharmacy drugs
router.post('/top-popular-drugs-in-pharmacy', verify, async (req, res, next) => {
    try {
        const result = await getPopularDrugsInPharmacy({ req })
        
        if (result.status === 'success') {
            return res.status(200).json(result)
        }

        return res.status(400).json(result)
    } catch (error) {
        next(error)
    }
})

router.post('/search-default-drugs', verify, async (req, res, next) => {
  try {
    const result = await searchDefaultDrugs(req)
    if (result.status === 'success') {
      return res.status(200).json(result)
    }
    return res.status(400).json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/fetch-default-drugs', verify, async (req, res, next) => {
  try {
    const result = await fetchDefaultDrugs()
    if (result.status === 'success') {
      return res.status(200).json(result)
    }
    return res.status(400).json(result)
  } catch (error) {
    next(error)
  }
})

router.delete('/delete-drug', verify, async (req, res, next) => {
  try {
    const result = await deleteDrug(req);
    if (result.status === 'success') {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
})

router.post('/upload-drugs-from-file', verify, fileUpload, async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({message: 'No file uploaded'});
      return;
    }

    const result = await uploadDrugsFromFile(req);
    if (result.status === 'success') {
      return res.status(201).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
