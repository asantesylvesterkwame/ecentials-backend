/* eslint-disable camelcase */

const AccountID = require("../schemas/AccountID");
const sendMail = require("../services/send_email");
const StaffAccount = require("./staff_account_created");

/**
 * generateEmployeeID returns unique id for employee
 */
function generateEmployeeID(first_name, last_name) {
  const id = first_name.substring(0, 1) + last_name;
  return id + (Math.floor(Math.random() * 1000) + 1).toString();
}

/**
 * sendAccountCreationEmail sends a created account details
 * to employee.
 */
async function sendAccountCreationEmail({
  email,
  password,
  accountID,
  staffID,
  staff_name,
  facility_name,
}) {
  const mail_body = StaffAccount(
    staff_name,
    accountID,
    password,
    facility_name
  );
  await sendMail(email, mail_body);
  // create a record for the accountID which would be later
  // used for verification.
  // eslint-disable-next-line no-unused-vars
  AccountID.create({ account_id: accountID, staff: staffID }, (err, _) => {
    if (err) {
      throw new Error("failed to save account id");
    }
  });
}

module.exports = {
  generateEmployeeID,
  sendAccountCreationEmail,
};
