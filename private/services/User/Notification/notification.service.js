const { admin } = require("../../../config/firebase_admin.config");
const User = require("../../../schemas/User");

async function setFCMToken(req) {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        fcm_token: req.body.fcm_token,
      },
    });
    return { status: "success", message: "fcm token set successfully" };
  } catch (error) {
    return { status: "error", message: "an error occurred, please try again" };
  }
}

async function sendFCMessage(fcmToken, title, message, data={}) {
  try {
    var payload = {
      notification: {
        title: title,
        body: message,
      },
      data
    };
    admin.messaging().sendToDevice(fcmToken, payload, {
      priority: "high",
      timeToLive: 60 * 60 * 24,
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  setFCMToken,
  sendFCMessage,
};
