/* eslint-disable */

const Hospital = require("../../schemas/Hospital");
const {uploadFile} = require("../Firebase/imageUpload.service");
const getDistance = require('../../../private/helpers/get_distance');

// upload hospital images
async function uploadHospitalImages({hospital_id, files}) {
    try {
        let images = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const imageUrl = await uploadFile(file, "images");

            images.push(imageUrl);
        }

        const result = await Hospital.updateOne({_id: hospital_id}, {$push: {images: {$each: images}}});

        if (result != null) {
            return {message: "Images uploaded successfully"};
        }
        return {message: "Images not uploaded. Try again"};
    } catch (error) {
        return {message: "An error occurred. Please try again."};
    }
}

// search nearby hospital
// uses search text to query the db
// uses the user's current location to make the distance
// to the hospital is less than 50km
async function searchNearbyHospital({search_text, user_latitude, user_longitude}) {
    try {
        const hospitals = await Hospital.find({
            "$or": [
                {name: {$regex: search_text, "$options": "i"}},
                {address: {$regex: search_text, "$options": "i"}},
            ]
        });
        if (!hospitals) {
            return {message: "no hospital found", data: []}
        }

        let results = [];

        hospitals.forEach(hospital => {
            const distance = getDistance({lat1: user_latitude, lng1: user_longitude,
                lat2: hospital.gps_lat, lng2: hospital.gps_lng })

            if (distance < 50.0) {
                results.push(hospital);
            }
        });
        return { message: "success", data: results };
    } catch (error) {
        return {message: "An error occurred. Please try again."};
    }
}

// get hospital details
async function getHospitalDetails(req) {
    try {
        const result = await Hospital.find({ _id: req.body.hospital_id })
        return {
            status: 'success',
            message: 'successfully retrieved hospital',
            data: result
        }
    } catch (error) {
        return { status: 'error', message: 'an error occurred, please try again' }
    }
}

/**
 * Check if business owner has hospital
 */
async function isBusinessOwnerHavingHospital(req) {
    try {
        const result = await Hospital.find({ owner_id: req.user._id });

        if (result.length > 0) {
            return { status: 'success', message: 'user has a hospital', has_hospital: true };
        }
        return { status: 'success', message: 'user has no hospital', has_hospital: false };
    } catch (error) {
        return { status: 'error', message: 'an error occurred, please try again' };
    }
}

module.exports = {
    uploadHospitalImages,
    searchNearbyHospital,
    getHospitalDetails,
    isBusinessOwnerHavingHospital
}
