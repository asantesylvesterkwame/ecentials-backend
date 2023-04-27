const router = require("express").Router();

// user related endpoints
router.use("/api/v1/user", require("./User/auth"));
router.use("/api/v1/user/account", require("./User/userAccount"));
router.use("/api/v1/user/logs", require("./User/logData"));
router.use(
  "/api/v1/user/notifications",
  require("./User/Notifications/notification")
);
router.use("/api/v1/user/favourites", require("./User/favourites"));
router.use("/api/v1/user/orders", require("./User/orders"));
router.use("/api/v1/user/cart", require("./User/cart"));
router.use("/api/v1/user/checkout", require("./User/checkout"));
router.use("/api/v1/user/bookmarks", require("./User/bookmark"));
router.use("/api/v1/user/appointments", require("./User/appointment"));
router.use(
  "/api/v1/user/shipping-address",
  require("./User/UserAddress/user_address.controller")
);

// pharmacy related details endpoints
router.use("/api/v1/pharmacies", require("./Pharmacy/pharmacy"));

router.use("/api/v1/pharmacy/drugs", require("./Pharmacy/drug"));
router.use(
  "/api/v1/pharmacy/customers",
  require("./Pharmacy/Customers/customers.controller")
);
router.use(
  "/api/v1/pharmacy/wholesaler",
  require("./Pharmacy/Wholesaler/wholesaler.controller")
);
router.use(
  "/api/v1/pharmacy/sales",
  require("./Pharmacy/Sales/sales.controller")
);
router.use("/api/v1/pharmacy/orders", require("./Pharmacy/orders"));
router.use(
  "/api/v1/pharmacy/invoice",
  require("./Pharmacy/Invoice/invoice.controller")
);
router.use("/api/v1/pharmacy/staff", require("./Pharmacy/staff.controller"));
router.use(
  "/api/v1/pharmacy/information",
  require("./Pharmacy/Information/information.controller")
);
router.use(
  "/api/v1/pharmacy/drug-category",
  require("./Pharmacy/DrugCategory/drugCategory.controller")
);
router.use(
  "/api/v1/pharmacy/returns",
  require("./Pharmacy/Returns/returns.controller")
);

// pescription related endpoints
router.use("/api/v1/prescriptions", require("./Prescription/prescription"));

// hospital related endpoints
router.use("/api/v1/hospitals", require("./Hospital/hospital"));
router.use("/api/v1/hospital/staff", require("./Hospital/staff"));
router.use("/api/v1/hospitals", require("./Hospital/appointment.controller"));

// lab related endpoints
router.use("/api/v1/labs", require("./Lab/lab.controller"));

// ambulance related endpoints
router.use("/api/v1/ambulance", require("./Ambulance/vehicle.controller"));

// business owner endpoints
router.use(
  "/api/v1/business-owner",
  require("./BusinessOwner/businessOwner.controller")
);

// business owner and staff passwords endpoints
router.use("/api/v1/accounts", require("./User/auth"));

// paystack initialization endpoints
router.use("/api/v1/wallet", require("./Wallet/wallet.controller"));
router.use(
  "/api/v1/wallet/paystack",
  require("./Wallet/Paystack/paystack.controller")
);

// reviews endpoint
router.use("/api/v1/reviews", require("./Reviews/reviews.controller"));

module.exports = router;
