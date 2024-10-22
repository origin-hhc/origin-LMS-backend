require("dotenv").config();
const bcrypt = require("bcryptjs");

const { User } = require("../../models/user");
const {
  getUserByEmail,
  generateToken,
  getUserByUserName,
  getMissingFields,
  validateEmail,
  generateOTP,
} = require("../../services/auth");
const { sendResponse } = require("../../utils/response");
const { sendMail } = require("../../services/mailer");
const allowedStatus = require("../../config/allowedStatus");
const roles = require("../../config/roles");
const { validateSubRoles } = require("../admin/users/validations/validator");
const allowedUserStatus = require("../../config/allowedUserStatus");

const validateNameFields = (data) => {
  const namePattern = /^[A-Za-z]+$/;
  const invalidFields = [];

  ["firstName", "lastName"].forEach((field) => {
    if (!namePattern.test(data[field])) {
      invalidFields.push(field);
    }
  });

  return invalidFields;
};

const validateRequest = async (req, res) => {
  const {
    firstName,
    lastName,
    password,
    confirmPassword,
    username,
    email,
    role,
    subRoles,
  } = req.body;
  const createdBy = req?.user?._id || null;
  const createdByRole = req?.user?.role || null;
  const requiredFields = [
    "firstName",
    "lastName",
    "username",
    "email",
    "password",
    "confirmPassword",
  ];

  // Check for missing fields
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

  // to check firstname and lastname contain letter only
  const invalidFields = validateNameFields(req.body);

  if (invalidFields.length > 0) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: `Invalid characters in ${
        invalidFields.length === 1 ? "field" : "fields"
      }: ${invalidFields.join(", ")}`,
      title: "Validation failed",
    });
  }

  // Validate password and confirm password match
  if (password !== confirmPassword) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: "Password and Confirm Password do not match",
      title: "Request failed",
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: `Invalid email: ${email}`,
      title: "Request failed",
    });
  }

  // Check if the email already exists
  const [userExists, userNameExists] = await Promise.all([
    getUserByEmail(email),
    getUserByUserName(username),
  ]);
  if (userExists) {
    return sendResponse({
      res,
      statusCode: 409,
      status: false,
      message: `User with email ${email} already exists.`,
      title: "Request failed",
    });
  }
  if (userNameExists) {
    return sendResponse({
      res,
      statusCode: 409,
      status: false,
      message: `User with username ${username} already exists.`,
      title: "Request failed",
    });
  }

  // Validate role and subRoles for createdBy users
  if (createdBy) {
    if (!role) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: "Mention the role of user",
        title: "Request failed",
      });
    }

    await validateSubRoles(subRoles);
  } else if (role && role !== roles.admin && role !== roles.user) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: "Only admin or user role is allowed",
      title: "Request failed",
    });
  }
  // Check that admin can't register another admin
  if (createdBy && createdByRole === roles.admin && role === roles.admin) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: "Admin can't register another admin",
      title: "Request failed",
    });
  }

  return null;
};

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    phoneNo,
    role,
    subRoles,
  } = req.body;
  const createdBy = req?.user?._id || null;

  try {
    // Validate request fields
    const validationError = await validateRequest(req, res);
    if (validationError) return validationError;

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = {
      firstName,
      lastName,
      email,
      username: username.toLowerCase(),
      password: hashedPassword,
      // role: "Super Admin",
      phoneNo: phoneNo || null,
    };

    if (role) {
      newUser.role = role;
    }

    if (createdBy) {
      newUser.createdBy = createdBy;
      newUser.status = allowedStatus.approve;
      newUser.subRoles = subRoles;
      newUser.userStatus = allowedUserStatus.active;
      newUser.createdTime = new Date();
    }
    const user = await User.create(newUser);

    if (createdBy) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "User added successfully",
        title: "Request Sucess",
      });
    }

    const [token, emailOtp] = await Promise.all([
      generateToken(user),
      generateOTP(6),
    ]);

    user.emailOtp = emailOtp;
    user.emailOtpCreatedAt = new Date();

    await user.save();

    const dataToSend = {
      // _id: user._id,
      // email: user.email,
      // username: user.username,
      // role: user?.role,
      // subRoles: user?.subRoles,
      token: token,
      isPhoneOtpVerified: false,
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
    console.log("Error registering user:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error.message || "Error registering user",
      title: "Request failed",
    });
  }
};

module.exports = { register };
