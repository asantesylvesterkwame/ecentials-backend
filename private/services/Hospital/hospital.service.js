const Hospital = require("../../schemas/Hospital");
const { uploadImage } = require("../Firebase/imageUpload.service");

// upload hospital images
async function uploadHospitalImages({ hospital_id, files }) {
    try {
        images = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            const imageUrl = await uploadImage(file);

            images.push(imageUrl);
        }

        const result = await Hospital.updateOne({ _id: hospital_id }, { $push: { images: {$each: images } } });

        if (result != null) {
            return { message: "Images uploaded successfully"};
        }
        return { message: "Images not uploaded. Try again" };
    } catch (error) {
        return { message: "An error occurred. Please try again." };
    }
}


module.exports = {
    uploadHospitalImages
}