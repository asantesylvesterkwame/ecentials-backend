const User = require("../../../schemas/User");
const { uploadFile } = require("../../Firebase/imageUpload.service");

// upload user profile image
async function uploadProfileImage({ req }) {
    try {
        const image_url = await uploadFile(req.file, "profileImages")

        const result = await User.updateOne({ 
            _id: req.user._id 
        }, {
            profile_image: image_url
        })

        if (result != null) {
            return { message: "success", image_url }
        }
        return { message: "failed to update profile image, try again" }
    } catch (error) {
        return { message: "an error occurred, please try again" }
    }
}

module.exports = {
    uploadProfileImage
}