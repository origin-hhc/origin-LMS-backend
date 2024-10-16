const express = require("express");
const { authenticate } = require("../../middlewares/authenticate");
const {
  verifyAdminAccess,
  verifySuperAdminAccess,
} = require("../../middlewares/admin");
const {
  createSubRole,
  updateSubRole,
  deleteSubRole,
  getSubRoles,
} = require("../../controllers/admin/sub-roles");
const { verifyOTP } = require("../../middlewares/verifyOTP");

const router = express.Router();

router.get(
  "/sub-roles",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  getSubRoles
);
router.post(
  "/create-sub-role",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  createSubRole
);
router.put(
  "/update-sub-role",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  updateSubRole
);
router.delete(
  "/sub-role/:id",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  deleteSubRole
);

module.exports = router;
