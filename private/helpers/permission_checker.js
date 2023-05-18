/* eslint-disable */
const Staff = require("../schemas/Staff");

function isStaffChecker(...privileges) {
  return async (req, res, next) => {
    const { user } = req;

    const staff_instance = await Staff.findById(user._id);
    if (user && privileges.includes(staff_instance.privileges)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
}

module.exports = {
  isStaffChecker,
};
