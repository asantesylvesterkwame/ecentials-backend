const router = require("express").Router();
const Orders = require("../../../../private/schemas/Orders");
const { sendAndCreateNotification } = require("../../../helpers/send_and_create_notification");
const Notification = require("../../../schemas/Notification");
const { findUserById } = require("../../User/Account/account.service");
const {
  sendFCMessage,
} = require("../../User/Notification/notification.service");
const { generateInvoiceNumber, generateOrderCode } = require("../../User/Orders/orders.service");

async function cancelOrder({ req }) {
  const { order_code } = req.body;

  try {
    const result = await Orders.updateOne(
      { order_code },
      { $set: { order_status: "Cancelled" } }
    );
    const user = await _getUser(order_code);
    
    const data = {
      "launch_url":"order",
    }

    const sendNotification = sendFCMessage(
      user.user_token,
      "Order cancelled",
      req.body.message,
      data
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

    return { message: "Failed to cancel order item.", data: err };
  } catch (error) {
    return { message: "Failed to cancel checkout item.", data: error };
  }
}

async function approveOrder({ req }) {
  const { order_code } = req.body;

  try {
    const result = await Orders.updateOne(
      { order_code },
      { $set: { order_status: "Approved" } }
    );
    const user = await _getUser(order_code);
    
    const data = {
      "launch_url":"order",
    }

    const sendNotification = sendFCMessage(
      user.user_token,
      "Order approved",
      req.body.message,
      data
    );
    const createNotification = _createNewNotification(
      user.user_id,
      "Order approved",
      req.body.message
    );
    
    Promise.all([sendNotification, createNotification]).catch((e) => { throw new Error(e) })

    if (result.modifiedCount > 0) {
      return { status: 'success', message: "order successfully approved", data: result };
    }

    return { status:'failed', message: "Failed to approve order.", data: err };
  } catch (error) {
    return { status: 'error', message: 'an error occurred, please try again' };
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

async function updateOrderStatus(req) {
  try {
    const result = await Orders.updateOne(
      { order_code: req.body.order_code, },
      { $set: { order_status: req.body.order_status }}
    );

    if (result.modifiedCount > 0) {
      const user = await _getUser(order_code);
      
      const data = {
        "launch_url":"order",
      }

      sendAndCreateNotification(
        user.user_token,
        user.user_id,
        "Order status",
        `your order status: ${req.body.order_status}`,
        data
      );
      
      return { status: 'success', message: 'order status updated successfully' }
    }
    return { status: 'failed', message: 'failed to update order status' }
  } catch (error) {
    return { status: 'error', message: 'an error occurred, please try again'}
  }
}

async function createOrderForUser({ req }) {
  try {
    const invoice_number = generateInvoiceNumber();
    const order_code = await generateOrderCode('ORDER', req.body.name);
    
    delete req.body.name;
    
    const result = await Orders.create({
      ...req.body,
      order_code,
      invoice_number
    });

    const user = await findUserById(req.body.user_id);

    const data = {
      "launch_url":"prescription_pay",
    }
    const sendNotification = sendFCMessage(
      user.fcm_token,
      "Order approved",
      "your order has been approved, please update relevant information",
      data
    );

    const createNotification = _createNewNotification(
      user._id,
      "Order approved",
      "your order has been approved, please update relevant information"
    );
    
    Promise.all([sendNotification, createNotification]).catch((e) => { 
      throw new Error("an error occurred") 
    });

    if (result) {
      return { status: 'success', message: 'order created for user', data: result}
    }
    return { status: 'fail', message: 'failed to create order for user'}
  } catch (error) {
    return { 
      status: 'error', 
      message: 'an error occurred, please try again',
      error
    }
  }
}

async function searchOrder(req) {
  try {
    const searchText = req.body.searchText;
    const filter = {
      $or: [
        { invoice_number: { $regex: searchText, $options: "i" } },
        { order_code: { $regex: searchText, $options: "i" } },
        { payment_status: { $regex: searchText, $options: "i" } },
        { order_status: { $regex: searchText, $options: "i" } },
      ],
    };
    const result = await Orders.find(filter);
    return {
      status: "success",
      message: "data retrieved successfully",
      data: result,
    };
  } catch (error) {
    return {
      status: "error",
      message: "an error occurred",
    };
  }
}

module.exports = {
  cancelOrder,
  approveOrder,
  updateOrderStatus,
  createOrderForUser,
  searchOrder
};
