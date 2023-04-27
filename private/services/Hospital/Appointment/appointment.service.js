const Hospital = require("../../../schemas/Hospital");

/**
 * @param [req] request object
 * @returns [Object] object of available appointment dates if a there exists
 * @returns [Object] object if an error occurs
 * 
 * checks the available appointment dates for a hospital
 */
async function fetchAvailableAppointmentDates(req) {
  try {
    const result = await Hospital.findById(req.params.hospital_id);
    if (result != null) {
      return {
        status: "success",
        message: "appointment dates retrieved successfully",
        data: result.available_appointment_dates,
      };
    }
    return {
      status: "success",
      message: "no appointment dates found",
      data: [],
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  fetchAvailableAppointmentDates,
};
