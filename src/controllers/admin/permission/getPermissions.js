require("dotenv").config();
const { Permission } = require("../../../models/permissions");
const { sendResponse } = require("../../../utils/response");

const getPermissions = async (req, res) => {
  try {
    const searchTerm = req.query?.search || null;
    const searchCondition = searchTerm
      ? { name: { $regex: searchTerm, $options: "i" } } // 'i' for case-insensitive search
      : {};

    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    // Count the total number of records,  // Fetch the paginated records
    const [totalRecords, Permissions] = await Promise.all([
      Permission.countDocuments(searchCondition),
      Permission.find(searchCondition).skip(skip).limit(limit),
      //   .sort({ createdAt: -1 })
    ]);

    const Response = {
      totalRecords,
      Permissions,
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Permissions",
      title: "Request success",
      Response,
    });
  } catch (error) {
    console.log("Error getting permissions:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error getting permissions",
      title: "Request failed",
    });
  }
};

module.exports = { getPermissions };
