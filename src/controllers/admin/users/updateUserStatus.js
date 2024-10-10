require("dotenv").config();
const actions = require("../../../config/action");
const allowedStatus = require("../../../config/allowedStatus");
const roles = require("../../../config/roles");
const { User } = require("../../../models/user");
const { sendResponse } = require("../../../utils/response");
const { validateSubRoles } = require("./validations/validator");

// this api will invoke when have to update the status from pending registrations list

const updateUserStatus = async (req, res) => {
  try {
    const { userIds, subRoles, action } = req?.body;

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

    // Convert userIds to an array if it's a single string
    const idsArray = Array.isArray(userIds) ? userIds : [userIds];

    // Validate action
    if (![actions.approve, actions.reject].includes(action)) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `action must be "Approve" or "Reject"`,
        title: "Request failed",
      });
    }

    const isRejectionWithValidSubRoles =
      action === actions.reject && subRoles && subRoles.length > 0;

    if (action !== actions.reject || isRejectionWithValidSubRoles) {
      await validateSubRoles(subRoles);
    }

    let updateData = {
      status:
        action === actions.approve
          ? allowedStatus.approve
          : allowedStatus.reject,
      updatedBy: userExists._id,
    };

    // Create filter for updating users
    let filter = { _id: { $in: idsArray }, status: allowedStatus.requested };

    // Only add subRoles if they exist
    if (Array.isArray(subRoles) && subRoles.length > 0) {
      // updateData.$addToSet = { subRoles: { $each: subRoles } }; // Add each subRole to the user's subRoles array (when want to keep previousl value in array and add new)

      updateData.subRoles = subRoles;
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

module.exports = { updateUserStatus };
