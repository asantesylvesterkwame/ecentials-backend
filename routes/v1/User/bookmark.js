const router = require('express').Router();


const Bookmark = require('../../../private/schemas/Bookmark');
const verify = require('../../../verifyToken')


// allows a verified user to bookmark an item
router.post('/add-new-bookmark-item', verify, async (req, res) => {
    const user_id = req.user._id;

    const { item_id, bookmark_type } = req.body;

    await Bookmark.create({
        user_id, item_id, bookmark_type
    }, (err, result) => {
      if (err) {
          return res.status(400).json({ message: "Failed to add item." })
      }
      return res.status(200).json({ message: "success", data: result });
    });
});


// list all specific bookmarked items for a user
router.get('/list-bookmark-items', verify, async (req, res) => {
    const user_id = req.user._id;

    const { bookmark_type } = req.body;

    await Bookmark.find({ user_id, bookmark_type }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to fetch bookmarks." });
        }
        return res.status(200).json({ message: "success", data: result });
    }).clone();
}); 

module.exports = router;
