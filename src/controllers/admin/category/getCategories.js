require("dotenv").config();
const { Category } = require("../../../models/category");
const { sendResponse } = require("../../../utils/response");

const getCategories = async (req, res) => {
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
    const [totalRecords, Categories] = await Promise.all([
      Category.countDocuments(searchCondition),
      Category.find(searchCondition).skip(skip).limit(limit),
      //   .sort({ createdAt: -1 })
    ]);

    const Response = {
      totalRecords,
      Categories,
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Categories",
      title: "Request success",
      Response,
    });
  } catch (error) {
    console.log("Error getting categories:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error getting categories",
      title: "Request failed",
    });
  }
};

module.exports = { getCategories };
