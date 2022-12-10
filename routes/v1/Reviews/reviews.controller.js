const router = require('express').Router()

const { addNewReview } = require('../../../private/services/Reviews/reviews.service');
const { verify } = require("../../../verifyToken");

router.post('/add-new-reviewer', verify, async (req, res, next) => {
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

module.exports = router
