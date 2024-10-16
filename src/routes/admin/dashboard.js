const express = require("express");
const { authenticate } = require("../../middlewares/authenticate");
const { verifyAdminAccess } = require("../../middlewares/admin");
const { verifyOTP } = require("../../middlewares/verifyOTP");
const { dashboard } = require("../../controllers/admin/dashboard");

const router = express.Router();

router.get("/dashboard", authenticate, verifyAdminAccess, verifyOTP, dashboard);
module.exports = router;
