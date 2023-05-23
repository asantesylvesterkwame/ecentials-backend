/* eslint-disable */

const router = require("express").Router();
const multer = require("multer");
const bcrypt = require("bcryptjs/dist/bcrypt"); // encrypting the password

const { verify } = require("../../../verifyToken"); // checks if the user has a jwt token
const User = require("../../../private/schemas/User");

const { encryptPassword } = require("../../../private/helpers/functions");
const {
  uploadProfileImage,
} = require("../../../private/services/User/Account/account.service");
const {
  updateMedicalConditions,
  getMedicalConditions,
getAllergies,
  editAllergies
} = require("../../../private/services/User/Information/health");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("profile");

// this verifies using the token before any transaction is made.
// fetch personal details
router.get("/fetch-personal-details", verify, async (req, res) => {
  const user_id = req.user._id;
  const isUserPresent = await User.findOne(
    {
      _id: user_id,
    },
    {
      personal: 1,
      education: 1,
      health: 1,
      profile_image: 1,
    }
  );
  if (!isUserPresent) {
    return res.json({
      status: 400,
      message: "Something went wrong. Try again later",
    });
  }
  return res.json({
    status: 200,
    message: "success",
    data: isUserPresent,
  });
});

// add personal details
router.post("/addEdit-personal-details", verify, async (req, res) => {
  const user_id = req.user._id;
  const changes = {
    "personal.name": req.body.name,
    "personal.phone": req.body.phone,
    "personal.gender": req.body.gender,
    "personal.address": req.body.address,
    "personal.occupation": req.body.occupation,
    "personal.dob": req.body.dob,
    "personal.ghana_card_no": req.body.ghana_card_number,
    "personal.height": req.body.height,
    "personal.weight": req.body.weight,
    "personal.height_unit": req.body.height_unit,
    "personal.weight_unit": req.body.weight_unit,
  };

  const add_details = await User.updateOne(
    {
      _id: user_id,
    },
    {
      $set: changes,
    }
  );
  if (!add_details) {
    return res.json({
      status: 400,
      message: "Something went wrong",
    });
  }
  return res.json({
    status: 200,
    message: "Personal information added successfully",
    data: changes,
  });
});

// fetch health details
router.get("/fetch-health-details", verify, async (req, res) => {
  const user_id = req.user._id;
  const isUserPresent = await User.findOne(
    {
      _id: user_id,
    },
    {
      health: 1,
    }
  );
  if (!isUserPresent) {
    return res.json({
      status: 400,
      message: "No such record",
    });
  }
  return res.json({
    status: 200,
    message: isUserPresent,
  });
});

// it seems the code for adding can also be used for editing
// add or edit health details
router.post("/addEdit-health-details", verify, async (req, res) => {
  const user_id = req.user._id;
  const changes = {
    "health.blood_group": req.body.blood_group,
    "health.genotype": req.body.genotype,
    "health.allergies": req.body.allergies,
    "health.medical_id_no": req.body.medical_id_no,
    "health.pulse_rate": req.body.pulse_rate,
    "health.respiration_rate": req.body.respiration_rate,
    "health.blood_pressure": req.body.blood_pressure,
    "health.temperature": req.body.temperature,
    "health.nhis_no": req.body.nhis_no,
  };

  const add_details = await User.updateOne(
    {
      _id: user_id,
    },
    {
      $set: changes,
    }
  );
  if (!add_details) {
    return res.json({
      status: 400,
      message: "Something went wrong",
    });
  }
  return res.json({
    status: 200,
    message: "Health information added successfully",
  });
});

// add school details
router.post("/add-school-details", verify, async (req, res) => {
  const user_id = req.user._id;
  const schoolname = req.body.school_name;

  const education = {
    school_name: schoolname,
    course: req.body.course,
    duration: req.body.duration,
    highest_level: req.body.highest_level,
  };

  try {
    const schoolDataExists = await User.findOne({
      _id: user_id,
      education: {
        $elemMatch: {
          school_name: schoolname,
          course: req.body.course,
        },
      },
    });

    if (schoolDataExists != null) {
      return res.json({
        status: 400,
        message: "Record already exists",
      });
    }

    const addEducationDetails = await User.updateOne(
      {
        _id: user_id,
      },
      {
        $push: {
          education,
        },
      }
    );

    if (!addEducationDetails) {
      return res.json({
        status: 400,
        message: "Something went wrong",
      });
    }

    return res.json({
      status: 200,
      message: "Educational information added successfully",
      user_id: req.user._id,
    });
  } catch (error) {
    return res.json({
      status: 400,
      message: error,
    });
  }
});

// edit school details
router.post("/edit-school-details", verify, async (req, res) => {
  const user_id = req.user._id;
  const { record_id } = req.body;
  const schoolname = req.body.school_name;

  const educationalInfo = {
    school_name: schoolname,
    user_id,
    course: req.body.course,
    duration: req.body.duration,
    highest_level: req.body.highest_level,
  };

  try {
    const updateRecord = await User.updateOne(
      {
        "education._id": record_id,
      },
      {
        $set: { "education.$": educationalInfo },
      }
    );
    if (updateRecord) {
      return res.json({
        status: 200,
        message: "Educational Info updated successfully",
      });
    }
  } catch (err) {
    return res.json({
      status: 400,
      message: err,
    });
  }
});

// fetch school details
router.get("/fetch-school-details", verify, async (req, res) => {
  const user_id = req.user._id;
  const user = await User.findOne({
    _id: user_id,
  });

  if (!user.education) {
    return res.json({
      status: 400,
      message: "You have no school details",
    });
  }

  return res.json({
    status: 200,
    message: "success",
    data: user.education,
  });
});

// delete a school detail
router.delete("/delete-school-details", verify, async (req, res) => {
  const { record_id } = req.body;

  try {
    const removeRecord = await User.updateOne(
      {
        "education._id": record_id,
      },
      {
        $pull: { education: { _id: record_id } },
      }
    );

    if (!removeRecord) {
      return res.json({
        status: 400,
        message: "Something went wrong. Try again later",
      });
    }

    return res.json({
      status: 200,
      message: "Educational Info removed successfully",
    });
  } catch (err) {
    return res.json({
      status: 400,
      message: err,
    });
  }
});

// verify if a health pin has been created.
// if not create it. Other wise compare them to see if it matches.
router.post("/health-pin", verify, async (req, res) => {
  const user_id = req.user._id;
  const { pin } = req.body;

  try {
    const checkIfExists = await User.findOne(
      {
        _id: user_id,
      },
      {
        health: 1,
      }
    );
    if (checkIfExists.health.pin == null) {
      await User.updateOne(
        {
          _id: user_id,
        },
        {
          $set: {
            "health.pin": encryptPassword(pin.toString()),
          },
        }
      );
      return res.json({
        status: 200,
        message:
          "Pin has been set. It would be required anytime you wish to access your health information",
      });
    }
    // compare them
    const validPin = await bcrypt.compareSync(
      pin.toString(),
      checkIfExists.health.pin
    );
    if (!validPin) {
      return res.json({
        status: 400,
        message: "Invalid pin",
      });
    }
    return res.json({
      status: 200,
      message: "Welcome",
    });
  } catch (err) {
    return res.json({
      status: 400,
      message: err,
    });
  }
});

// allow a verified user to reset a pin
router.post("/reset-health-pin", verify, async (req, res) => {
  const user_id = req.user._id;
  const { pin } = req.body;

  try {
    await User.updateOne(
      {
        _id: user_id,
      },
      {
        $set: {
          "health.pin": encryptPassword(pin),
        },
      },
      // eslint-disable-next-line no-unused-vars
      (err, _) => {
        if (err) {
          return res.status(400).json({ message: "Failed to reset pin." });
        }
        return res.status(200).json({ message: "success" });
      }
    ).clone();
  } catch (err) {
    return res.status(400).json({
      message: "Something went wrong",
      data: err,
    });
  }
});

// allows verified user to update their profile image
// eslint-disable-next-line consistent-return
router.post("/update-profile-image", verify, upload, async (req, res, next) => {
  try {
    return res.status(200).json(await uploadProfileImage({ req }));
  } catch (error) {
    next(error);
  }
});

router.patch("/medical-conditions", verify, async (req, res, next) => {
  try {
    const result = await updateMedicalConditions(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (e) {
    return next(e);
  }
})
router.get("/allergies", verify, async (req, res, next) => {
  try {
    const result = await getAllergies(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

router.get("/medical-conditions", verify, async (req, res, next) => {
  try {
    const result = await getMedicalConditions(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (e) {
    return next(e);
  }
});

router.patch("/allergies", verify, async (req, res, next) => {
  try {
    const result = await editAllergies(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
