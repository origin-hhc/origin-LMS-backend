require("dotenv").config();
const allowedStatus = require("../../../config/allowedStatus");
const roles = require("../../../config/roles");
const { User } = require("../../../models/user");
const { sendResponse } = require("../../../utils/response");

const rejectedUsers = async (req, res) => {
  try {
    const userExists = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query?.role || null;

    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    const searchTerm = req.query?.search || null;

    // Role must be "user" if admin is requesting
    let fetchedRoles = [roles.user];

    // Role must be "user" and "admin" also if requested by superAdmin
    if (userExists.role === roles.super) {
      fetchedRoles.push(roles.admin);
    }

    const searchCondition = {
      status: allowedStatus.reject,
    };

    if (role && userExists.role === roles.super) {
      searchCondition.role = { $regex: role, $options: "i", $ne: roles.super };
    } else {
      searchCondition.role = { $in: fetchedRoles };
    }

    if (searchTerm) {
      const searchParts = searchTerm.trim().split(/\s+/); // Split by any whitespace

      if (searchParts.length === 1) {
        // If there's only one term, search in both firstName and lastName separately
        searchCondition.$or = [
          { firstName: { $regex: searchParts[0], $options: "i" } },
          { lastName: { $regex: searchParts[0], $options: "i" } },
        ];
      } else if (searchParts.length === 2) {
        // If there are two parts, consider them as firstName and lastName
        searchCondition.$or = [
          {
            firstName: { $regex: searchParts[0], $options: "i" },
            lastName: { $regex: searchParts[1], $options: "i" },
          },
          {
            firstName: { $regex: searchParts[1], $options: "i" },
            lastName: { $regex: searchParts[0], $options: "i" },
          },
        ];
      } else {
        // For more than two parts, match either field with the full term
        searchCondition.$or = [
          { firstname: { $regex: searchTerm, $options: "i" } },
          { lastname: { $regex: searchTerm, $options: "i" } },
        ];
      }
    }

    // Count the total number of records,  // Fetch the paginated records
    const [totalRecords, rejectedUsersResult] = await Promise.all([
      User.countDocuments(searchCondition),
      User.find(searchCondition)
        .skip(skip)
        .limit(limit)
        .select(
          "-password -__v -emailOtp -emailOtpCreatedAt -isEmailOtpVerified -otp -otpCreatedAt -isOtpVerified"
        )
        .populate({
          path: "accessGroup",
          select: "_id name",
        })
        .sort({ createdAt: -1 }),
    ]);

    const Response = {
      totalRecords,
      rejectedUsersResult,
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Rejected users",
      title: "Request success",
      Response,
    });
  } catch (error) {
    console.log("Error getting rejected users:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error getting rejected users",
      title: "Request failed",
    });
  }
};

module.exports = { rejectedUsers };
