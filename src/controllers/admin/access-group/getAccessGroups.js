require("dotenv").config();
const { AccessGroup } = require("../../../models/accessGroup");
const { sendResponse } = require("../../../utils/response");

const getAccessGroups = async (req, res) => {
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
    const [totalRecords, AccessGroups] = await Promise.all([
      AccessGroup.countDocuments(searchCondition),
      AccessGroup.find(searchCondition)
        .skip(skip)
        .limit(limit)
        .populate("permissions"),
      //   .sort({ createdAt: -1 })
    ]);

    const Response = {
      totalRecords,
      AccessGroups,
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Access groups",
      title: "Request success",
      Response,
    });
  } catch (error) {
    console.log("Error getting access groups:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error getting access groups",
      title: "Request failed",
    });
  }
};

module.exports = { getAccessGroups };
