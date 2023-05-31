class HospitalAppointException extends Error {
    constructor(message) {
        super(message);
        this.name = "HospitalAppointException";
    }
}