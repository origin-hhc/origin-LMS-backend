require("dotenv").config();
const { Permission } = require("../../../models/permissions");
const { sendResponse } = require("../../../utils/response");

const createPermission = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `name is required`,
        title: "Request failed",
      });
    }

    const createdPermission = await Permission.create({
      name: name,
    });

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Permission created",
      title: "Request success",
      Response: createdPermission,
    });
  } catch (error) {
    console.log("Error creating permission:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error creating permission",
      title: "Request failed",
    });
  }
};

module.exports = { createPermission };
