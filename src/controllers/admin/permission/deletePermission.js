require("dotenv").config();
const { Permission } = require("../../../models/permissions");
const { sendResponse } = require("../../../utils/response");

const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `id is required`,
        title: "Request failed",
      });
    }

    const deletedPermission = await Permission.findByIdAndDelete(id);

    if (deletedPermission) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "Permission deleted",
        title: "Request success",
      });
    } else {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: "No permission found with the given ID",
        title: "Request failed",
      });
    }
  } catch (error) {
    console.log("Error deleting permission:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error deleting permission",
      title: "Request failed",
    });
  }
};

module.exports = { deletePermission };
