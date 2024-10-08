require("dotenv").config();
const { SubRole } = require("../../../models/subRoles");
const { sendResponse } = require("../../../utils/response");

const getSubRoles = async (req, res) => {
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
    const [totalRecords, subRoles] = await Promise.all([
      SubRole.countDocuments(searchCondition),
      SubRole.find(searchCondition).skip(skip).limit(limit),
      //   .sort({ createdAt: -1 })
    ]);

    const Response = {
      totalRecords,
      subRoles,
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Sub roles",
      title: "Request success",
      Response,
    });
  } catch (error) {
    console.log("Error getting sub roles:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error getting sub roles",
      title: "Request failed",
    });
  }
};

module.exports = { getSubRoles };
