require("dotenv").config();
const { SubRole } = require("../../../models/subRoles");
const { sendResponse } = require("../../../utils/response");

const createSubRole = async (req, res) => {
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

    const createdSubRole = await SubRole.create({
      name: name,
    });

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Sub role created",
      title: "Request success",
      Response: createdSubRole,
    });
  } catch (error) {
    console.log("Error creating sub role:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error creating sub role",
      title: "Request failed",
    });
  }
};

module.exports = { createSubRole };
