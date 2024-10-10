const { createAccessGroup } = require("./createAccessGroup");
const { deleteAccessGroup } = require("./deleteAccessGroup");
const { getAccessGroups } = require("./getAccessGroups");
const { updateAccessGroup } = require("./updateAccessGroup");

module.exports = {
  getAccessGroups,
  createAccessGroup,
  updateAccessGroup,
  deleteAccessGroup,
};
