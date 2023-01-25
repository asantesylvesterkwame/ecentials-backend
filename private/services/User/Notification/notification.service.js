const User = require("../../../schemas/User");

async function setFCMToken(req) {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fcm_token: req.body.fcm_token
                }
            }
        )
        return { status: 'success', message: 'fcm token set successfully' }
    } catch (error) {
        return { status: 'error', message: 'an error occurred, please try again' }
    }
}

module.exports = {
    setFCMToken
}
