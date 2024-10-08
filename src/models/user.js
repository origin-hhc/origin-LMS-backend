const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 25,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNo: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Requested", "Approved", "Rejected"], // Allowed status
      default: "Requested",
    },
    role: {
      type: String,
      required: true,
      enum: ["Super Admin", "Admin", "User"], // Allowed roles
      default: "User",
    },
    subRoles: {
      type: [mongoose.Schema.Types.ObjectId],
      // enum: [
      //   "Trainee-RN",
      //   "Trainee-LPN",
      //   "Trainee-PT",
      //   "Trainee-PTA",
      //   "Trainee-OT",
      //   "Trainee-OTA",
      //   "Trainee-ST",
      // ], // Only allow these values
      required: false,
      ref: "sub_role",
      // validate: {
      //   validator: function (value) {
      //     // Only allow subRoles if the role is "User"
      //     return this.role === "User" || (value && value.length === 0);
      //   },
      //   message: 'subRoles can only be set if role is "User".',
      // },
    },
    accessGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "access_group",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      type: String,
      minLength: 6,
      maxlength: 6,
    },
    // will expire after 2min
    emailOtpCreatedAt: {
      type: Date,
    },
    isEmailOtpVerified: {
      type: Boolean,
      default: false,
    },
    loginTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = { User };
