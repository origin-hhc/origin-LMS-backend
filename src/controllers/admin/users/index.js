const { allUsers } = require("./allUsers");
const { pendingRegistrations } = require("./pendingRegistrations");
const { updateUser } = require("./updateUser");
const { updateUserStatus } = require("./updateUserStatus");

module.exports = {
  pendingRegistrations,
  allUsers,
  updateUser,
  updateUserStatus,
};
