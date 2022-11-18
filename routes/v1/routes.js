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
router.use('/api/v1/user/appointments', require('./User/appointment'))
router.use('/api/v1/user/wallet', require('./User/Wallet/wallet.controller'))
router.use('/api/v1/user/shipping-address', require('./User/UserAddress/user_address.controller'))

// pharmacy related details endpoints
router.use('/api/v1/pharmacies', require('./Pharmacy/pharmacy'))

router.use('/api/v1/pharmacy/drugs', require('./Pharmacy/drug'))
router.use('/api/v1/pharmacy/orders', require('./Pharmacy/orders'))
router.use('/api/v1/pharmacy/staff', require('./Pharmacy/staff.controller'))
router.use('/api/v1/pharmacy/information', require('./Pharmacy/Information/information.controller'))
router.use('/api/v1/pharmacy/drug-category', require('./Pharmacy/DrugCategory/drugCategory.controller'))

// pescription related endpoints
router.use('/api/v1/prescriptions', require('./Prescription/prescription'))

// hospital related endpoints
router.use('/api/v1/hospitals', require('./Hospital/hospital'))
router.use('/api/v1/hospital/staffs', require('./Hospital/staff'))


// lab related endpoints
router.use('/api/v1/labs', require('./Lab/lab.controller'))

// business owner endpoints
router.use('/api/v1/business-owner', require('./BusinessOwner/businessOwner.controller'))


module.exports = router
