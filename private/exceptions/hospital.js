class HospitalAppointmentException extends Error {
  constructor(message) {
    super(message);
    this.name = "HospitalAppointException";
  }
}

module.exports = {
  HospitalAppointmentException,
};
