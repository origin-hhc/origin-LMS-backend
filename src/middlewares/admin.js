const allowedStatus = require("../config/allowedStatus");
const roles = require("../config/roles");
const {
  getUserById,
  verifyToken,
  checkUserStatus,
} = require("../services/auth");
const { sendResponse } = require("../utils/response");

// super admin access
const verifySuperAdminAccess = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== roles.super) {
      return sendResponse({
        res,
        statusCode: 401,
        status: false,
        message: "Super Admin access only",
        title: "Request failed",
      });
    }
    next();
  } catch (error) {
    console.log("error", error);
    return sendResponse({
      res,
      statusCode: 401,
      status: false,
      message: "Super Admin access only",
      title: "Request failed",
    });
  }
};

// include super and admin
const verifyAdminAccess = async (req, res, next) => {
  try {
    if (
      !req.user ||
      (req.user.role !== roles.admin && req.user.role !== roles.super)
    ) {
      return sendResponse({
        res,
        statusCode: 401,
        status: false,
        message: "Admin access only",
        title: "Request failed",
      });
    }
    next();
  } catch (error) {
    console.log("error", error);
    return sendResponse({
      res,
      statusCode: 401,
      status: false,
      message: "Admin access only",
      title: "Request failed",
    });
  }
};

const checkTokenAndAdminAccess = async (req, res, next) => {
  // Check if token is present in the header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from headers
      const token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decode = await verifyToken(token);
      // console.log("decode", decode);

      // // Check if the user exists in database
      const userExists = await getUserById(decode?.id);
      // console.log("userExists", userExists);

      const response = checkUserStatus({ user: userExists, res });

      if (response) {
        return;
      }

      if (
        userExists &&
        userExists.role !== roles.admin &&
        userExists.role !== roles.super
      ) {
        return sendResponse({
          res,
          statusCode: 401,
          status: false,
          message: "Admin access only",
          title: "Request failed",
        });
      }
      req.user = userExists;
    } catch (error) {
      console.log("error", error);
      return sendResponse({
        res,
        statusCode: 401,
        status: false,
        message:
          error?.message === "jwt expired" ? "Token expired" : "Unauthorize",
        title: "Request failed",
      });
    }
  }

  next();
};

module.exports = {
  verifySuperAdminAccess,
  verifyAdminAccess,
  checkTokenAndAdminAccess,
};

// need to check isDeleted In authenticate(checkUserStatus) and checkTokenAndAdminAccess(checkUserStatus)

// middleware used
// authenticate -> verifyAdminAccess
// authenticate -> verifySuperAdminAccess
// checkTokenAndAdminAccess
