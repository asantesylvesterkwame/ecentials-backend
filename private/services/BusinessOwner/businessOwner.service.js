const { registerValidation } = require("../../../routes/v1/User/validation/auth_validation");
const { encryptPassword } = require("../../helpers/functions");
const BusinessOwner = require("../../schemas/BusinessOwner");

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
    return { status: 200, message: "Owner created successfully", data: result };        
  } catch (error) {
    return { status: 400, message: err };
  }
}

module.exports = {
  createBusinessOwner,
};
