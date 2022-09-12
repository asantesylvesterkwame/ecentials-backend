const Vehicle = require("../../../schemas/Vehicle")

// create a new ambulance
async function createNewAmbulance({
  driver_id,
  name,
  licence_no,
  brand = null,
  color = null,
  insurance = false,
}) {
    try {
        const results = await Vehicle.create({
            driver_id,
            name,
            licence_no,
            brand,
            color,
            insurance
        });

        if (results != null) {
            return { message: "success", data: results}
        }
        return { message: "Vehicle not added. Please try again"}
    } catch (error) {
        return { message: "An error occurred. Please try again later."}
    }
}


module.exports = {
    createNewAmbulance
}