/* eslint-disable */
const Hospital = require("../schemas/Hospital");
const Pharmacy = require("../schemas/Store");
const Lab = require("../schemas/Lab");

async function getFacility(facility_id, facility_type) {
  try {
    let result;
    if (facility_type === "hospital") {
      result = await Hospital.findById(facility_id);
    } else if (facility_type === "pharmacy") {
      result = await Pharmacy.findById(facility_id);
    } else if (facility_type === "lab") {
      result = await Lab.findById(facility_id);
    }
    return result;
  } catch (error) {
    throw new Error("Failed to find facility");
  }
}

module.exports = getFacility;
