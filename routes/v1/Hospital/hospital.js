const fs = require('fs')
const router = require('express').Router();
const multer = require('multer')

const Hospital = require('../../../private/schemas/Hospital');


const upload = multer({ dest: './uploads' });


// create a new hospital using data from request body
router.post('/add-new-hospital', (req, res) => {
    const {
        name,
        address,
        opening_hours,
        phone_number,
        gps_address,
    } = req.body;

    Hospital.create({
        name, address, opening_hours, phone_number, gps_address
    }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to create a hospital" });
        }
        return res.status(200).json({ message: "success", data: result });
    })
});


// upload images of a hospital
router.post('/upload-hospital-images', upload.array("pictures", 15), async (req, res) => {
    const { hospital_id } = req.body;

    const pictures = req.files;

    let images = [];

    if (pictures.length > 0 && pictures != null ) {
        pictures.forEach(picture => {
            const newImg = fs.readFileSync(picture.path);
            const encImg = newImg.toString('base64');
            const image = {
                data: Buffer.from(encImg, 'base64'),
                contentType: picture.mimetype
            }
            images.push(image);
        });
    }
    await Hospital.updateOne({ _id: hospital_id }, { images }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Failed to upload images" });
        }
        return res.status(200).json({ message: "success", data: result });
    }).clone();
})

module.exports = router;
