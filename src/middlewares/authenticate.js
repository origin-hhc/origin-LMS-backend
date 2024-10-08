require("dotenv").config();
const {
  verifyToken,
  getUserById,
  checkUserStatus,
} = require("../services/auth");
const { sendResponse } = require("../utils/response");

const authenticate = async (req, res, next) => {
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

      const skipOtpVerificationApis = [
        "/api/verify-email-otp",
        "/api/verify-phone-otp",
      ]; //api where don/t require to check otp
      const skipOtpVerification = skipOtpVerificationApis.includes(
        req.originalUrl
      );
      const response = checkUserStatus({
        user: userExists,
        res,
        skipOtpVerification,
      });

      if (response) {
        return;
      }
      req.user = userExists;

      next();
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
  } else {
    return sendResponse({
      res,
      statusCode: 401,
      status: false,
      message: "Token is required",
      title: "Request failed",
    });
  }
};

module.exports = { authenticate };
