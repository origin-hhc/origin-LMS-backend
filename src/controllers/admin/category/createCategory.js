require("dotenv").config();
const { Category } = require("../../../models/category");
const { sendResponse } = require("../../../utils/response");
const { validateSubRoles } = require("../users/validations/validator");

const createCategory = async (req, res) => {
  try {
    const { name, description, subRoles } = req.body;

    if (!name || !description) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: `name and description are required`,
        title: "Request failed",
      });
    }

    await validateSubRoles(subRoles);

    const createdCategory = await Category.create({
      name,
      description,
      subRoles,
    });

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: "Category created",
      title: "Request success",
      Response: createdCategory,
    });
  } catch (error) {
    console.log("Error creating category:", error?.message);
    return sendResponse({
      res,
      statusCode: 500,
      status: false,
      message: error?.message || "Error creating category",
      title: "Request failed",
    });
  }
};

module.exports = { createCategory };
