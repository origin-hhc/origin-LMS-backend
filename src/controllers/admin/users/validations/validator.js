const mongoose = require("mongoose");

// Function to validate subRoles
const validateSubRoles = async (subRoles) => {
  if (!Array.isArray(subRoles) || subRoles.length === 0) {
    throw new Error("subRoles must be a non-empty array");
  }

  const PermissionModel = mongoose.model("sub_role"); // Reference the sub_role model
  const validPermissions = await PermissionModel.find({
    _id: { $in: subRoles },
  }).select("_id"); // Select only the _id field for performance

  //   const validPermissionIds = validPermissions.map((sub_role) => sub_role._id.toString());

  //   // Check for invalid subRoles
  //   const invalidPermissions = subRoles.filter(
  //     (id) => !validPermissionIds.includes(id.toString())
  //   );

  //   if (invalidPermissions.length > 0) {
  //     throw new Error(`Invalid subRoles: ${invalidPermissions.join(", ")}`);
  //   }

  if (validPermissions.length !== subRoles.length) {
    throw new Error("One or more subRoles are invalid.");
  }

  return true; // Return true if validation passes
};

module.exports = { validateSubRoles };
