require("dotenv").config();
const allowedStatus = require("../../../config/allowedStatus");
const roles = require("../../../config/roles");
const { User } = require("../../../models/user");
const { sendResponse } = require("../../../utils/response");

const allUsers = async (req, res) => {
  try {
    const userExists = req.user;

    const searchTerm = req?.query?.search || null;
    const accessGroup = req.query?.accessGroup || null;
    const role = req.query?.role || null;
    const subRole = req.query?.subRole || null;
    const status = req.query?.status || null;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    // Role must be "user" if admin is requesting
    let fetchedRoles = [roles.user];

    // Role must "user" and "admin" also if requested by superAdmin
    if (userExists.role === roles.super) {
      fetchedRoles.push(roles.admin);
    }

    let searchCondition = {
      // status: { $ne: allowedStatus.requested }, // Default status filter
      status: { $nin: [allowedStatus.requested, allowedStatus.reject] },
      isDeleted: false,
    };

    if (role && userExists.role === roles.super) {
      searchCondition.role = { $regex: role, $options: "i", $ne: roles.super };
    } else {
      searchCondition.role = { $in: fetchedRoles };
    }

    // assuming status will be "Active", "Inactive"
    if (status === "Active") {
      searchCondition.userStatus = true;
    } else if (status === "Inactive") {
      searchCondition.userStatus = false;
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

    if (accessGroup) {
      searchCondition.accessGroup = accessGroup; // Filter by access group
    }

    if (subRole) {
      const subRoleArray =
        typeof subRole === "string"
          ? subRole.split(",").map((role) => role.trim())
          : Array.isArray(subRole)
          ? subRole
          : [subRole];

      searchCondition.subRoles = {
        $in: subRoleArray,
      }; // Filter by subRole
    }

    // Count the total number of records,  // Fetch the paginated records
    const [totalRecords, allUsers] = await Promise.all([
      User.countDocuments(searchCondition),
      User.find(searchCondition)
        .skip(skip)
        .limit(limit)
        .select(
          "-password -__v -emailOtp -emailOtpCreatedAt -isEmailOtpVerified -phoneOtp -phoneOtpCreatedAt -isPhoneOtpVerified -isOtpVerified -otp -otpCreatedAt"
        )
        .sort({ createdAt: -1 })
        .populate("subRoles")
        .populate({
          path: "createdBy",
          select: "_id name email username role", // Fields to include
        })
        .populate({
          path: "updatedBy",
          select: "_id name email username role", // Fields to include
        })
        .populate({
          path: "deletedBy",
          select: "_id name email username role", // Fields to include
        })
        .populate({
          path: "accessGroup",
          populate: {
            path: "permissions",
          },
        }),
    ]);

    const Response = {
      totalRecords,
      allUsers,
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Users",
      title: "Request success",
      Response,
    });
  } catch (error) {
    console.log("Error getting users:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error getting users",
      title: "Request failed",
    });
  }
};

module.exports = { allUsers };
