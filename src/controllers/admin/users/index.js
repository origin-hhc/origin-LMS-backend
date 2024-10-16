const { allUsers } = require("./allUsers");
const { deletedUsers } = require("./deletedUsers");
const { pendingRegistrations } = require("./pendingRegistrations");
const { rejectedUsers } = require("./rejectedUsers");
const { updateUser } = require("./updateUser");
const { updateUserStatus } = require("./updateUserStatus");

module.exports = {
  pendingRegistrations,
  allUsers,
  updateUser,
  updateUserStatus,
  deletedUsers,
  rejectedUsers,
};
