require("dotenv").config();
const roles = require("../../../config/roles");
const { AccessGroup } = require("../../../models/accessGroup");
const { User } = require("../../../models/user");
const { sendResponse } = require("../../../utils/response");
const { validateSubRoles } = require("./validations/validator");

// this api will invoke to update user

const updateUser = async (req, res) => {
  try {
    const { userIds, subRoles, accessGroup, status } = req?.body;

    const userExists = req.user;

    // Validate userIds
    if (
      !userIds ||
      (typeof userIds === "string" && userIds.trim() === "") ||
      (Array.isArray(userIds) && userIds.length === 0)
    ) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `userIds must be a non-empty array or a valid single user ID`,
        title: "Request failed",
      });
    }

    // Validate status
    if (!["Active", "Inactive"].includes(status)) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `status must be "Active" or "Inactive"`,
        title: "Request failed",
      });
    }

    // Convert userIds to an array if it's a single string
    const idsArray = Array.isArray(userIds) ? userIds : [userIds];

    // If status is Inactive, update isDeleted field
    if (status === "Inactive") {
      const result = await User.updateMany(
        { _id: { $in: idsArray } },
        { isDeleted: true, updatedBy: userExists._id },
        { new: true } // Return the updated documents
      );

      if (result.modifiedCount === 0) {
        return sendResponse({
          res,
          statusCode: 400,
          status: false,
          message: `No users were marked for deletion`,
          title: "Request failed",
        });
      }

      console.log(
        `${result.modifiedCount} ${
          result.modifiedCount > 1 ? "users" : "user"
        } were marked for deletion.`
      );

      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: `${
          result.modifiedCount > 1 ? "Users" : "User"
        } marked for deletion`,
        title: "Request success",
      });
    }

    // Validate subRoles
    await validateSubRoles(subRoles);

    // Validate access group if provided
    if (userExists.role !== roles.admin && accessGroup) {
      const accessGroupPresent = await AccessGroup.findById(accessGroup);
      if (!accessGroupPresent) {
        return sendResponse({
          res,
          statusCode: 400,
          status: false,
          message: `invalid access group`,
          title: "Request failed",
        });
      }
    }

    let updateData = {
      updatedBy: userExists._id,
    };

    // Create filter for updating users
    let filter = { _id: { $in: idsArray } };

    // Only add subRoles if they exist
    if (Array.isArray(subRoles) && subRoles.length > 0) {
      // updateData.$addToSet = { subRoles: { $each: subRoles } }; // Add each subRole to the user's subRoles array (when want to keep previousl value in array and add new)

      updateData.subRoles = subRoles;
    }

    if (userExists.role !== roles.admin && accessGroup) {
      updateData.accessGroup = accessGroup;

      filter.role = roles.admin; //access group can be added for admins only not for users
    }

    if (userExists.role === roles.admin) {
      filter.role = roles.user;
    }

    const result = await User.updateMany(
      filter, // Match the users by the array of userIds and role user if token have role admin
      updateData,
      { new: true } // Return the updated documents
    );

    if (result.modifiedCount > 0) {
      console.log(
        `${result.modifiedCount} ${
          result.modifiedCount > 1 ? "users" : "user"
        } were updated.`
      );
    } else {
      console.log("No users were updated.");
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `No users were updated`,
        title: "Request failed",
      });
    }

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: `${result.modifiedCount > 1 ? "Users" : "User"} updated`,
      title: "Request success",
    });
  } catch (error) {
    console.log(
      `Error updating ${req?.userIds > 1 ? "users" : "user"}`,
      error?.message
    );
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message:
        error?.message ||
        `Error updating ${req?.userIds > 1 ? "users" : "user"}`,
      title: "Request failed",
    });
  }
};

module.exports = { updateUser };
