const mongoose = require("mongoose");

const accessGropuSchema = new mongoose.Schema(
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

const AccessGroup = mongoose.model("access_group", accessGropuSchema);
module.exports = { AccessGroup };
