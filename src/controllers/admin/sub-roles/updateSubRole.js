require("dotenv").config();
const { SubRole } = require("../../../models/subRoles");
const { sendResponse } = require("../../../utils/response");

const updateSubRole = async (req, res) => {
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

    const updatedSubRole = await SubRole.findByIdAndUpdate(
      id,
      {
        name: name,
      },
      {
        new: true,
      }
    );

    if (updatedSubRole) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "Sub role updated",
        title: "Request success",
        Response: updatedSubRole,
      });
    } else {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: "No sub role found with the given ID",
        title: "Request failed",
      });
    }
  } catch (error) {
    console.log("Error updating sub role:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error updating sub role",
      title: "Request failed",
    });
  }
};

module.exports = { updateSubRole };
