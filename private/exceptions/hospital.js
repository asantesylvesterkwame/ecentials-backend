/* eslint-disable max-classes-per-file */
class HospitalAppointmentException extends Error {
  constructor(message) {
    super(message);
    this.name = "HospitalAppointException";
  }
}

class HospitalStaffException extends Error {
  constructor(message) {
    super(message);
    this.name = "HospitalStaffException";
  }
}

class HospitalPatientException extends Error {
  constructor(message) {
    super(message);
    this.name = "HospitalPatientException";
  }
}

module.exports = {
  HospitalAppointmentException,
  HospitalStaffException,
  HospitalPatientException,
};
