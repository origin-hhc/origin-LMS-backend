const express = require("express");
const {
  register,
  login,
  verifyEmailOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { authenticate } = require("../middlewares/authenticate");
const { checkTokenAndAdminAccess } = require("../middlewares/admin");
const { checkUsername } = require("../controllers/auth/checkUsername");
const router = express.Router();

router.post("/register", checkTokenAndAdminAccess, register);
router.post("/login", login);
router.post("/verify-email-otp", authenticate, verifyEmailOTP);
router.post("/forgot-password", forgotPassword);
router.post("/resend-email-otp", forgotPassword);
router.post("/reset-password", authenticate, resetPassword);
router.get("/check-username", checkUsername);

module.exports = router;
