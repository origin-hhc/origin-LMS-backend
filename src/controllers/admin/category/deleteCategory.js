require("dotenv").config();
const { Category } = require("../../../models/category");
const { sendResponse } = require("../../../utils/response");

const deleteCategory = async (req, res) => {
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

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (deletedCategory) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "Category deleted",
        title: "Request success",
      });
    } else {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: "No category found with the given ID",
        title: "Request failed",
      });
    }
  } catch (error) {
    console.log("Error deleting category:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error deleting category",
      title: "Request failed",
    });
  }
};

module.exports = { deleteCategory };
