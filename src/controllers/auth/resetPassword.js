require("dotenv").config();
const bcrypt = require("bcryptjs");

const { User } = require("../../models/user");

const { getMissingFields } = require("../../services/auth");
const { sendResponse } = require("../../utils/response");

const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const requiredFields = ["password", "confirmPassword"];

  // Check if all required fields are present in the request body
  const missingFields = getMissingFields(requiredFields, req);

  if (missingFields.length > 0) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
      title: "Request failed",
    });
  } else if (password !== confirmPassword) {
    // Validate password and confirmPassword
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: "Password and Confirm Password does not match",
      title: "Request failed",
    });
  }
  try {
    const userExists = req?.user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      userExists._id,
      {
        password: hashedPassword,
        isEmailOtpVerified: false,
      },
      {
        new: true,
      }
    );

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "You can login now into your Account.",
      title: "Password has been changed",
    });
  } catch (error) {
    console.log("Error reseting password:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error reseting password",
      title: "Request failed",
    });
  }
};

module.exports = { resetPassword };
