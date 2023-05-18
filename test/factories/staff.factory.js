/* eslint-disable */
const Staff = require("../../private/schemas/Staff");

class StaffFactory {
  constructor(
    facility_id,
    facility_type,
    name,
    specification,
    staff_type,
    username
  ) {
    this.facility_id = facility_id;
    (this.facility_type = facility_type), (this.name = name);
    this.specification = specification;
    this.staff_type = staff_type;
    this.username = username;
  }

  static async create(stafffactory) {
    const staff = await Staff.create({
      facility_id: stafffactory.facility_id,
      facility_type: stafffactory.facility_type,
      name: stafffactory.name,
      specification: stafffactory.specification,
      staff_type: stafffactory.staff_type,
      username: stafffactory.username,
      password: "4yahdfjhsa94wasaj",
      experience: 3,
      employee_id: "fgdhaskj",
    });
    return staff;
  }
}

module.exports = StaffFactory;
