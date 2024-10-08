require("dotenv").config();
const { Permission } = require("../../../models/permissions");
const { sendResponse } = require("../../../utils/response");

const updatePermission = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `id and name are required`,
        title: "Request failed",
      });
    }

    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      {
        name: name,
      },
      {
        new: true,
      }
    );

    if (updatedPermission) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "Permission updated",
        title: "Request success",
        Response: updatedPermission,
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
    console.log("Error updating permission:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error updating permission",
      title: "Request failed",
    });
  }
};

module.exports = { updatePermission };
