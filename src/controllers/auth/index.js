const { forgotPassword } = require("./forgotPassword");
const { login } = require("./login");
const { register } = require("./register");
const { resetPassword } = require("./resetPassword");
const { verifyEmailOTP } = require("./verifyEmailOTP");

module.exports = {
  register,
  login,
  verifyEmailOTP,
  forgotPassword,
  resetPassword,
};
