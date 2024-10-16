require("dotenv").config();

const { User } = require("../../models/user");
const {
  getMissingFields,
  getUserByEmail,
  validateEmail,
  generateToken,
  generateOTP,
  checkIsDeleTed,
} = require("../../services/auth");
const { sendMail } = require("../../services/mailer");
const { sendResponse } = require("../../utils/response");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const requiredFields = ["email"];

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
    let userExists = null;
    if (validateEmail(email)) {
      // Check if the email exists
      userExists = await getUserByEmail(email);
    } else {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `Invalid email`,
        title: "Request failed",
      });
    }

    // if user not exists
    if (!userExists) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `User with ${email} is not registered`,
        title: "Request failed",
      });
    }

    const isDeleted = checkIsDeleTed(userExists);
    if (isDeleted) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: "User not found",
        title: "Request failed",
      });
    }

    const [token, emailOtp] = await Promise.all([
      generateToken(userExists),
      generateOTP(6),
    ]);

    const user = await User.findByIdAndUpdate(
      userExists._id,
      {
        emailOtp: emailOtp,
        emailOtpCreatedAt: new Date(),
        isEmailOtpVerified: false,
      },
      {
        new: true,
      }
    );

    const dataToSend = {
      token: token,
      isPhoneOtpVerified: userExists.isPhoneOtpVerified || false,
    };

    await sendMail({
      to: email,
      subject: "Verification Code for Your Account",
      code: emailOtp,
    });

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Please check your email",
      title: "OTP sent",
      Response: dataToSend,
    });
  } catch (error) {
    console.log("Error sending OTP:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error sending OTP",
      title: "Request failed",
    });
  }
};

module.exports = { forgotPassword };
