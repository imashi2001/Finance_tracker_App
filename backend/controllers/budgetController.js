const Budget = require("../models/Budget");

const duplicateMessage = "A budget already exists for this category and month";

const getBudgets = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { userId: req.user._id };

    if (month) query.month = month;

    const budgets = await Budget.find(query).sort({ month: -1, category: 1 });
    return res.json(budgets);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch budgets" });
  }
};

const createBudget = async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({ message: "Category, amount, and month are required" });
    }

    const budget = await Budget.create({
      category,
      amount,
      month,
      userId: req.user._id,
    });

    return res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: duplicateMessage });
    }

    return res.status(400).json({ message: error.message || "Failed to create budget" });
  }
};

const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: duplicateMessage });
    }

    return res.status(400).json({ message: error.message || "Failed to update budget" });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to delete budget" });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};
