require("dotenv").config();

const { User } = require("../../models/user");
const {
  getMissingFields,
  validateOTP,
  generateToken,
} = require("../../services/auth");
const { sendResponse } = require("../../utils/response");

const verifyEmailOTP = async (req, res) => {
  const { otp } = req.body;
  const requiredFields = ["otp"];

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
  }
  try {
    const userExists = req?.user;
    const result = await validateOTP(otp, userExists);

    if (!result?.valid) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: result.message,
        title: "Request failed",
      });
    }

    const user = await User.findByIdAndUpdate(
      userExists._id,
      {
        isEmailOtpVerified: true,
        loginTime: new Date(),
      },
      {
        new: true,
      }
    );

    const token = await generateToken(user);

    const dataToSend = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user?.role,
      subRoles: user?.subRoles,
      token: token,
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "You can login now into your Account.",
      title: "OTP verified",
      Response: dataToSend,
    });
  } catch (error) {
    console.log("Error verifying otp:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error verifying otp",
      title: "Request failed",
    });
  }
};

module.exports = { verifyEmailOTP };
