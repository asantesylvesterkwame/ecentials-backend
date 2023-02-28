const {
  sendFCMessage,
} = require("../services/User/Notification/notification.service");
const Notification = require("../schemas/Notification");

export default async function sendAndCreateNotification(
  user_token,
  user_id,
  title,
  body,
  data = {}
) {
  try {
    const sendNotification = sendFCMessage(user_token, title, body, data);

    const createNotification = _createNewNotification(user_id, title, body);

    Promise.all([sendNotification, createNotification]).catch((e) => {
      throw new Error(e);
    });
  } catch (error) {
    console.log(`error occurred: ${error}`);
  }
}

async function _createNewNotification(user_id, title, message) {
  try {
    await Notification.create({
      user_id,
      title,
      message,
    });
  } catch (error) {
    throw new Error(error);
  }
}
