const mongoose = require("mongoose");

const accessGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    permissions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "permission",
      required: true,
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message: "Permissions array must have at least one item.",
      },
    },
  },
  { timestamps: true }
);

// Pre-hook middleware to handle reference removal before the accessGroup document is deleted
// accessGroupSchema.pre("findOneAndDelete", async function (next) {
//   const accessGroupId = this.getQuery()["_id"]; // Get the ID of the accessGroup being deleted

//   try {
//     // Remove references to this accessGroup in the User collection
//     await User.updateMany(
//       { accessGroup: accessGroupId }, // Match users with this accessGroup ID
//       { $set: { accessGroup: null } } // set as null

//       // { $pull: { accessGroups: accessGroupId } } // to remove the id rom the array
//     );

//     console.log(
//       `References to accessGroup ${accessGroupId} removed from related collections.`
//     );
//   } catch (err) {
//     console.error("Error removing accessGroup references:", err);
//     return next(err); // Pass the error to the next middleware
//   }

//   next(); // Proceed to the actual deletion of the accessGroup document
// });

const AccessGroup = mongoose.model("access_group", accessGroupSchema);
module.exports = { AccessGroup };
