// file for all schemas
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      required: false,
    },
    profile_image: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    usertype: {
      // 0 = normal user
      type: Number,
      required: false,
    },
    has_shop: {
      type: Number,
      required: false,
    },
    personal: {
      firstName: String,
      lastName: String,
      middleName: String,
      phone: String,
      gender: String,
      address: String,
      occupation: String,
      religion: String,
      nationality: String,
      language: String,
      phoneNumber: String,
      nearestRelative: Array,
      addressLineTwo: String,
      dob: String,
      ghana_card_no: String,
      height: String,
      weight: String,
      height_unit: String,
      weight_unit: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
    health: {
      pin: String,
      blood_group: String,
      genotype: String,
      allergies: Array,
      medical_id_no: String,
      pulse_rate: Number,
      respiration_rate: Number,
      blood_pressure: String,
      temperature: Number,
      nhis_no: String,
      medical_conditions: Array,
      preventive_care: Array,
      gynecological_history: Array,
      comments: String,
      issues: {
        harmed: Boolean,
        harmedDescription: String,
        depressed: Boolean,
      },
      sexualHistory: {
        sexualPartners: String,
        moreThanOneSexualPartner: Boolean,
        history: [
          {
            std: String,
            date: Date,
          },
        ],
      },
      immunizations: [
        {
          immunization: String,
          result: String,
          filename: String,
        },
      ],
      surgeries: Array,
      date: {
        type: Date,
        default: Date.now,
      },
    },
    // education: [mongoose.SchemaTypes.ObjectId],
    education: [
      {
        school_name: {
          type: String,
          required: false,
        },
        course: {
          type: String,
          required: false,
        },
        duration: {
          type: String,
          required: false,
        },
        highest_level: {
          type: String,
          required: false,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    fcm_token: {
      type: String,
      required: false,
    },
    primary_doctors: [],
    health_history: [],
    uniqueId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function _(next) {
  this.uniqueId = (Math.floor(Math.random() * 900000) + 100000).toString();
  next();
});

module.exports = mongoose.model("User", userSchema);
