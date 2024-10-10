const express = require("express");
const { authenticate } = require("../../middlewares/authenticate");
const {
  verifyAdminAccess,
  verifySuperAdminAccess,
} = require("../../middlewares/admin");

const { verifyOTP } = require("../../middlewares/verifyOTP");

const {
  getAccessGroups,
  createAccessGroup,
  updateAccessGroup,
  deleteAccessGroup,
} = require("../../controllers/admin/access-group");

const router = express.Router();

router.get(
  "/access-groups",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  getAccessGroups
);
router.post(
  "/create-access-group",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  createAccessGroup
);
router.put(
  "/update-access-group",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  updateAccessGroup
);
router.delete(
  "/access-group/:id",
  authenticate,
  verifySuperAdminAccess,
  verifyOTP,
  deleteAccessGroup
);
module.exports = router;
