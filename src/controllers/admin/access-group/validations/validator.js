const mongoose = require("mongoose");

// Function to validate permissions
const validatePermissions = async (permissions) => {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    throw new Error("Permissions must be a non-empty array");
  }

  const PermissionModel = mongoose.model("permission"); // Reference the permission model
  const validPermissions = await PermissionModel.find({
    _id: { $in: permissions },
  }).select("_id"); // Select only the _id field for performance

  //   const validPermissionIds = validPermissions.map((permission) => permission._id.toString());

  //   // Check for invalid permissions
  //   const invalidPermissions = permissions.filter(
  //     (id) => !validPermissionIds.includes(id.toString())
  //   );

  //   if (invalidPermissions.length > 0) {
  //     throw new Error(`Invalid permissions: ${invalidPermissions.join(", ")}`);
  //   }

  if (validPermissions.length !== permissions.length) {
    throw new Error("One or more permissions are invalid.");
  }

  return true; // Return true if validation passes
};

module.exports = { validatePermissions };
