const Ratings = require("../../schemas/Ratings");

async function addNewReview({ req }) {
    try {
        const result = await Ratings.create({
            reviewer_id: req.user._id,
            ...req.body
        })

        return { status: 'success', message: 'review added successfully', data: result}
    } catch (error) {
        return { status: 'error', message: 'an error occurred, please try again' }
    }
}

module.exports = {
    addNewReview
}