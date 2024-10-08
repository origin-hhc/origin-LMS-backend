const roles = require("../config/roles");
const { sendResponse } = require("../utils/response");

const verifyOTP = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isEmailOtpVerified) {
      return sendResponse({
        res,
        statusCode: 401,
        status: false,
        message: "Please verify the OTP",
        title: "Request failed",
      });
    }
    next();
  } catch (error) {
    return sendResponse({
      res,
      statusCode: 401,
      status: false,
      message: "Please verify the OTP",
      title: "Request failed",
    });
  }
};

module.exports = { verifyOTP };
