const Category = require("../models/Category");

const duplicateMessage = "This category already exists";

const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { userId: req.user._id };

    if (type) query.type = type;

    const categories = await Category.find(query).sort({ type: 1, name: 1 });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch categories" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const category = await Category.create({
      name,
      type,
      userId: req.user._id,
    });

    return res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: duplicateMessage });
    }

    return res.status(400).json({ message: error.message || "Failed to create category" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: duplicateMessage });
    }

    return res.status(400).json({ message: error.message || "Failed to update category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to delete category" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
