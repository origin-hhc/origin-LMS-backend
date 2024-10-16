require("dotenv").config();
const allowedStatus = require("../../../config/allowedStatus");
const { User } = require("../../../models/user");
const { sendResponse } = require("../../../utils/response");

const dashboard = async (req, res) => {
  try {
    // Count the total number of records,  // Fetch the paginated records
    const [totalRecords, activeUser, requestedUser] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        userStatus: true,
      }),
      User.countDocuments({
        status: allowedStatus.requested,
      }),
    ]);

    const Response = {
      usersOverview: {
        totalRecords,
        activeUser,
        requestedUser,
      },
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "dashboard",
      title: "Request success",
      Response,
    });
  } catch (error) {
    console.log("Error in dashboard api:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error in dashboard api",
      title: "Request failed",
    });
  }
};

module.exports = { dashboard };
