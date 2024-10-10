const { createCategory } = require("./createCategory");
const { deleteCategory } = require("./deleteCategory");
const { getCategories } = require("./getCategories");
const { updateCategory } = require("./updateCategory");

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
