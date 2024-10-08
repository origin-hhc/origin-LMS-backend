const { createPermission } = require("./createPermission");
const { getPermissions } = require("./getPermissions");
const { updatePermission } = require("./updatePermissions");
const { deletePermission } = require("./deletePermission");

module.exports = {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
};
