const { ObjectId } = require("mongoose").Types;

const { WalletException } = require("../../exceptions/wallet");
const Wallet = require("../../schemas/Wallet");
const WalletTransactions = require("../../schemas/WalletTransactions");

// create a new ecentials wallet
async function createWallet(req) {
  try {
    const result = await Wallet.create({ user_id: req.user._id });

    if (!result) {
      return {
        status: "failed",
        message: "Failed to create wallet. Try again later"
      };
    }
    return {
      status: "success",
      message: "wallet created successfully", 
      data: result
    };
  } catch (error) {
    throw new WalletException(
      `could not create wallet. ${error}`
    );
  }
}

// get user wallet's balance
async function getWalletBalance(userId) {
  try {
    const balance = await Wallet.findOne({ userId }, { _id: 0, balance: 1 });
    return { message: "success", data: balance };
  } catch (error) {
    return { message: "An error occurred when retrieving using balance" };
  }
}

// retrieve recently performed wallet transactions
async function recentWalletTransactions(userId) {
  try {
    const transactions = await WalletTransactions.find({ userId }).limit(5);
    return { message: "success", data: transactions };
  } catch (error) {
    return {
      message: "An error occurred when retrieving recent wallet transactions",
    };
  }
}

async function getWalletInformation(req) {
  try {
    const result = await Wallet.aggregate([
      {
        $match: {
          user_id: ObjectId(req.user._id),
        }
      },
      {
        $lookup: {
          from: "wallettransactions",
          localField: "walletId",
          foreignField: "_id",
          as: "transactions",
        }
      },
      {
        $unwind: {
          path: "$transactions",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $project: {
          _id: 1,
          balance: 1,
          createdAt: 1,
          updatedAt: 1,
          transactions: "$transactions"
        }
      }
    ]);

    if (!result) {
      return {
        status: "failed",
        message: "wallet information not found"
      };
    }

    return {
      status: "success",
      message: "successfully retrieved wallet information",
      data: result,
    };
  } catch (error) {
    throw new WalletException(
      `could not get wallet information. ${error}`
    );
  }
}

module.exports = {
  createWallet,
  getWalletBalance,
  recentWalletTransactions,
  getWalletInformation,
};
