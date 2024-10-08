require("dotenv").config();
const bcrypt = require("bcryptjs");

const {
  getMissingFields,
  getUserByEmail,
  generateToken,
  validateEmail,
  generateOTP,
  checkIsDeleTed,
} = require("../../services/auth");
const { sendResponse } = require("../../utils/response");
const { User } = require("../../models/user");
const { sendMail } = require("../../services/mailer");

// Login endpoint
const login = async (req, res) => {
  const { email, password } = req.body;
  const requiredFields = ["email", "password"];

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
    if (!validateEmail(email)) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `Invalid email -: ${email}`,
        title: "Request failed",
      });
    }
    // Check if the email exists
    const userExists = await getUserByEmail(email);

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

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (!passwordMatch) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `Incorrect username or password`,
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
      // _id: userExists._id,
      // email: userExists.email,
      // username: userExists.username,
      // role: userExists?.role,
      // subRoles: userExists?.subRoles,
      token: token,
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
    console.log("Error logging in:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error logging in",
      title: "Request failed",
    });
  }
};

module.exports = { login };
