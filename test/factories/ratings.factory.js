/* eslint-disable */
const Ratings = require("../../private/schemas/Ratings");

class RatingsFactory {
  constructor(reviewer_id, recipient_id, recipient_type, message, rating) {
    this.reviewer_id = reviewer_id;
    this.recipient_id = recipient_id;
    this.recipient_type = recipient_type;
    this.message = message;
    this.rating = rating;
  }

  static async create(ratingsfactory) {
    const ratings = await Ratings.create({
      reviewer_id: ratingsfactory.reviewer_id,
      recipient_id: ratingsfactory.recipient_id,
      recipient_type: ratingsfactory.recipient_type,
      rating: ratingsfactory.rating,
      message: ratingsfactory.message,
    });

    return ratings;
  }
}

module.exports = RatingsFactory;
