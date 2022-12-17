const Bookmark = require("../../../schemas/Bookmark")

async function getBookmarkDetails(req) {
    try {
        const result = await Bookmark.findById(req.body.bookmark_id)
        console.log(req.body.bookmark_id)
        return { status: 'success', message: 'bookmark data retrieved', data: result}
    } catch (error) {
        return { status: 'error', message: 'an error occurred, please try again' }
    }
}

module.exports = {
    getBookmarkDetails
}