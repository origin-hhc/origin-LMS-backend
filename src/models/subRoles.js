const mongoose = require("mongoose");

const subRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const SubRole = mongoose.model("sub_role", subRoleSchema);
module.exports = { SubRole };
