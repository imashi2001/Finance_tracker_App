const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (category) query.category = category;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch transactions" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: "Title, amount, type, and category are required" });
    }

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      note,
      userId: req.user._id,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to create transaction" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to update transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to delete transaction" });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
