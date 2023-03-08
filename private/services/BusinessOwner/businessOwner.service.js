const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");

const {
  registerValidation,
} = require("../../../routes/v1/User/validation/auth_validation");
const BusinessAccount = require("../../helpers/business_account");
const { encryptPassword } = require("../../helpers/functions");
const AccountID = require("../../schemas/AccountID");
const BusinessOwner = require("../../schemas/BusinessOwner");
const sendMail = require("../send_email");

// create a business owner
async function createBusinessOwner({
  full_name,
  email,
  phone_number,
  address,
  password,
}) {
  //simple validation of the email and password
  const { error } = registerValidation({ email, password });

  if (error) return { status: 400, message: error.details[0].message };

  //check if user exists
  const emailExists = await BusinessOwner.findOne({ email: email });
  if (emailExists) return { status: 400, message: "Owner already exists" };

  try {
    const businessOwner = new BusinessOwner({
      full_name,
      email,
      phone_number,
      address,
      password: encryptPassword(password),
    });
    const result = await businessOwner.save();
    if (result) {
      const accountID = _generateAccountId({ full_name });

      await _sendEmail({ email, accountID, bussinerOwnerID: result._id });
    }
    return { status: 200, message: "Owner created successfully", data: result };
  } catch (error) {
    return { status: 400, message: err };
  }
}

// generate account id using first two initials of user full name
// and add additional 5 numbers.
function _generateAccountId({ full_name }) {
  let initials = full_name.slice(0, 2).toUpperCase();

  let randomDigits = (Math.floor(Math.random() * 90000) + 10000).toString();

  return initials + randomDigits;
}

// send account id to business owner's email account
async function _sendEmail({ email, accountID, bussinerOwnerID }) {
  let mail_body = BusinessAccount(
    accountID,
    "imgs/logo_ios.png",
    "not-me-password-reset"
  );
  sendMail(email, mail_body)
    .then((result) => {
      // create a record for the accountID which would be later
      // used for verification.
      AccountID.create(
        { account_id: accountID, business_owner: bussinerOwnerID },
        (err, _) => {
          if (err) {
            throw new Error("failed to save account id");
          }
        }
      );
    })
    .catch((err) => {
      throw Error("failed to send mail");
    });
}

// allow a business owner to login using password and the generated account id
// if successful, a token is sent to them.
async function loginBusinessOwner({ account_id, password }) {
  try {
    const result = await AccountID.aggregate([
      { $match: { account_id: account_id } },
      {
        $lookup: {
          from: "businessowners",
          localField: "business_owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "staff",
          foreignField: "_id",
          as: "staff",
        },
      },
      {
        $unwind: {
          path: "$staff",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $project: {
          _id: 1,
          account_id: 1,
          owner_id: "$owner._id",
          owner_password: "$owner.password",
          owner_name: '$owner.full_name',
          staff_id: "$staff._id",
          staff_password: "$staff.password",
          staff_privileges: '$staff.privileges',
          staff_facility: '$staff.facility_id',
          staff_terminated: '$staff.terminated',
          staff_first_name: '$staff.first_name',
          staff_last_name: '$staff.last_name'
        },
      },
    ]);
    return await _getLoggedInUserType(result, password);
    
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

async function _getLoggedInUserType(result, password) {
  if (!result) return { status: 'failed', message: 'please provide correct credentials' }

  let isValidPassword = false;
  let token;

  if (result[0].owner_id) {
    // user logged in is the owner
    isValidPassword = await bcrypt.compareSync(
      password,
      result[0].owner_password
    );
    token = jwt.sign({ _id: result[0].owner_id }, "secret");
  } else if (result[0].staff_id) {

    // check if staff is inactive / terminated
    if (result[0].staff_terminated) {
      return { status: 'failed', message: 'you do not have access right' }
    }

    isValidPassword = await bcrypt.compareSync(
      password,
      result[0].staff_password
    );
    token = jwt.sign({ _id: result[0].staff_id }, "secret");
  }

  if (!isValidPassword) {
    return { status: 'failed', message: "wrong password, please try again" };
  }
  
  return { token, data: result[0] }
}
module.exports = {
  createBusinessOwner,
  loginBusinessOwner,
};
