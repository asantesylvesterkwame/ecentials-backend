const { registerValidation } = require("../../../routes/v1/User/validation/auth_validation");
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
  const { error } = registerValidation({ email, password});
  
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
      
      await _sendEmail({email, accountID, bussinerOwnerID: result._id})
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
  
  let randomDigits = (Math.floor(Math.random()*90000) + 10000).toString();
  
  return initials + randomDigits
}

// send account id to business owner's email account
async function _sendEmail({ email, accountID, bussinerOwnerID }) {
  let mail_body = BusinessAccount(accountID, "imgs/logo_ios.png", "not-me-password-reset");
  sendMail(email, mail_body).then((result) => {
    // create a record for the accountID which would be later 
    // used for verification.
    AccountID.create({ account_id: encryptPassword(accountID), business_owner: bussinerOwnerID},
      (err, _) => {
        if (err) {
          throw Error("failed to save account id")
        }
      })
  }).catch(err => {
    throw Error("failed to send mail")
  });
}

module.exports = {
  createBusinessOwner,
};
