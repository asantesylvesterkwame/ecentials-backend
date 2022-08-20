const router = require('express').Router();

// user related endpoints
router.use('/api/v1/user', require('./User/auth'))
router.use('/api/v1/user/account', require('./User/userAccount'))
router.use('/api/v1/user/logs', require('./User/logData'))
router.use('/api/v1/user/notifications', require('./User/Notifications/notification'))
router.use('/api/v1/user/favourites', require('./User/favourites'))
router.use('/api/v1/user/orders', require('./User/orders'))
router.use('/api/v1/user/cart', require('./User/cart'))
router.use('/api/v1/user/checkout', require('./User/checkout'))
router.use('/api/v1/user/bookmarks', require('./User/bookmark'))

// pharmacy related details endpoints
router.use('/api/v1/pharmacies', require('./Pharmacy/pharmacy'))

router.use('/api/v1/pharmacy/drugs', require('./Pharmacy/drug'))
router.use('/api/v1/pharmacy/orders', require('./Pharmacy/orders'))

// pescription related endpoints
router.use('/api/v1/prescriptions', require('./Prescription/prescription'))

// hospital related endpoints
router.use('/api/v1/hospitals', require('./Hospital/hospital'))

module.exports = router
