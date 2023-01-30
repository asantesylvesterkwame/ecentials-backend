const router = require("express").Router();
const Orders = require("../../../../private/schemas/Orders");
const Notification = require("../../../schemas/Notification");
const {
  sendFCMessage,
} = require("../../User/Notification/notification.service");

async function cancelOrder({ req }) {
  const { order_code } = req.body;

  try {
    const result = await Orders.updateOne(
      { order_code },
      { $set: { order_status: "Cancelled" } }
    );
    const user = await _getUser(order_code);

    const sendNotification = sendFCMessage(
      user.user_token,
      "Order cancelled",
      req.body.message
    );
    const createNotification = _createNewNotification(
      user.user_id,
      "Order cancelled",
      req.body.message
    );
    
    Promise.all([sendNotification, createNotification]).catch((e) => { throw new Error(e) })

    if (result.modifiedCount > 0) {
      return { message: "success", data: result };
    }

    return { message: "Failed to cancel checkout item.", data: err };
  } catch (error) {
    return { message: "Failed to create checkout item.", data: error };
  }
}

async function _getUser(order_code) {
  try {
    const result = await Orders.aggregate([
      { $match: { order_code } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          user_token: "$user.fcm_token",
          user_id: "$user._id",
        },
      },
    ]);
    return result[0];
  } catch (error) {
    throw new Error(error);
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

module.exports = {
  cancelOrder,
};
