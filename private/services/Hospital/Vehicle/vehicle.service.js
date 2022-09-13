const Vehicle = require("../../../schemas/Vehicle")

// create a new ambulance
async function createNewAmbulance({
  driver_id,
  facility_id,
  name,
  licence_no,
  brand = null,
  color = null,
  insurance = false,
}) {
    try {
        const results = await Vehicle.create({
            driver_id,
            facility_id,
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


// get a count of ambulances
// TODO specify in the future how the count will be performed
async function getTotalAmbulanceCount() {
    try {
        const results =  await Vehicle.find({}).count();
        return { message: "success", data: results };
    } catch (error) {
        return { message: "unsuccessful", data: 0 };
    }
}


module.exports = {
    createNewAmbulance,
    getTotalAmbulanceCount,
}