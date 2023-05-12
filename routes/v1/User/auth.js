/* eslint-disable */

const router = require("express").Router();
const dotenv = require("dotenv"); //saves secrets like passwords, API keys etc in a virtual env
const { v4: uuid } = require("uuid");

const User = require("../../../private/schemas/User");
const bcrypt = require("bcryptjs/dist/bcrypt"); //encrypting the password
var mongoose = require("mongoose");

const jwt = require("jsonwebtoken"); //for jwt webtoken to check if user is logged in

//encrypt password
const { encryptPassword } = require("../../../private/helpers/functions");

//validations are added to this file using the holi/joi library
const {
  registerValidation,
  emailValidation,
  passwordValidation,
  refreshTokenBodyValidation,
} = require("./validation/auth_validation");

const verify = require('../../../verifyToken')
const sendMail = require('../../../private/services/send_email')
const RecoveryCode = require('../../../private/schemas/RecoveryCode')
const EMAILBODY = require('../../../private/helpers/mail_body')
const { generateTokens, verifyRefreshToken } = require('../../../private/helpers/user_token')
const BaseTemplate = require('../../../private/helpers/base_mail')
const Staff = require('../../../private/schemas/Staff')
const BusinessOwner = require('../../../private/schemas/BusinessOwner')
const getFirstName = require('../../../private/helpers/retrieve_first_name')

dotenv.config();

//REGISTRATION
router.post("/register", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  //simple validation of the email and password
  const { error } = registerValidation(req.body);
  if (error)
    return res.json({ status: 400, message: error.details[0].message });

  //check if user exists
  const emailExists = await User.findOne({ email: email });
  if (emailExists)
    return res.json({ status: 400, message: "User already exists" });

  //create new user
  const user = new User({
    email: email,
    password: encryptPassword(password),
  });
  try {
    const saveUser = await user.save();
    if (saveUser) {
      const email_body = BaseTemplate(
        "Welcome to Ecentials",
        "Your account has been created successfully",
        `Login and get access to great healthcare services.`,
        "imgs/logo_ios.png",
        "not-me-password-reset"
      );

      await sendMail(email, email_body);

      return res.json({ status: 200, message: "User created successfully" });
    }
  } catch (err) {
    return res.json({ status: 400, message: err });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  //simple validation of the email and password
  const { error } = registerValidation(req.body);
  if (error)
    return res.json({ status: 400, message: error.details[0].message });

  //check if email exists & comparing passwords
  const user = await User.findOne({ email: email });

  const validPass = await bcrypt.compareSync(password, user.password);

  if (!user || !validPass)
    return res.json({ status: 400, message: "Invalid credentials" });

  //create and assign a token
  // const token = jwt.sign({_id: user._id}, process.env.SECRET)
  const { accessToken, refreshToken } = await generateTokens(user);

  res.header("auth-token", accessToken).json({
    email,
    // token,
    accessToken,
    refreshToken,
    accessTokenExpiresAt: 840,
    refreshTokenExpireAt: 2592000,
    id: user._id,
    name: user.personal.name,
  });
});

//FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  var email = req.body.email;

  //simple validation of the email and password
  const { error } = emailValidation(req.body);
  if (error)
    return res.json({ status: 400, message: error.details[0].message });
  const isUserEmail = await User.findOne({ email: email });
  const isStaffEmail = await Staff.findOne({ email: email });
  const isBusinessOwnerEmail = await BusinessOwner.findOne({ email: email });
  if (!isUserEmail && !isStaffEmail && !isBusinessOwnerEmail) {
    return res.json({
      status: 400,
      message: "User does not exist. Please create an account instead",
    });
  }
  return res.json({ status: 200, message: "User exists" });
});

//RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  console.log(req.body);
  if (password != confirmPassword)
    return res.json({ status: 400, message: "Password mismatch" });

  const { error } = passwordValidation(req.body);
  if (error)
    return res.json({ status: 400, message: error.details[0].message });

  //change the password
  let updatePassword = await User.updateOne(
    { email },
    { $set: { password: encryptPassword(confirmPassword) } }
  );
  updatePassword = await Staff.updateOne(
    { email },
    { $set: { password: encryptPassword(confirmPassword) } }
  );
  updatePassword = await BusinessOwner.updateOne(
    { email },
    { $set: { password: encryptPassword(confirmPassword) } }
  );

  if (updatePassword)
    return res.json({ status: 200, message: "Password reset completed" });
  return res.status(400).json({ message: "Failed to reset password" });
});

// send email to user to start password reset process
router.post("/recover_password", async (req, res) => {
  const { email } = req.body;

  let code = `${uuid()}`.substring(0, 6).toUpperCase();
  let first_name = await getFirstName(email);
  let mail_body = EMAILBODY(first_name, code);

  if (email === "") {
    return res.status(400).json({ message: "user email not provided." });
  }

  sendMail(email, mail_body)
    .then((result) => {
      // set the code sent to the user
      // this will be validated against to check if user has permission to change
      // password
      RecoveryCode.create({ email, code }, (err, _) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Something went wrong. Try again later" });
        }
        return res
          .status(200)
          .json({ message: "A verification has been sent to your email." });
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Could not send verification code. Try again later.",
        data: err,
      });
    });
});

// verify password reset verification code sent to the user
// to allow a user to change password.
router.post("/verify_code", async (req, res) => {
  const { code, email } = req.body;

  const msInMinute = 60 * 1000;
  const current_date = new Date();

  try {
    await RecoveryCode.findOne(
      { email, code },
      { createdAt: 1, _id: 0 },
      (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Could not verify code. Please try again" });
        }

        // determine whether the code was sent over 15 mins before
        // if so, the code is expired and hence cannot be used for the verification.
        let code_date = new Date(result.createdAt);

        let time_elapsed = current_date.getTime() - code_date.getTime();

        if (Math.abs(time_elapsed / msInMinute) > 15) {
          return res
            .status(400)
            .json({ message: "Code has expired. Please try again" });
        }

        return res.status(200).json({ message: "success" });
      }
    ).clone();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "something went wrong", data: error });
  }
});

// get new access token
router.post("/get-new-access-token", async (req, res, next) => {
  const { error } = refreshTokenBodyValidation(req.body);

  if (error)
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });

  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id };

      const accessToken = jwt.sign(payload, "secret", { expiresIn: "14m" });

      res.status(200).json({
        status: "success",
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
