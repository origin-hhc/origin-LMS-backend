const express = require("express");
const { authenticate } = require("../../middlewares/authenticate");
const {
  verifyAdminAccess,
  verifySuperAdminAccess,
} = require("../../middlewares/admin");

const { verifyOTP } = require("../../middlewares/verifyOTP");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/admin/category");

const router = express.Router();

router.get(
  "/categories",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  getCategories
);
router.post(
  "/create-category",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  createCategory
);
router.put(
  "/update-category",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  updateCategory
);
router.delete(
  "/category/:id",
  authenticate,
  verifyAdminAccess,
  verifyOTP,
  deleteCategory
);
module.exports = router;
