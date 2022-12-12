const router = require('express').Router()

const { addNewReview, getReviews } = require('../../../private/services/Reviews/reviews.service');
const { verify } = require("../../../verifyToken");

router.post('/add-new-review', verify, async (req, res, next) => {
    try {
        const result = await addNewReview({ req })

        if (result.status === 'success') {
            return res.status(201).json(result)
        }

        return res.status(400).json(result)
    } catch (error) {
        next(error)
    }
})

router.post('/get-reviews', verify, async (req, res, next) => {
    try {
        const result = await getReviews({ req })

        if (result.status === 'success') {
            return res.status(200).json(result)
        }

        return res.status(400).json(result)
    } catch (error) {
        next(error)
    }
})

module.exports = router
