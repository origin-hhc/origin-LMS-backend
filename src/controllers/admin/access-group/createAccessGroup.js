require("dotenv").config();
const { AccessGroup } = require("../../../models/accessGroup");
const { sendResponse } = require("../../../utils/response");

const createAccessGroup = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `name is required`,
        title: "Request failed",
      });
    }

    await validatePermissions(permissions);

    const createdAccessGroup = await AccessGroup.create({
      name: name,
      permissions,
    });

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Access group created",
      title: "Request success",
      Response: createdAccessGroup,
    });
  } catch (error) {
    console.log("Error creating access group:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error creating access group",
      title: "Request failed",
    });
  }
};

module.exports = { createAccessGroup };
