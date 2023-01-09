const Vehicle = require("../../../schemas/Vehicle")

// create a new ambulance
async function createNewAmbulance(req) {
    try {
        const results = await Vehicle.create({
            ...req.body
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

async function getAmbulances() {
    try {
        const result = await Vehicle.find({})
        return { 
            status: 'success', 
            message: 'successfully fetched vehicles',
            data: result
        }
    } catch (error) {
        return { status: 'error', message: 'an error occurred.' }
    }
}

module.exports = {
    createNewAmbulance,
    getTotalAmbulanceCount,
    getAmbulances
}