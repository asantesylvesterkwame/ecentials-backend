/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const multer = require("multer");

const router = require("express").Router();
const {
  createNewLab,
  fetchAllLabs,
  searchForLab,
  getTopRatedDoctors,
  uploadLabDocument,
  getLabDetails,
} = require("../../../private/services/Lab/lab.service");
const { verify } = require("../../../verifyToken");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("document");

// this route creates a new lab using
// data from the request body
router.post("/create-new-lab", async (req, res, next) => {
  const {
    name,
    address,
    opening_hours,
    phone_numbers,
    gps_address,
    hospital_id,
  } = req.body;

  try {
    return res.status(200).json(
      await createNewLab({
        name,
        address,
        opening_hours,
        phone_numbers,
        gps_address,
        hospital_id,
      })
    );
  } catch (error) {
    return next(error);
  }
});

// fetch all labs for a verified user on the platform
router.get("", verify, async (req, res, next) => {
  try {
    return res.status(200).json(await fetchAllLabs());
  } catch (error) {
    return next(error);
  }
});

router.post("/fetch-top-doctors-in-labs", verify, async (req, res, next) => {
  const { facility_type } = req.body;
  try {
    return res.status(200).json(await getTopRatedDoctors({ facility_type }));
  } catch (error) {
    return next(error);
  }
});

// allow a verified user to search for a lab
router.post("/search-for-lab", verify, async (req, res, next) => {
  const { search_text } = req.body;
  try {
    return res.status(200).json(await searchForLab({ search_text }));
  } catch (error) {
    return next(error);
  }
});

// upload lab document
router.post("/new-lab-document", verify, upload, async (req, res, next) => {
  try {
    const result = await uploadLabDocument({ req });

    if (result.status === "success") {
      return res.status(201).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/get-lab-information", verify, async (req, res, next) => {
  try {
    const result = await getLabDetails(req);

    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
