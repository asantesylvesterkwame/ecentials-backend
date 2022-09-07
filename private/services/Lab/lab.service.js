const Lab = require("../../schemas/Lab");
const Staff = require("../../schemas/Staff");

// create a new lab using information about the lab
async function createNewLab({
  name,
  address,
  opening_hours,
  phone_numbers,
  gps_address,
  hospital_id = null,
}) {
  try {
    const results = await Lab.create({
      name,
      address,
      opening_hours,
      phone_numbers,
      gps_address,
      hospital_id,
    });

    if (results == null) {
        return { message: "Failed to create lab. Please try again"};
    }
    return { message: "success", data: results };
  } catch (error) {
      return { message: "An error occurred, could not create lab."}
  }
}


// retrieve all labs
async function fetchAllLabs() {
    try {
        const results = await Lab.find({});

        if (results == null) {
            return { message: "No lab found. Please try again later", data: [] };
        }
        return { message: "success", data: results };
    } catch (error) {
        return { message: "An error occurred."}
    }
}


// search for a lab using specific keywords
// [name, address, gps_address]
async function searchForLab({search_text}) {
    try {
        const results = await Lab.find({
            "$or": [
                {name: { $regex: search_text, '$options' : 'i' }},
                {address: { $regex: search_text, '$options' : 'i' }},
                {gps_address: { $regex: search_text, '$options' : 'i' }},
            ]
        });

        if (results) {
            return { message: "success", data: results };
        }
        return { message: "No lab found", data: []};
    } catch (error) {
        return { message: "An error occurred, please try again later." };
    }
}

// retrieves top rated laboratory doctors in a lab
// TODO would have to implement logic on how a doctor becomes top rated on 
// the platform
async function getTopRatedDoctors({ facility_type }) {
    try {
        const results = await Staff.find({ facility_type }).limit(5);

        if (results) {
            return { message: "success", data: results };
        }
        return { message: "No doctor found", data: [] };
    } catch (error) {
        return { message: "An error occurred" };
    }
}

module.exports = {
    createNewLab,
    fetchAllLabs,
    searchForLab,
    getTopRatedDoctors
}
