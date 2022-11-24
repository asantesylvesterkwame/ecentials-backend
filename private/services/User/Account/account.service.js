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

//fetch users name when provided with the user id
async function fetchUsersName(user_id){
    const user_details = await User.find({_id: user_id})
    if(user_details){
        var theName = "";
        //extracting users name from personal details
        user_details.forEach(user_element => {
            theName = user_element.personal.name
        })
        
        return theName;
    }
    else{
        return {
            message: "No user with the provided user id"
        }
    }
}

module.exports = {
    uploadProfileImage, 
    fetchUsersName
}