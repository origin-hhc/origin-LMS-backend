const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    subRoles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "sub_role",
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", categorySchema);
module.exports = { Category };
