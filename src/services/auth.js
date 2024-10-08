require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const allowedStatus = require("../config/allowedStatus");
const { sendResponse } = require("../utils/response");

const secret = process.env.JWT_SECRET;

const generateToken = async (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    secret,
    {
      expiresIn: "7h",
    }
  );

  return token;
};

const verifyToken = async (token) => {
  return jwt.verify(token, secret);
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user || null;
  } catch (error) {
    console.log("error***", error);
    throw error;
  }
};
const getUserById = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    return user || null;
  } catch (error) {
    console.log("error***", error);
    throw error;
  }
};
const getUserByUserName = async (username) => {
  try {
    const user = await User.findOne({ username: username });
    return user || null;
  } catch (error) {
    console.log("error***", error);
    throw error;
  }
};

const generateOTP = (length) => {
  const characters = "0123456789";
  let otp = "";

  // Generate a random OTP of the specified length
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};

const extractUsername = (email) => email.split("@")[0];

const getMissingFields = (fields, req) => {
  return fields.filter(
    (field) =>
      !Object.keys(req.body).includes(field) ||
      req.body[field] === undefined || // Check if the field is undefined
      (typeof req.body[field] === "string" && req.body[field].trim() === "")
  );
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhoneNumber = (phoneNumber) =>
  /^\+?[1-9]\d{1,14}$/.test(phoneNumber);

const validateOTP = async (otp, user) => {
  try {
    // Check if OTP matches and is not expired
    const otpExpirationTime = 2 * 60 * 1000; // 2 minutes = 120000 ms

    if (
      user.emailOtp.toString() === otp.toString() &&
      Date.now() - user.emailOtpCreatedAt <= otpExpirationTime
    ) {
      return { valid: true, message: "OTP is valid." };
    } else {
      return { valid: false, message: "Invalid or expired OTP." };
    }
  } catch (error) {
    throw error;
  }
};

const checkIsDeleTed = (user) => {
  return user.isDeleted;
};

const checkUserStatus = ({ user, res, skipOtpVerification = false }) => {
  // If user doesn't exist
  if (!user) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: "User not found",
      title: "Request failed",
    });
  }
  const isDeleted = checkIsDeleTed(user);
  if (isDeleted) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: "User not found",
      title: "Request failed",
    });
  }

  if (!skipOtpVerification) {
    // If OTP is not verified
    if (!user.isEmailOtpVerified) {
      return sendResponse({
        res,
        statusCode: 401,
        status: false,
        message: "Please verify the OTP",
        title: "Request failed",
      });
    }

    // If user account is not approved (either requested or rejected)
    if (
      user.status === allowedStatus.requested ||
      user.status === allowedStatus.reject
    ) {
      return sendResponse({
        res,
        statusCode: 401,
        status: false,
        message: "Your account is not Approved",
        title: "Request failed",
      });
    }
  }

  // If all checks pass
  return null; // You can return a value indicating success if needed
};

module.exports = {
  generateToken,
  verifyToken,
  getUserByEmail,
  getUserByUserName,
  extractUsername,
  getMissingFields,
  validateEmail,
  validatePhoneNumber,
  generateOTP,
  getUserById,
  validateOTP,
  checkUserStatus,
  checkIsDeleTed,
};
