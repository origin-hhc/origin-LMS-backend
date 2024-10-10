require("dotenv").config();
const { Category } = require("../../../models/category");
const { sendResponse } = require("../../../utils/response");
const { validateSubRoles } = require("../users/validations/validator");

const updateCategory = async (req, res) => {
  try {
    const { id, name, description, subRoles } = req.body;

    if (!id || !name || !description) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `id, name and description are required`,
        title: "Request failed",
      });
    }

    await validateSubRoles(subRoles);

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        description,
        subRoles,
      },
      {
        new: true,
      }
    );

    if (updatedCategory) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: "Category updated",
        title: "Request success",
        Response: updatedCategory,
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
    console.log("Error updating category:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error updating category",
      title: "Request failed",
    });
  }
};

module.exports = { updateCategory };
