/* eslint-disable no-underscore-dangle */

const { ObjectId } = require("mongoose").Types;

const { WalletException } = require("../../exceptions/wallet");
const Wallet = require("../../schemas/Wallet");
const WalletTransactions = require("../../schemas/WalletTransactions");
const { encryptData, decryptData } = require("../../helpers/encryption");
const { verifyPaystackTransaction } = require("./Paystack/paystack.service");

// create a new ecentials wallet
async function createWallet(req) {
  try {
    const result = await Wallet.create({ user_id: req.user._id });

    if (!result) {
      return {
        status: "failed",
        message: "Failed to create wallet. Try again later",
      };
    }
    return {
      status: "success",
      message: "wallet created successfully",
      data: result,
    };
  } catch (error) {
    throw new WalletException(`could not create wallet. ${error}`);
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
        },
      },
      {
        $lookup: {
          from: "wallettransactions",
          localField: "walletId",
          foreignField: "_id",
          as: "transactions",
        },
      },
      {
        $unwind: {
          path: "$transactions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          balance: 1,
          createdAt: 1,
          updatedAt: 1,
          transactions: "$transactions",
        },
      },
    ]);

    if (!result) {
      return {
        status: "failed",
        message: "wallet information not found",
      };
    }

    return {
      status: "success",
      message: "successfully retrieved wallet information",
      data: result,
    };
  } catch (error) {
    throw new WalletException(`could not get wallet information. ${error}`);
  }
}

const encryptCardDetails = (data) => encryptData(data);

async function addCreditCard({ req }) {
  try {
    const { walletId } = req.body;

    delete req.body.walletId;

    const result = await Wallet.findByIdAndUpdate(walletId, {
      $push: {
        cards: {
          ...req.body,
          cardNumber: encryptCardDetails(req.body.cardNumber),
          cvc: encryptCardDetails(req.body.cvc),
        },
      },
    });
    if (!result) {
      return {
        status: "failed",
        message: "failed to add credit card to wallet",
      };
    }
    return {
      status: "success",
      message: "credit card added to wallet successfully",
    };
  } catch (error) {
    throw new WalletException(`could not add credit card. ${error}`);
  }
}

async function getCards(req) {
  try {
    const result = await Wallet.findById(req.params.walletId);
    if (!result) {
      return {
        status: "failed",
        message: "failed to fetch wallet",
      };
    }
    return {
      status: "success",
      message: "cards retrieved successfully",
      data: result.cards.map((value) => ({
        ...value,
        cardNumber: decryptData(value.cardNumber),
      })),
    };
  } catch (error) {
    throw new WalletException(`could not fetch cards. ${error}`);
  }
}

async function topUpEcentialsWallet(req) {
  try {
    const response = await verifyPaystackTransaction(req.body.reference);
   const parsedData = JSON.parse(response);

    if (parsedData.data.status !== "success") {
      // meaning transaction was not successful
      return {
        status: "failed",
        message: "failed to top up wallet",
      };
    }

    const transactionDetails = {
      walletId: req.body.walletId,
      transaction_type: "top-up",
      amount: req.body.amount,
      status: "successful",
      currency: "GHS",
    }

    const [result1, result2] = Promise.all([
      _createWalletTransaction(transactionDetails),
      _updateWalletBalance(req.body.walletId, req.body.amount),
    ]);

    if (!result1 && !result2) {
      return {
        status: "failed",
        message: "failed to top up wallet",
      };
    }

    return {
      status: "success",
      message: "ecentials wallet top up successful",
      data: result2,
    };

  } catch (error) {
    throw new WalletException(
      `an error ocurred. ${error}`
    );
  }
}

async function _createWalletTransaction(params) {
  return await WalletTransactions.create(params);
}

async function _updateWalletBalance(walletId, amount) {
  return await Wallet.findByIdAndUpdate(
    walletId,
    {
     $inc: { balance: amount },
    }
  );
}

module.exports = {
  createWallet,
  getWalletBalance,
  recentWalletTransactions,
  getWalletInformation,
  addCreditCard,
  getCards,
  topUpEcentialsWallet,
};
