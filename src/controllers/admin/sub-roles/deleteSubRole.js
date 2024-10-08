require("dotenv").config();
const { SubRole } = require("../../../models/subRoles");
const { sendResponse } = require("../../../utils/response");

const deleteSubRole = async (req, res) => {
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

    const deletedSubRole = await SubRole.findByIdAndDelete(id);

    if (deletedSubRole) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "Sub role deleted",
        title: "Request success",
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
    console.log("Error deleting sub role:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error deleting sub role",
      title: "Request failed",
    });
  }
};

module.exports = { deleteSubRole };
