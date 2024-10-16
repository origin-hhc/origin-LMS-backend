const express = require("express");
const { authenticate } = require("../../middlewares/authenticate");
const { verifyAdminAccess } = require("../../middlewares/admin");
const {
  pendingRegistrations,
  allUsers,
  updateUser,
  updateUserStatus,
  deletedUsers,
  rejectedUsers,
} = require("../../controllers/admin/users");
const { verifyOTP } = require("../../middlewares/verifyOTP");

const router = express.Router();

router.get(
  "/pending-registrations",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  pendingRegistrations
);
router.get("/users", authenticate, verifyAdminAccess, verifyOTP, allUsers);
router.put(
  "/update-user-status",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  updateUserStatus
);
router.put(
  "/update-user",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  updateUser
);
router.get(
  "/deleted-users",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  deletedUsers
);
router.get(
  "/rejected-users",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  rejectedUsers
);
module.exports = router;
