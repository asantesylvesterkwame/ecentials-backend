const router = require("express").Router();
const multer = require("multer");


const Prescription = require("../../../private/schemas/Prescription");
const { verify } = require("../../../verifyToken");
const {
  uploadPrescription, getUserPrescription, deleteUserPrescription, getPrescriptionsSentToPharmacy,
} = require("../../../private/services/Prescription/user_prescription.service");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("picture");

// upload a new prescription
// this is done by a user on the ecentials themselves.
router.post("/new-prescription", verify, upload, async (req, res, next) => {
  const user_id = req.user._id;
  const { store_id } = req.body;

  try {
    return res
      .status(201)
      .json(await uploadPrescription({ user_id, store_id, file: req.file }));
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// upload a new prescription - pharmacists
// this upload is done by the pharmacists on behalf of the user.
// if the user details is not in the system, the pharmacists add them.
router.post("/upload-prescription-by-pharmacists", verify, async (req, res) => {
  const { user_id, status, store_id } = req.body;

  if (!!user_id && !!store_id) {
    await Prescription.create(
      {
        user_id,
        status,
        store_id,
      },
      (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Failed to save prescription" });
        }
        return res.status(200).json({ message: "success", data: result });
      }
    );
  } else {
    return res
      .status(400)
      .json({ message: "Please provide the necessary data" });
  }
});


// get all prescriptions belonging to a user
router.get('/user-prescriptions', verify, async (req, res, next) => {
  const user_id = req.user._id;

  try {
    return res.status(200).json(await getUserPrescription({ user_id }));
  } catch (error) {
    next(error);
  }
});


// delete user prescription
router.delete('/remove-user-prescription', verify, async (req, res, next) => {
  const user_id = req.user._id;
  const { prescription_id } = req.body;
  
  try {
    return res.status(200).json(await deleteUserPrescription({ prescription_id, user_id }));
  } catch (error) {
    next(error);
  }
});

router.post('/get-prescriptions-for-pharmacy', verify, async (req, res, next) => {
  try {
    const result = await getPrescriptionsSentToPharmacy(req);
    if (result.status === 'success') {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
