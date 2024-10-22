require("dotenv").config();
const { AccessGroup } = require("../../../models/accessGroup");
const { sendResponse } = require("../../../utils/response");
const { validatePermissions } = require("./validations/validator");

const updateAccessGroup = async (req, res) => {
  try {
    const { id, name, permissions } = req.body;

    if (!id || !name) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `id and name are required`,
        title: "Request failed",
      });
    }

    if (permissions) {
      await validatePermissions(permissions);
    }

    const updatedAccessGroup = await AccessGroup.findByIdAndUpdate(
      id,
      {
        name: name,
        permissions,
      },
      {
        new: true,
      }
    );

    if (updatedAccessGroup) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "Access group updated",
        title: "Request success",
      });
    } else {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: "No access group found with the given ID",
        title: "Request failed",
      });
    }
  } catch (error) {
    console.log("Error updating access group:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error updating access group",
      title: "Request failed",
    });
  }
};

module.exports = { updateAccessGroup };
