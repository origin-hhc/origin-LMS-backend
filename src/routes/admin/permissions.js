const express = require("express");
const { authenticate } = require("../../middlewares/authenticate");
const {
  verifyAdminAccess,
  verifySuperAdminAccess,
} = require("../../middlewares/admin");

const { verifyOTP } = require("../../middlewares/verifyOTP");

const {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} = require("../../controllers/admin/permission");

const router = express.Router();

router.get(
  "/permissions",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  getPermissions
);
router.post(
  "/create-permission",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  createPermission
);
router.put(
  "/update-permission",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  updatePermission
);
router.delete(
  "/permission/:id",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  deletePermission
);
module.exports = router;
