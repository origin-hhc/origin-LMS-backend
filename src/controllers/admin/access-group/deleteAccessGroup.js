require("dotenv").config();
const { AccessGroup } = require("../../../models/accessGroup");
const { sendResponse } = require("../../../utils/response");

const deleteAccessGroup = async (req, res) => {
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

    const deletedAccessGroup = await AccessGroup.findByIdAndDelete(id);

    if (deletedAccessGroup) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "Access group deleted",
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
    console.log("Error deleting access group:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error deleting access group",
      title: "Request failed",
    });
  }
};

module.exports = { deleteAccessGroup };
