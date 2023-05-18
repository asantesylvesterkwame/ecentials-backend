const bcrypt = require("bcryptjs/dist/bcrypt"); // encrypting the password

const encryptPassword = (password) => {
  // encrypt password
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

module.exports.encryptPassword = encryptPassword;
