const ObjectId = require('mongoose').Types.ObjectId;

const { BOOKMARK_LOOKUP, BOOKMARK_RETURN_DATA } = require('../../../helpers/constants');
const Bookmark = require("../../../schemas/Bookmark")

async function getBookmarkDetails(req) {
    try {
        const result = await Bookmark.findById(req.body.bookmark_id)
        
        return { status: 'success', message: 'bookmark data retrieved', data: result}
    } catch (error) {
        return { status: 'error', message: 'an error occurred, please try again' }
    }
}

async function getBookmarkItems(req) {
    try {
        const result = await Bookmark.aggregate([
            {
                $match: {
                    user_id: ObjectId(req.user._id),
                    ...req.body
                }
            },
            ...BOOKMARK_LOOKUP,
            {
                $project: {
                    ...BOOKMARK_RETURN_DATA 
                }
            }
        ])
        return { status: 'success', message: 'bookmarked items retrieved', data: result }
    } catch (error) {
        return { status: 'error', message: 'an error occurred, please try again' }
    }
}

module.exports = {
    getBookmarkDetails,
    getBookmarkItems
}